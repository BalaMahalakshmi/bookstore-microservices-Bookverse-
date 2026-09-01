from pymongo import ReturnDocument
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os
import re
from .auth import require_admin, verify_internal_service
from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from .models import Book, BookCreate, BookUpdate, ReservationRequest

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")

DATABASE_NAME = os.getenv("DATABASE_NAME", "bookstore")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=5000,
    )

    try:
        await app.mongodb_client.admin.command("ping")
        print("Connected to MongoDB")
    except Exception:
        app.mongodb_client.close()
        raise

    app.mongodb = app.mongodb_client[DATABASE_NAME]

    # Create useful indexes
    await app.mongodb.books.create_index("category")
    await app.mongodb.books.create_index("title")
    await app.mongodb.books.create_index("author")

    yield

    app.mongodb_client.close()
    print("MongoDB connection closed")


app = FastAPI(
    title="Book Service",
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------


def book_helper(book: dict) -> dict:
    return {
        "_id": str(book["_id"]),
        "title": book["title"],
        "author": book["author"],
        "description": book.get("description", ""),
        "price": book["price"],
        "category": book["category"],
        "stock": book.get("stock", 0),
        "rating": book.get("rating", 4.5),
        "created_at": book.get("created_at"),
        "updated_at": book.get("updated_at"),
    }


def validate_book_id(book_id: str) -> ObjectId:
    if not ObjectId.is_valid(book_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid book ID",
        )

    return ObjectId(book_id)


# ---------------------------------------------------------
# Health checks
# ---------------------------------------------------------


@app.get("/health/live")
async def liveness_check():
    return {
        "status": "alive",
        "service": "book-service",
    }


@app.get("/health/ready")
async def readiness_check():
    try:
        await app.mongodb_client.admin.command("ping")

        return {
            "status": "ready",
            "service": "book-service",
            "database": "connected",
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "not_ready",
                "service": "book-service",
                "database": "unavailable",
            },
        )


# ---------------------------------------------------------
# Get all books
# ---------------------------------------------------------


@app.get(
    "/books",
    response_model=list[Book],
)
async def get_books(
    category: str | None = None,
    search: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    query = {}

    if category:
        query["category"] = category

    if search:
        safe_search = re.escape(search)

        query["$or"] = [
            {
                "title": {
                    "$regex": safe_search,
                    "$options": "i",
                }
            },
            {
                "author": {
                    "$regex": safe_search,
                    "$options": "i",
                }
            },
        ]

    cursor = app.mongodb.books.find(query).skip(skip).limit(limit)

    books = await cursor.to_list(length=limit)

    return [book_helper(book) for book in books]


# ---------------------------------------------------------
# Get categories
# ---------------------------------------------------------


@app.get(
    "/books/categories",
    response_model=list[str],
)
async def get_categories():
    categories = await app.mongodb.books.distinct("category")

    return sorted(categories)


# ---------------------------------------------------------
# Get single book
# ---------------------------------------------------------


@app.get(
    "/books/{book_id}",
    response_model=Book,
)
async def get_book(book_id: str):
    object_id = validate_book_id(book_id)

    book = await app.mongodb.books.find_one({"_id": object_id})

    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )

    return book_helper(book)


# ---------------------------------------------------------
# Create book - ADMIN ONLY
# ---------------------------------------------------------


@app.post(
    "/books",
    response_model=Book,
    status_code=status.HTTP_201_CREATED,
)
async def create_book(
    book: BookCreate,
    current_user: dict = Depends(require_admin),
):
    now = datetime.now(timezone.utc)

    book_dict = book.model_dump()

    book_dict["created_at"] = now.isoformat()
    book_dict["updated_at"] = now.isoformat()

    result = await app.mongodb.books.insert_one(book_dict)

    created_book = await app.mongodb.books.find_one({"_id": result.inserted_id})

    return book_helper(created_book)


# ---------------------------------------------------------
# Update book - ADMIN ONLY
# ---------------------------------------------------------


@app.put(
    "/books/{book_id}",
    response_model=Book,
)
async def update_book(
    book_id: str,
    book_update: BookUpdate,
    current_user: dict = Depends(require_admin),
):
    object_id = validate_book_id(book_id)

    update_data = book_update.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = await app.mongodb.books.update_one(
        {"_id": object_id},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )

    updated_book = await app.mongodb.books.find_one({"_id": object_id})

    return book_helper(updated_book)


# ---------------------------------------------------------
# Delete book - ADMIN ONLY
# ---------------------------------------------------------


@app.delete(
    "/books/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_book(
    book_id: str,
    current_user: dict = Depends(require_admin),
):
    object_id = validate_book_id(book_id)

    result = await app.mongodb.books.delete_one({"_id": object_id})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found",
        )

    return None


@app.post("/internal/books/reserve")
async def reserve_books(
    request: ReservationRequest,
    _: bool = Depends(verify_internal_service),
):
    reserved = []

    try:
        for item in request.items:

            if not ObjectId.is_valid(item.book_id):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid book ID: {item.book_id}",
                )

            book_id = ObjectId(item.book_id)

            book = await app.mongodb.books.find_one_and_update(
                {
                    "_id": book_id,
                    "stock": {
                        "$gte": item.quantity,
                    },
                },
                {
                    "$inc": {
                        "stock": -item.quantity,
                    }
                },
                return_document=ReturnDocument.AFTER,
            )

            if not book:
                raise HTTPException(
                    status_code=409,
                    detail=f"Insufficient stock for book {item.book_id}",
                )

            reserved.append(
                {
                    "book_id": str(book["_id"]),
                    "title": book["title"],
                    "quantity": item.quantity,
                    "unit_price": float(book["price"]),
                }
            )

        return {
            "success": True,
            "items": reserved,
        }

    except HTTPException:

        if reserved:
            for item in reserved:
                await app.mongodb.books.update_one(
                    {
                        "_id": ObjectId(item["book_id"]),
                    },
                    {
                        "$inc": {
                            "stock": item["quantity"],
                        }
                    },
                )

        raise

    except Exception:

        if reserved:
            for item in reserved:
                await app.mongodb.books.update_one(
                    {
                        "_id": ObjectId(item["book_id"]),
                    },
                    {
                        "$inc": {
                            "stock": item["quantity"],
                        },
                    },
                )

        raise HTTPException(
            status_code=500,
            detail="Failed to reserve books",
        )

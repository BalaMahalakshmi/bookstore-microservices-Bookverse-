from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os

from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument

from .auth import get_current_user, require_admin
from .book_client import release_books, reserve_books
from .models import (
    OrderCreate,
    OrderStatus,
)

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb://localhost:27017",
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "bookstore",
)


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

    await app.mongodb.orders.create_index("user_id")

    await app.mongodb.orders.create_index("status")

    await app.mongodb.orders.create_index("created_at")

    yield

    app.mongodb_client.close()
    print("MongoDB connection closed")


app = FastAPI(
    title="Order Service",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health/live")
async def liveness_check():
    return {
        "status": "alive",
        "service": "order-service",
    }


@app.get("/health/ready")
async def readiness_check():

    try:
        await app.mongodb_client.admin.command("ping")

        return {
            "status": "ready",
            "service": "order-service",
            "database": "connected",
        }

    except Exception:

        raise HTTPException(
            status_code=503,
            detail={
                "status": "not_ready",
                "service": "order-service",
                "database": "unavailable",
            },
        )


def serialize_order(order: dict):

    return {
        "id": str(order["_id"]),
        "user_id": order["user_id"],
        "username": order["username"],
        "items": order["items"],
        "total_amount": order["total_amount"],
        "status": order["status"],
        "created_at": order["created_at"],
        "updated_at": order["updated_at"],
    }


@app.post(
    "/orders",
    status_code=status.HTTP_201_CREATED,
)
async def create_order(
    request: OrderCreate,
    current_user: dict = Depends(get_current_user),
):

    reservation_items = [
        {
            "book_id": item.book_id,
            "quantity": item.quantity,
        }
        for item in request.items
    ]

    reserved = await reserve_books(reservation_items)

    order_items = []

    total_amount = 0.0

    for item in reserved["items"]:

        subtotal = item["unit_price"] * item["quantity"]

        order_items.append(
            {
                "book_id": item["book_id"],
                "title": item["title"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"],
                "subtotal": subtotal,
            }
        )

        total_amount += subtotal

    now = datetime.now(timezone.utc)

    order_document = {
        "user_id": current_user["username"],
        "username": current_user["username"],
        "items": order_items,
        "total_amount": round(
            total_amount,
            2,
        ),
        "status": OrderStatus.CONFIRMED.value,
        "created_at": now,
        "updated_at": now,
    }

    try:

        result = await app.mongodb.orders.insert_one(order_document)

    except Exception:

        await release_books(reservation_items)

        raise HTTPException(
            status_code=500,
            detail="Unable to create order",
        )

    created_order = await app.mongodb.orders.find_one(
        {
            "_id": result.inserted_id,
        }
    )

    return serialize_order(created_order)


@app.get("/orders/me")
async def get_my_orders(
    current_user: dict = Depends(get_current_user),
):

    cursor = app.mongodb.orders.find(
        {
            "user_id": current_user["username"],
        }
    ).sort(
        "created_at",
        -1,
    )

    orders = await cursor.to_list(length=100)

    return [serialize_order(order) for order in orders]


@app.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
):

    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid order ID",
        )

    order = await app.mongodb.orders.find_one(
        {
            "_id": ObjectId(order_id),
        }
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order["user_id"] != current_user["username"] and current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return serialize_order(order)


@app.get("/orders")
async def get_all_orders(
    current_user: dict = Depends(require_admin),
):

    cursor = app.mongodb.orders.find().sort(
        "created_at",
        -1,
    )

    orders = await cursor.to_list(length=500)

    return [serialize_order(order) for order in orders]


@app.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    new_status: OrderStatus,
    current_user: dict = Depends(require_admin),
):

    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid order ID",
        )

    order = await app.mongodb.orders.find_one(
        {
            "_id": ObjectId(order_id),
        }
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    now = datetime.now(timezone.utc)

    updated_order = await app.mongodb.orders.find_one_and_update(
        {
            "_id": ObjectId(order_id),
        },
        {
            "$set": {
                "status": new_status.value,
                "updated_at": now,
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    return serialize_order(updated_order)

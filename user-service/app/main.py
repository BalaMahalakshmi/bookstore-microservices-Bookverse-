import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta, timezone
from contextlib import asynccontextmanager

from app.models import UserCreate, UserLogin, Token, UserResponse
from app.auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    get_current_user,
)

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "bookstore")
SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")

ADMIN_EMAIL = os.getenv(
    "ADMIN_EMAIL",
    "admin@bookstore.com",
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not set! Check your .env file.")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set! Check your .env file.")

if not ADMIN_PASSWORD:
    raise ValueError("ADMIN_PASSWORD is not set!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    app.mongodb = app.mongodb_client[DATABASE_NAME]
    await app.mongodb_client.admin.command("ping")
    await app.mongodb.users.create_index("username", unique=True)

    await app.mongodb.users.create_index("email", unique=True)

    # Create admin user if not exists

    # Create admin user if not exists

    # Create admin user if it does not exist.
    # The upsert is atomic, which is important when multiple
    # Kubernetes replicas start at the same time.

    now = datetime.now(timezone.utc).isoformat()

    admin_user = {
        "username": ADMIN_USERNAME,
        "email": ADMIN_EMAIL,
        "hashed_password": get_password_hash(ADMIN_PASSWORD),
        "role": "admin",
        "created_at": now,
        "updated_at": now,
    }

    await app.mongodb.users.update_one(
        {"username": ADMIN_USERNAME},
        {"$setOnInsert": admin_user},
        upsert=True,
    )
    yield

    app.mongodb_client.close()


app = FastAPI(title="User Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def user_helper(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "created_at": user.get("created_at"),
        "updated_at": user.get("updated_at"),
    }


@app.get("/health/live")
async def liveness_check():
    return {
        "status": "alive",
        "service": "user-service",
    }


@app.get("/health/ready")
async def readiness_check():
    try:
        await app.mongodb_client.admin.command("ping")

        return {
            "status": "ready",
            "service": "user-service",
            "database": "connected",
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        )


@app.post(
    "/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(user_data: UserCreate):
    existing_user = await app.mongodb.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    existing_email = await app.mongodb.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    now = datetime.now(timezone.utc).isoformat()

    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": get_password_hash(user_data.password),
        "role": "user",
        "created_at": now,
        "updated_at": now,
    }

    result = await app.mongodb.users.insert_one(user_dict)
    created_user = await app.mongodb.users.find_one({"_id": result.inserted_id})
    return user_helper(created_user)


@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await app.mongodb.users.find_one({"username": user_data.username})

    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": user["username"], "role": user.get("role", "user")},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_helper(user),
    }


@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await app.mongodb.users.find_one({"username": current_user["username"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_helper(user)


@app.get("/users", response_model=list[UserResponse])
async def get_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    cursor = app.mongodb.users.find()
    users = await cursor.to_list(length=100)
    return [user_helper(user) for user in users]

from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    role: str = "user"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        populate_by_name = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

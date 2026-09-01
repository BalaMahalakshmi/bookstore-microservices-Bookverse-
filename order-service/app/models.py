from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class OrderItemRequest(BaseModel):
    book_id: str
    quantity: int = Field(gt=0, le=100)


class OrderCreate(BaseModel):
    items: list[OrderItemRequest] = Field(min_length=1)


class OrderItem(BaseModel):
    book_id: str
    title: str
    quantity: int
    unit_price: float
    subtotal: float


class OrderResponse(BaseModel):
    id: str
    user_id: str
    username: str
    items: list[OrderItem]
    total_amount: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

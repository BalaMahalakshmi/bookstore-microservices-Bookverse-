from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    description: str = Field(default="", max_length=2000)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    stock: int = Field(default=0, ge=0)
    rating: float = Field(default=4.5, ge=0, le=5)


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    author: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=2000)
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, min_length=1, max_length=100)
    stock: Optional[int] = Field(default=None, ge=0)
    rating: Optional[float] = Field(default=None, ge=0, le=5)


class Book(BookBase):
    id: str = Field(..., alias="_id")
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class ReservationItem(BaseModel):
    book_id: str
    quantity: int = Field(
        gt=0,
        le=100,
    )


class ReservationRequest(BaseModel):
    items: list[ReservationItem]

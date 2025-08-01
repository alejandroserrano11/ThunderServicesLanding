from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Product Models
class Product(BaseModel):
    id: int
    name: str
    category: str  # "relojes", "zapatillas", "ropa"
    image: str
    price: str
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    category: str
    image: str
    price: str
    featured: bool = False

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    image: str
    price: str
    featured: bool

# Testimonial Models
class Testimonial(BaseModel):
    id: int
    name: str
    rating: int  # 1-5
    review: str
    initials: str
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    rating: int
    review: str
    initials: str
    approved: bool = True

class TestimonialResponse(BaseModel):
    id: int
    name: str
    rating: int
    review: str
    initials: str

# Analytics Models
class TelegramClick(BaseModel):
    event: str = "telegram_click"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_agent: Optional[str] = None
    referrer: Optional[str] = None

class TelegramClickCreate(BaseModel):
    user_agent: Optional[str] = None
    referrer: Optional[str] = None

class AnalyticsResponse(BaseModel):
    success: bool
    message: str
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Product Models
class Product(BaseModel):
    id: int
    name: str
    category: str  # "relojes", "zapatillas", "ropa"
    image: Optional[str] = None  # Now optional since we use placeholders
    price: Optional[str] = None  # Now optional since prices are hidden
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    category: str
    image: Optional[str] = None
    price: Optional[str] = None
    featured: bool = False

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    image: Optional[str] = None
    price: Optional[str] = None
    featured: bool

# Testimonial Models - Updated for image-based reviews
class Testimonial(BaseModel):
    id: int
    name: str
    rating: int  # 1-5
    review: Optional[str] = ""  # Made optional for image-based reviews
    initials: Optional[str] = ""  # Made optional for image-based reviews
    review_image: Optional[str] = None  # New field for review images
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    rating: int
    review: Optional[str] = ""
    initials: Optional[str] = ""
    review_image: Optional[str] = None
    approved: bool = True

class TestimonialResponse(BaseModel):
    id: int
    name: str
    rating: int
    review: Optional[str] = ""
    initials: Optional[str] = ""
    review_image: Optional[str] = None

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
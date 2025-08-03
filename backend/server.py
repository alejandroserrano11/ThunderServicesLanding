from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime

# Import models and database
from models import (
    Product, ProductResponse, ProductCreate,
    Testimonial, TestimonialResponse, TestimonialCreate,
    TelegramClick, TelegramClickCreate, AnalyticsResponse
)
from database import Database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Thunder Services API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Thunder Services API is running", "status": "healthy"}

# Product endpoints
@api_router.get("/products", response_model=List[ProductResponse])
async def get_products():
    """Get all products with watches (featured) first - no prices needed"""
    try:
        products = await Database.get_all_products()
        return [ProductResponse(
            id=p.id,
            name=p.name,
            category=p.category,
            image=p.image,  # Will be None for placeholder products
            price=p.price,  # Will be None since prices are hidden in frontend
            featured=p.featured
        ) for p in products]
    except Exception as e:
        logging.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@api_router.post("/products", response_model=ProductResponse)
async def create_product(product_data: ProductCreate):
    """Create a new product (admin functionality)"""
    try:
        # Get next ID
        existing_products = await Database.get_all_products()
        next_id = max([p.id for p in existing_products], default=0) + 1
        
        product = Product(
            id=next_id,
            **product_data.dict()
        )
        
        created_product = await Database.create_product(product)
        return ProductResponse(
            id=created_product.id,
            name=created_product.name,
            category=created_product.category,
            image=created_product.image,
            price=created_product.price,
            featured=created_product.featured
        )
    except Exception as e:
        logging.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

# Testimonial endpoints
@api_router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_testimonials():
    """Get all approved testimonials"""
    try:
        testimonials = await Database.get_all_testimonials()
        return [TestimonialResponse(
            id=t.id,
            name=t.name,
            rating=t.rating,
            review=t.review,
            initials=t.initials
        ) for t in testimonials]
    except Exception as e:
        logging.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Error fetching testimonials")

@api_router.post("/testimonials", response_model=TestimonialResponse)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    try:
        # Get next ID
        existing_testimonials = await Database.get_all_testimonials()
        next_id = max([t.id for t in existing_testimonials], default=0) + 1
        
        testimonial = Testimonial(
            id=next_id,
            **testimonial_data.dict()
        )
        
        created_testimonial = await Database.create_testimonial(testimonial)
        return TestimonialResponse(
            id=created_testimonial.id,
            name=created_testimonial.name,
            rating=created_testimonial.rating,
            review=created_testimonial.review,
            initials=created_testimonial.initials
        )
    except Exception as e:
        logging.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Error creating testimonial")

# Analytics endpoints
@api_router.post("/telegram-click", response_model=AnalyticsResponse)
async def track_telegram_click(request: Request, click_data: TelegramClickCreate):
    """Track Telegram button click for analytics"""
    try:
        # Get user agent from request headers
        user_agent = request.headers.get("user-agent", "")
        referrer = request.headers.get("referer", "")
        
        telegram_click = TelegramClick(
            user_agent=user_agent or click_data.user_agent,
            referrer=referrer or click_data.referrer
        )
        
        success = await Database.track_telegram_click(telegram_click)
        
        if success:
            return AnalyticsResponse(success=True, message="Telegram click tracked successfully")
        else:
            return AnalyticsResponse(success=False, message="Failed to track telegram click")
            
    except Exception as e:
        logging.error(f"Error tracking telegram click: {e}")
        return AnalyticsResponse(success=False, message="Error tracking telegram click")

@api_router.get("/analytics/telegram-clicks")
async def get_telegram_clicks_count():
    """Get total telegram clicks count"""
    try:
        count = await Database.get_telegram_clicks_count()
        return {"total_clicks": count}
    except Exception as e:
        logging.error(f"Error getting telegram clicks count: {e}")
        raise HTTPException(status_code=500, detail="Error getting analytics data")

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on startup"""
    try:
        logger.info("Starting Thunder Services API...")
        # Seed database with initial data
        await Database.seed_all()
        logger.info("Database initialization completed")
    except Exception as e:
        logger.error(f"Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    try:
        Database.close_connection()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
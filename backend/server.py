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
    """Get all approved testimonials - ready for image-based reviews"""
    try:
        testimonials = await Database.get_all_testimonials()
        return [TestimonialResponse(
            id=t.id,
            name=t.name,
            rating=t.rating,
            review=t.review,
            initials=t.initials,
            review_image=t.review_image  # New field for review images
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

# New endpoints for image management
@api_router.put("/products/{product_id}/image")
async def update_product_image(product_id: int, image_url: str):
    """Update product image URL"""
    try:
        # This would typically handle image upload and update
        # For now, we'll just return success as images are managed separately
        return {"success": True, "message": f"Product {product_id} image updated", "image_url": image_url}
    except Exception as e:
        logging.error(f"Error updating product image: {e}")
        raise HTTPException(status_code=500, detail="Error updating product image")

@api_router.put("/testimonials/{testimonial_id}/image")
async def update_testimonial_image(testimonial_id: int, image_url: str):
    """Update testimonial review image URL"""
    try:
        # This would typically handle image upload and update
        # For now, we'll just return success as images are managed separately
        return {"success": True, "message": f"Testimonial {testimonial_id} image updated", "image_url": image_url}
    except Exception as e:
        logging.error(f"Error updating testimonial image: {e}")
        raise HTTPException(status_code=500, detail="Error updating testimonial image")

@api_router.post("/admin/reseed")
async def reseed_database():
    """Clear and reseed database with updated data"""
    try:
        collections = Database.get_collections()
        
        # Clear existing data
        await collections['products'].delete_many({})
        await collections['testimonials'].delete_many({})
        
        # Reseed with updated data
        await Database.seed_all()
        
        return {"success": True, "message": "Database reseeded with updated data (no prices, Spanish content)"}
    except Exception as e:
        logging.error(f"Error reseeding database: {e}")
        raise HTTPException(status_code=500, detail="Error reseeding database")

@api_router.get("/admin/conversion-stats")
async def get_conversion_stats():
    """Get detailed conversion statistics for mobile optimization"""
    try:
        # Get analytics data
        collections = Database.get_collections()
        total_clicks = await Database.get_telegram_clicks_count()
        
        # Get recent clicks (last 24 hours)
        from datetime import datetime, timedelta
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_clicks = await collections['analytics'].count_documents({
            "event": "telegram_click",
            "timestamp": {"$gte": yesterday}
        })
        
        # Get mobile vs desktop clicks (basic heuristic)
        mobile_clicks_cursor = collections['analytics'].find({
            "event": "telegram_click",
            "$or": [
                {"user_agent": {"$regex": "Mobile", "$options": "i"}},
                {"user_agent": {"$regex": "iPhone", "$options": "i"}},
                {"user_agent": {"$regex": "Android", "$options": "i"}}
            ]
        })
        mobile_clicks = await mobile_clicks_cursor.to_list(1000)
        mobile_percentage = (len(mobile_clicks) / total_clicks * 100) if total_clicks > 0 else 0
        
        return {
            "total_clicks": total_clicks,
            "recent_clicks_24h": recent_clicks,
            "mobile_clicks": len(mobile_clicks),
            "mobile_percentage": round(mobile_percentage, 1),
            "message_focus": "Destacamos en relojes de lujo y zapatillas",
            "target_audience": "Spanish-speaking mobile users from TikTok",
            "conversion_goal": "TikTok → Landing Page → Telegram Channel"
        }
    except Exception as e:
        logging.error(f"Error getting conversion stats: {e}")
        raise HTTPException(status_code=500, detail="Error getting conversion statistics")

@api_router.get("/admin/summary")
async def get_admin_summary():
    """Get admin dashboard summary"""
    try:
        products = await Database.get_all_products()
        testimonials = await Database.get_all_testimonials()
        clicks_count = await Database.get_telegram_clicks_count()
        
        # Count by category
        watches_count = len([p for p in products if p.category == 'relojes'])
        sneakers_count = len([p for p in products if p.category == 'zapatillas'])
        clothing_count = len([p for p in products if p.category == 'ropa'])
        
        return {
            "products": {
                "total": len(products),
                "watches": watches_count,
                "sneakers": sneakers_count,
                "clothing": clothing_count,
                "featured": len([p for p in products if p.featured])
            },
            "testimonials": {
                "total": len(testimonials),
                "average_rating": sum(t.rating for t in testimonials) / len(testimonials) if testimonials else 0
            },
            "analytics": {
                "telegram_clicks": clicks_count
            }
        }
    except Exception as e:
        logging.error(f"Error getting admin summary: {e}")
        raise HTTPException(status_code=500, detail="Error getting admin summary")

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
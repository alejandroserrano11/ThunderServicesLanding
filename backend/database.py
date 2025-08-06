from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List
from models import Product, Testimonial, TelegramClick

class Database:
    _client = None
    _db = None
    
    @classmethod
    def get_db(cls):
        if cls._client is None:
            mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
            db_name = os.environ.get('DB_NAME', 'test_database')
            cls._client = AsyncIOMotorClient(mongo_url)
            cls._db = cls._client[db_name]
        return cls._db
    
    @classmethod
    def get_collections(cls):
        db = cls.get_db()
        return {
            'products': db.products,
            'testimonials': db.testimonials,
            'analytics': db.analytics
        }

    # Product operations
    @staticmethod
    async def get_all_products() -> List[Product]:
        """Get all products, with featured (watches) first"""
        collections = Database.get_collections()
        cursor = collections['products'].find().sort([("featured", -1), ("category", 1), ("id", 1)])
        products = await cursor.to_list(1000)
        return [Product(**product) for product in products]
    
    @staticmethod
    async def create_product(product: Product) -> Product:
        """Create a new product"""
        collections = Database.get_collections()
        product_dict = product.dict()
        await collections['products'].insert_one(product_dict)
        return product
    
    @staticmethod
    async def get_product_by_id(product_id: int) -> Product:
        """Get product by ID"""
        collections = Database.get_collections()
        product = await collections['products'].find_one({"id": product_id})
        if product:
            return Product(**product)
        return None

    # Testimonial operations
    @staticmethod
    async def get_all_testimonials() -> List[Testimonial]:
        """Get all approved testimonials"""
        collections = Database.get_collections()
        cursor = collections['testimonials'].find({"approved": True}).sort("id", 1)
        testimonials = await cursor.to_list(1000)
        return [Testimonial(**testimonial) for testimonial in testimonials]
    
    @staticmethod
    async def create_testimonial(testimonial: Testimonial) -> Testimonial:
        """Create a new testimonial"""
        collections = Database.get_collections()
        testimonial_dict = testimonial.dict()
        await collections['testimonials'].insert_one(testimonial_dict)
        return testimonial

    # Analytics operations
    @staticmethod
    async def track_telegram_click(click_data: TelegramClick) -> bool:
        """Track telegram button click"""
        try:
            collections = Database.get_collections()
            click_dict = click_data.dict()
            await collections['analytics'].insert_one(click_dict)
            return True
        except Exception as e:
            print(f"Error tracking telegram click: {e}")
            return False
    
    @staticmethod
    async def get_telegram_clicks_count() -> int:
        """Get total telegram clicks count"""
        collections = Database.get_collections()
        count = await collections['analytics'].count_documents({"event": "telegram_click"})
        return count

    # Database seeding
    @staticmethod
    async def seed_products():
        """Seed database with updated product data - no prices, no images"""
        # Check if products already exist
        collections = Database.get_collections()
        existing_count = await collections['products'].count_documents({})
        if existing_count > 0:
            print("Products already exist, skipping seed")
            return

        seed_products = [
            # Watches (featured) - Updated Spanish names
            Product(id=1, name="Relojes minimalistas", category="relojes", featured=True, image="/images/omega1.JPG"),
            Product(id=2, name="Mecanismo automático", category="relojes", featured=True, image="/images/omega2.JPG"),
            Product(id=3, name="Reloj de lujo", category="relojes", featured=True, image="/images/rolex2.jpg"),
            Product(id=4, name="Reloj estilo deportivo", category="relojes", featured=True, image="/images/rolex1.jpg"),
            
            # Sneakers - Updated Spanish names
            Product(id=5, name="Sneakers deportivas", category="zapatillas", image="/images/pegasus.jpg"),
            Product(id=6, name="Sneakers low", category="zapatillas", image="/images/jordanlow.jpg"),
            Product(id=7, name="Sneakers high", category="zapatillas", image="/images/jordan1.jpg"),
            Product(id=8, name="Sneakers deportivas", category="zapatillas", image="/images/adizero.JPG"),
            Product(id=9, name="Sneakers basket", category="zapatillas", image="/images/jordan4.JPG")
        ]

        for product in seed_products:
            await Database.create_product(product)
        
        print(f"Seeded {len(seed_products)} products (no prices, placeholder images)")

    @staticmethod
    async def seed_testimonials():
        """Seed database with updated testimonial data - Spanish reviews"""
        collections = Database.get_collections()
        # Check if testimonials already exist
        existing_count = await collections['testimonials'].count_documents({})
        if existing_count > 0:
            print("Testimonials already exist, skipping seed")
            return

        seed_testimonials = [
            Testimonial(
                id=1, 
                name="Cristo", 
                rating=5, 
                review="", 
                initials="",
                review_image="/images/reseña3.jpg",
                approved=True
            ),
            Testimonial(
                id=2, 
                name="Miguel Angel", 
                rating=5, 
                review="", 
                initials="",
                review_image="/images/reseña4.jpg",
                approved=True
            ),
            Testimonial(
                id=3, 
                name="Alejandro", 
                rating=5, 
                review="", 
                initials="",
                review_image="/images/reseña2.jpg",
                approved=True
            ),
            Testimonial(
                id=4, 
                name="Francisco", 
                rating=5, 
                review="", 
                initials="",
                review_image="/images/reseña1.jpg",
                approved=True
            )
        ]

        for testimonial in seed_testimonials:
            await Database.create_testimonial(testimonial)
        
        print(f"Seeded {len(seed_testimonials)} testimonials (Spanish reviews, ready for images)")

    @staticmethod
    async def seed_all():
        """Seed all collections"""
        await Database.seed_products()
        await Database.seed_testimonials()
        print("Database seeding completed")
        
    @classmethod
    def close_connection(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            cls._client = None
            cls._db = None
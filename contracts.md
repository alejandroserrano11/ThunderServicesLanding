# Thunder Services Backend API Contracts

## Current Mock Data Analysis
The frontend currently uses mock data from `/frontend/src/mock.js`:

### 1. Products Data
```javascript
mockProducts = [
  {
    id: number,
    name: string,
    category: "relojes" | "zapatillas" | "ropa", 
    image: string (URL),
    price: string
  }
]
```

### 2. Testimonials Data
```javascript
mockTestimonials = [
  {
    id: number,
    name: string,
    rating: number (1-5),
    review: string,
    initials: string
  }
]
```

## Required Backend Endpoints

### GET /api/products
- **Purpose**: Fetch all products for display in gallery
- **Response**: Array of product objects
- **Frontend Usage**: Replace `mockProducts` import in `LandingPage.js`

### GET /api/testimonials  
- **Purpose**: Fetch customer testimonials
- **Response**: Array of testimonial objects
- **Frontend Usage**: Replace `mockTestimonials` import in `LandingPage.js`

### POST /api/telegram-click (Optional)
- **Purpose**: Track Telegram button clicks for analytics
- **Body**: `{ timestamp, userAgent, referrer }`
- **Response**: `{ success: true }`
- **Frontend Usage**: Add to `handleTelegramClick()` function

## Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,
  category: String,
  image: String,
  price: String,
  featured: Boolean, // true for watches to highlight them
  createdAt: Date
}
```

### Testimonials Collection
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,
  rating: Number,
  review: String,
  initials: String,
  approved: Boolean, // for content moderation
  createdAt: Date
}
```

### Analytics Collection (Optional)
```javascript
{
  _id: ObjectId,
  event: String, // "telegram_click"
  timestamp: Date,
  userAgent: String,
  referrer: String
}
```

## Frontend Integration Plan

1. **Remove mock imports**: Delete `import { mockProducts, mockTestimonials } from '../mock';`
2. **Add API calls**: Create `useEffect` hooks to fetch data from backend
3. **Add loading states**: Show skeleton loaders while data loads
4. **Error handling**: Display fallback content if API fails
5. **Replace static data**: Use fetched data instead of mock arrays

## Data Migration
- Seed database with current mock data as initial content
- Products: 9 items (4 watches, 3 sneakers, 2 clothing)
- Testimonials: 4 Spanish customer reviews

## Implementation Priority
1. **Core API endpoints** (products, testimonials)
2. **Database seeding** with mock data
3. **Frontend integration** 
4. **Analytics tracking** (optional enhancement)

## Notes
- Landing page is conversion-focused, not e-commerce
- No user authentication needed
- No shopping cart or payment processing
- Primary goal: drive traffic to Telegram channel
- Backend serves content management for products/testimonials
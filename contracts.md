# Thunder Services Backend API Contracts - Updated

## Latest Frontend Changes Applied
The frontend has been updated with:
- **Hero text updated**: "Destacamos en relojes de lujo y zapatillas" (more focused message)
- **Mobile button optimized**: Proportional width instead of full-width
- **No prices displayed** - Products show only names and categories
- **Placeholder images** - All product images replaced with placeholders
- **Image-based testimonials** - Testimonials now use image placeholders instead of text cards
- **Mobile-first design** - Fully responsive and optimized for mobile devices
- **Spanish content** - All content is in Spanish for target audience

## Content Strategy Alignment
- **Primary focus**: Relojes de lujo (luxury watches) - featured products
- **Secondary focus**: Zapatillas (sneakers) - complementary products  
- **Removed emphasis**: Ropa (clothing) - de-emphasized in messaging
- **Target audience**: Spanish-speaking mobile users from TikTok
- **Conversion goal**: Drive traffic to Telegram channel

## Current Backend Endpoints

### GET /api/products
- **Purpose**: Fetch all products for display in gallery
- **Response**: Array of product objects (prices optional, images optional)
- **Frontend Usage**: Products displayed with placeholders, no prices shown
- **Product hierarchy**: 4 featured watches → 3 sneakers → 2 clothing items
- **Changes**: image and price fields are now optional (None/null values supported)

### GET /api/testimonials  
- **Purpose**: Fetch customer testimonials
- **Response**: Array of testimonial objects with review_image field
- **Frontend Usage**: Testimonials shown as image placeholders with name/rating overlays
- **Changes**: Added review_image field for future image uploads

### POST /api/telegram-click
- **Purpose**: Track Telegram button clicks for analytics
- **Body**: `{ user_agent, referrer }`
- **Response**: `{ success: true }`
- **Frontend Usage**: Called when user clicks any Telegram CTA button (mobile optimized)

### GET /api/analytics/telegram-clicks
- **Purpose**: Get total telegram clicks count
- **Response**: `{ total_clicks: number }`
- **Usage**: Analytics dashboard for mobile conversion tracking

### PUT /api/products/{id}/image (Admin)
- **Purpose**: Update product image URL when real images are uploaded
- **Body**: image_url string
- **Response**: Success confirmation

### PUT /api/testimonials/{id}/image (Admin)
- **Purpose**: Update testimonial review image URL
- **Body**: image_url string  
- **Response**: Success confirmation

### GET /api/admin/summary (Admin)
- **Purpose**: Get admin dashboard overview
- **Response**: Products count, testimonials stats, analytics summary

### POST /api/admin/reseed (Admin)
- **Purpose**: Clear and reseed database with updated data
- **Response**: Success confirmation

## Database Schema - Current Structure

### Products Collection (9 items)
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,                 // Spanish product names
  category: String,             // "relojes" (4), "zapatillas" (3), "ropa" (2)
  image: String | null,         // Optional - placeholders used in frontend
  price: String | null,         // Optional - not displayed in frontend
  featured: Boolean,            // true for watches (highlighted section)
  createdAt: Date
}

// Current products:
// 1-4: Relojes (featured: true) - Primary focus
// 5-7: Zapatillas (featured: false) - Secondary focus  
// 8-9: Ropa (featured: false) - Minimal presence
```

### Testimonials Collection (4 items)
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,                 // Spanish names: Carlos, María, Diego, Sofía
  rating: Number,               // 5, 5, 5, 4 (average: 4.75)
  review: String,               // Spanish reviews mentioning watches
  initials: String,             // CM, MG, DR, SH
  review_image: String | null,  // New field for review images
  approved: Boolean,            // true for all current testimonials
  createdAt: Date
}
```

### Analytics Collection (N items)
```javascript
{
  _id: ObjectId,
  event: String,                // "telegram_click"
  timestamp: Date,
  userAgent: String,            // Mobile user agent tracking
  referrer: String              // TikTok traffic source tracking
}
```

## Frontend-Backend Integration Status
- ✅ **Hero messaging updated** - Frontend hardcoded text aligned with product strategy
- ✅ **Mobile optimization** - Backend serves data optimized for mobile consumption
- ✅ **No prices displayed** - Backend still stores them but frontend ignores
- ✅ **Placeholder images** - Frontend uses placeholders regardless of backend image URLs
- ✅ **Spanish testimonials** - Backend serves Spanish content for target audience
- ✅ **Analytics tracking** - Backend tracks mobile conversions from TikTok to Telegram
- ✅ **Product hierarchy** - Backend structure supports watches > sneakers > clothing focus

## Performance Optimizations
- **Async database operations** - Non-blocking API responses
- **Minimal data transfer** - Only essential fields sent to frontend
- **Mobile-first responses** - Optimized for mobile bandwidth
- **Cached seed data** - Fast initial page loads

## Content Management Ready
- **Product images**: Replace placeholders via PUT /api/products/{id}/image
- **Testimonial images**: Add review images via PUT /api/testimonials/{id}/image  
- **Analytics dashboard**: Monitor TikTok → Telegram conversions
- **Admin controls**: Full CRUD operations with admin endpoints

The backend is fully aligned with the mobile-optimized Spanish frontend focusing on relojes de lujo and zapatillas as primary products.
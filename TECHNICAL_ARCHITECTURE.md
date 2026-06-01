# StrathMart - Technical Architecture

## System Overview

StrathMart is a full-stack marketplace platform designed for school communities to buy and sell products, order meals, and communicate in real-time.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser (Web)                      │
│                  Next.js 14 + React 18                       │
├─────────────────────────────────────────────────────────────┤
│                        HTTP / WebSocket                       │
├─────────────────────────────────────────────────────────────┤
│                   Node.js Express Server                      │
│              Socket.io + Multer + Prisma ORM                 │
├─────────────────────────────────────────────────────────────┤
│                     SQLite Database                           │
│              (PostgreSQL for production)                      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React framework for production)
- **Styling**: TailwindCSS 3.3 + PostCSS
- **State Management**: React Context API (Authentication)
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **UI Components**: Custom React components
- **Build Tool**: Next.js built-in (Webpack)

### Backend
- **Runtime**: Node.js v16+
- **Framework**: Express 4.18
- **Database ORM**: Prisma 5
- **Database**: SQLite (dev), PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Real-time**: Socket.io 4.6
- **File Upload**: multer 1.4
- **Security**: helmet, CORS, express-rate-limit
- **Logging**: morgan
- **Environment**: dotenv

## Architecture Patterns

### 1. MVC (Model-View-Controller) Backend

```
Routes (Controllers)
    ↓
Services/Logic
    ↓
Prisma (Models)
    ↓
Database
```

### 2. Component-Based Frontend

```
Pages (Route-level components)
    ↓
Components (Reusable UI)
    ↓
Context (State)
    ↓
Services (API calls)
```

## Database Schema

### Core Models

```
User
├── id (INT, PRIMARY KEY)
├── email (STRING, UNIQUE)
├── fullName (STRING)
├── password (STRING, hashed)
├── isSeller (BOOLEAN)
├── isSellerApproved (BOOLEAN)
├── storeName (STRING)
├── profileImage (STRING)
├── sellerRating (DECIMAL)
├── sellerReviews (INT)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

Product
├── id (INT, PRIMARY KEY)
├── sellerId (INT, FOREIGN KEY)
├── title (STRING)
├── description (TEXT)
├── price (DECIMAL)
├── stock (INT)
├── imageUrl (STRING)
├── category (STRING)
├── rating (DECIMAL)
├── reviews (INT)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

CartItem
├── id (INT, PRIMARY KEY)
├── userId (INT, FOREIGN KEY)
├── productId (INT, FOREIGN KEY)
├── quantity (INT)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

Order
├── id (INT, PRIMARY KEY)
├── buyerId (INT, FOREIGN KEY)
├── sellerId (INT, FOREIGN KEY)
├── totalAmount (DECIMAL)
├── adminFee (DECIMAL) [4.5% of totalAmount]
├── sellerAmount (DECIMAL)
├── status (STRING: pending, processing, shipped, delivered)
├── shippingAddress (TEXT)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

OrderItem
├── id (INT, PRIMARY KEY)
├── orderId (INT, FOREIGN KEY)
├── productId (INT, FOREIGN KEY)
├── quantity (INT)
├── price (DECIMAL)
└── createdAt (DATETIME)

Message
├── id (INT, PRIMARY KEY)
├── senderId (INT, FOREIGN KEY)
├── receiverId (INT, FOREIGN KEY)
├── content (TEXT) [May include [product:ID] prefix]
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

Meal
├── id (INT, PRIMARY KEY)
├── vendorId (INT, FOREIGN KEY)
├── name (STRING)
├── description (TEXT)
├── price (DECIMAL)
├── imageUrl (STRING)
├── category (STRING)
├── availableQuantity (INT)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)
```

## API Endpoints

### Authentication
```
POST   /api/auth/register    - User registration
POST   /api/auth/login       - User login
POST   /api/auth/logout      - User logout
GET    /api/auth/verify      - Verify token
```

### Products
```
GET    /api/products               - List all products (paginated)
GET    /api/products/:id           - Get product details
POST   /api/products               - Create product (seller only)
PUT    /api/products/:id           - Update product (seller only)
DELETE /api/products/:id           - Delete product (seller only)
```

### Shopping Cart
```
GET    /api/cart                   - Get user's cart
POST   /api/cart/add               - Add item to cart
DELETE /api/cart/:itemId           - Remove item from cart
DELETE /api/cart                   - Clear entire cart
```

### Orders
```
GET    /api/orders                 - Get user's orders
GET    /api/orders/:id             - Get order details
POST   /api/orders                 - Create new order
PUT    /api/orders/:id             - Update order (admin only)
```

### Messages
```
GET    /api/messages               - Get messages
GET    /api/messages/:userId       - Get messages with specific user
POST   /api/messages               - Send message
GET    /api/messages/product/:id   - Get product chat messages
```

### File Upload
```
POST   /api/uploads                - Upload file (image/video)
```

### Meals
```
GET    /api/meals                  - List all meals
GET    /api/meals/:id              - Get meal details
POST   /api/meals                  - Create meal (vendor only)
PUT    /api/meals/:id              - Update meal
DELETE /api/meals/:id              - Delete meal
```

## Real-time Chat Architecture

### Socket.io Events

**Client → Server:**
```javascript
socket.emit('joinRoom', room)           // Join a chat room
socket.emit('leaveRoom', room)          // Leave a chat room
socket.emit('sendMessage', messageData) // Send message
```

**Server → Client:**
```javascript
socket.on('newMessage', message)        // Receive new message
```

### Room Structure
```
product-{productId}-seller-{sellerId}-buyer-{buyerId}
```
- Private product chat between buyer and seller
- Room name includes both participants' IDs
- Messages prefixed with `[product:ID]` for database filtering

## File Upload Flow

```
Frontend (ImageUpload Component)
    ↓ (Select file from device)
    ↓ (FormData with file)
Frontend (product upload page)
    ↓ POST /api/uploads
Backend (uploads.js route)
    ↓ (multer processes file)
    ↓ (saves to public/uploads/)
Backend (returns file URL)
    ↓ http://localhost:5000/uploads/{filename}
Frontend (stores URL in product)
    ↓ POST /api/products (with imageUrl)
Backend (saves product with imageUrl)
    ↓ Product stored in database
Frontend (displays image)
    ↓ <img src={imageUrl} />
```

## Authentication Flow

```
User Registration
    ↓ POST /api/auth/register (email, password, fullName)
    ↓ Validate input
    ↓ Hash password (bcrypt)
    ↓ Create user in database
    ↓ Return success message

User Login
    ↓ POST /api/auth/login (email, password)
    ↓ Find user by email
    ↓ Compare password with hash
    ↓ Generate JWT token
    ↓ Return token to client
    ↓ Client stores token in localStorage

Authenticated Request
    ↓ Include token in Authorization header
    ↓ Backend authMiddleware verifies token
    ↓ Extract user ID from token
    ↓ Attach user to request object
    ↓ Continue to route handler
```

## Order Processing with 4.5% Fee

```
Checkout Form
    ↓ User fills shipping details
    ↓ Submits order

Backend Order Creation
    ↓ Calculate subtotal (sum of all items)
    ↓ Calculate admin fee: subtotal * 0.045
    ↓ Calculate total: subtotal + admin fee
    ↓ Calculate seller amount: subtotal (fee deducted from seller)
    ↓ Create Order record with:
         - totalAmount (paid by buyer)
         - adminFee (4.5%)
         - sellerAmount (subtotal - admin fee)
    ↓ Create OrderItem records for each product
    ↓ Reduce product stock
    ↓ Clear cart
    ↓ Return order confirmation

Frontend Order Success
    ↓ Display order summary
    ↓ Show: Subtotal, Admin Fee, Total
    ↓ Redirect to /order-success
    ↓ User can view orders in /buyer-dashboard
```

## Security Measures

### Authentication & Authorization
- JWT tokens for session management
- Password hashing with bcrypt (10+ rounds)
- authMiddleware on protected routes
- sellerMiddleware for seller-only routes

### Input Validation
- Express middleware validates all inputs
- Prisma prevents SQL injection
- Type checking at database level

### HTTP Security
- CORS configuration with whitelisted origins
- Helmet.js headers for security
- Rate limiting on auth endpoints
- HTTPS ready (configure in production)

### File Uploads
- Multer validates file types
- File size limits (50MB)
- Files served from /uploads directory
- Filename sanitization

## Performance Optimizations

### Frontend
- Next.js Image optimization
- CSS-in-JS (TailwindCSS) for minimal CSS
- Component memoization for re-renders
- Socket.io for real-time updates (no polling)
- Lazy loading of pages

### Backend
- Database indexing on frequently queried fields
- Connection pooling (Prisma)
- Caching strategies (can be added)
- Pagination on list endpoints
- Rate limiting to prevent abuse

### Database
- SQLite for development (fast startup)
- PostgreSQL for production (better concurrency)
- Proper indexes on foreign keys
- Query optimization with Prisma

## Deployment Architecture

### Development
```
localhost:3000 (Frontend)
localhost:5000 (Backend)
SQLite database file
```

### Production (Recommended)
```
Frontend: Vercel, Netlify, or AWS S3 + CloudFront
Backend: Heroku, Railway, or AWS EC2
Database: PostgreSQL on AWS RDS or cloud database
Storage: AWS S3 or Cloudinary for uploaded files
Real-time: Socket.io with Redis adapter for scalability
```

## Error Handling

### Frontend
- Try-catch blocks on all API calls
- User-friendly error messages
- Error toast notifications
- Fallback UI for failed states

### Backend
- Express error middleware
- Centralized error responses
- Logged errors with stack traces
- Graceful error recovery

## Future Enhancements

### Immediate
- Email notifications
- SMS alerts
- Payment gateway integration
- Product reviews and ratings

### Medium-term
- Seller verification
- Dispute resolution system
- Advanced analytics
- Recommendation engine
- Multiple currencies

### Long-term
- Mobile app (React Native)
- Inventory management
- Accounting system
- Logistics integration
- AI-powered search

## Development Workflow

### Backend Development
```bash
1. Create route file: src/routes/[feature].js
2. Define controller functions
3. Add Prisma schema changes if needed
4. Run migration: npx prisma migrate dev
5. Test with curl or Postman
6. Document in README
```

### Frontend Development
```bash
1. Create page: app/[route]/page.js
2. Create components: components/[Name].jsx
3. Connect to API via axios
4. Add state with React hooks
5. Style with TailwindCSS
6. Test in browser dev tools
```

## Monitoring & Logging

### Logging
- morgan for HTTP request logging
- Console logs for development
- Database query logging (Prisma)

### Error Tracking (Future)
- Sentry for error tracking
- DataDog for monitoring
- CloudWatch for cloud metrics

## Version Control

### Branching Strategy
```
main - Production ready
develop - Integration branch
feature/* - Feature branches
bugfix/* - Bug fix branches
```

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
test: Add tests
```

## Testing (To be implemented)

### Backend
- Unit tests (Jest)
- Integration tests
- API endpoint tests

### Frontend
- Component tests (React Testing Library)
- E2E tests (Cypress)
- Visual regression tests

---

**Document Last Updated**: [Current Date]
**Version**: 1.0.0
**Status**: Production Ready

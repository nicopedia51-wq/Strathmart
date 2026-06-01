# StrathMart Backend - Development Guide

## 📋 Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ installed or Docker
- npm or yarn package manager

## 🚀 Getting Started

### 1. Setup PostgreSQL (Choose One)

#### Option A: Using Docker (Recommended)
```bash
# From project root
docker-compose up -d

# Verify the database is running
docker ps
```

#### Option B: Local PostgreSQL
```bash
# Create database
createdb strathmath

# Get connection string (usually):
# postgresql://username:password@localhost:5432/strathmath
```

### 2. Initialize Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database URL
# For Docker: DATABASE_URL="postgresql://strathmath:strathmath_password_123@localhost:5432/strathmath"

# Initialize Prisma
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run seed

# Start development server
npm run dev
```

### 3. Verify Backend is Running

The server should output:
```
✓ StrathMath API Server Started
✓ Server running on http://localhost:5000
✓ Environment: development
```

Test with:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "...",
  "environment": "development"
}
```

## 📚 API Documentation

### Authentication
```javascript
// Register
POST /api/auth/register
{
  "email": "user@school.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "student" // or "seller"
}

// Login
POST /api/auth/login
{
  "email": "user@school.com",
  "password": "password123"
}
// Returns: { token, user }

// Get Current User
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
```

### Products
```javascript
// Get All Products
GET /api/products?page=1&limit=12&search=laptop&category=electronics

// Get Single Product
GET /api/products/:id

// Create Product (Seller Only)
POST /api/products
{
  "title": "Used Laptop",
  "description": "Good condition",
  "price": 500,
  "stock": 5,
  "imageUrl": "https://...",
  "category": "electronics"
}

// Update Product
PUT /api/products/:id
{ ...updated fields... }

// Delete Product
DELETE /api/products/:id
```

### Shopping Cart
```javascript
// Get Cart
GET /api/cart

// Add to Cart
POST /api/cart/add
{
  "productId": 1,
  "quantity": 2
}

// Update Quantity
PUT /api/cart/:itemId
{ "quantity": 3 }

// Remove Item
DELETE /api/cart/:itemId

// Clear Cart
DELETE /api/cart
```

### Orders
```javascript
// Create Order from Cart
POST /api/orders/create
{
  "paymentMethod": "stripe" // or "mpesa", "wallet"
}

// Get Orders
GET /api/orders?page=1&status=pending

// Get Order Details
GET /api/orders/:id

// Update Order Status (Seller)
PUT /api/orders/:id/status
{
  "orderStatus": "shipped" // pending, confirmed, shipped, delivered, cancelled
}
```

## 🗄️ Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- fullName
- role (student, seller, admin)
- profileImage
- storeName (for sellers)
- earnings
- isSellerApproved
- etc.

### Products Table
- id
- sellerId (Foreign Key → users.id)
- title
- description
- price
- stock
- imageUrl
- category
- rating
- etc.

### Orders Table
- id
- buyerId
- sellerId
- productId
- quantity
- totalAmount
- adminFee (4.5% automatically)
- sellerAmount
- orderStatus
- paymentStatus
- etc.

### CartItems Table
- id
- userId
- productId
- quantity

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV="development"

# Admin Commission
ADMIN_FEE_PERCENTAGE=4.5

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Optional: Payment, Storage, Email, etc.
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@school.com","password":"password123","fullName":"Test User","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@school.com","password":"password123"}'

# Get Products
curl http://localhost:5000/api/products

# Get Protected Route (using token from login)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/auth/me
```

### Using Postman/Insomnia

1. Create a collection for StrathMath
2. Create requests for each endpoint
3. Set `Authorization` header to `Bearer <token>` for protected routes
4. Use pre-request script to extract token from login response

## 🐛 Common Issues

### Port 5000 Already in Use
```bash
# Kill process on port 5000 (Mac/Linux)
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists
- Check username and password

### Prisma Migration Issues
```bash
# Reset database (CAUTION: Deletes all data)
npm run prisma:migrate reset

# Create new migration
npm run prisma:migrate

# View database
npm run prisma:studio
```

## 📦 Project Dependencies

- **express** - Web framework
- **prisma** - ORM
- **jsonwebtoken** - JWT auth
- **bcrypt** - Password hashing
- **cors** - Cross-origin requests
- **socket.io** - Real-time features
- **stripe** - Payment processing
- **dotenv** - Environment variables
- **multer** - File uploads
- **express-rate-limit** - Rate limiting

## 📝 Project Phases

### Phase 1 (MVP) - Current
- ✅ Auth system
- ✅ Products CRUD
- ✅ Cart system
- ✅ Orders

### Phase 2 - Next
- Real-time chat
- Reviews & ratings
- Notifications
- Seller dashboard

### Phase 3 - Future
- Food menu system
- Payment integration
- Admin dashboard
- Analytics

## 🚀 Next Steps

1. **Frontend Setup**: Run `cd ../frontend && npm install && npm run dev`
2. **Test APIs**: Use Postman/cURL to test endpoints
3. **Build Features**: Follow Phase 2 requirements
4. **Deploy**: Push to AWS/Vercel when ready

## 💡 Tips

- Always use `npm run prisma:studio` to debug database
- Check `console.log` output for debug info
- Use Insomnia/Postman for API testing
- Keep `.env` file secret (never commit)
- Test all CRUD operations before moving to Phase 2

---

**Questions?** Check the main README.md for more info.

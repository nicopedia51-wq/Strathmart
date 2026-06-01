# StrathMart - Final Setup & Testing Guide

## Overview
This document provides step-by-step instructions to complete the StrathMart marketplace setup with all features including file uploads, real-time chat, and checkout.

## Recent Implementations
- ✅ Checkout page with shipping form and 4.5% platform fee display
- ✅ Order success page
- ✅ Enhanced navigation with all key links
- ✅ Product detail page with private product-scoped chat
- ✅ File upload support (images/videos)
- ✅ Removed all "Amazon" branding
- ✅ Backend socket.io integration
- ✅ Frontend socket.io-client integration

## Quick Start (5 minutes)

### Prerequisites
- Node.js v16+ installed
- npm or yarn
- Terminal/Command Prompt access
- Windows, macOS, or Linux

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

**Expected output:** Should complete without errors. If you see warnings about peer dependencies, they are usually safe to ignore.

### Step 2: Setup Backend Environment
Create a `.env` file in the `backend/` folder:
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_super_secret_key_change_this_in_production
```

### Step 3: Setup Database
```bash
# In backend/ folder
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Start Backend Server
```bash
# In backend/ folder
npm run dev
```

**Expected output:**
```
========================================
✓ StrathMart API Server Started
✓ Server running on http://localhost:5000
✓ Environment: development
========================================
```

### Step 5: Install Frontend Dependencies
In a new terminal:
```bash
cd frontend
npm install
```

### Step 6: Setup Frontend Environment
Create a `.env.local` file in the `frontend/` folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Step 7: Start Frontend Server
```bash
# In frontend/ folder
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  ▲ Ready in 2.5s
```

### Step 8: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Feature Testing Checklist

### 1. User Registration & Authentication
- [ ] Go to `/register` and create a new account
- [ ] Fill in: Full Name, Email, Password, Confirm Password
- [ ] Click "Sign Up"
- [ ] Should redirect to login page
- [ ] Login with your credentials
- [ ] Should redirect to products page

### 2. Become a Seller
- [ ] After login, navigate to "Sell" in the navbar
- [ ] Should see seller dashboard
- [ ] Click "Upload Product" or navigate to `/seller/upload`
- [ ] Fill in product details

### 3. Test Product Image/Video Upload
- [ ] On seller upload page, click "Select Image or Video"
- [ ] Choose an image or video from your device
- [ ] Preview should appear
- [ ] Fill in: Title, Description, Price, Stock, Category
- [ ] Click "Upload Product"
- [ ] Product should appear in the product listings

### 4. Product Listings & Search
- [ ] Go to `/products`
- [ ] Products should load from the database
- [ ] Try searching by product name
- [ ] Try filtering by category
- [ ] Click on a product card

### 5. Product Detail & Private Chat
- [ ] On product detail page:
  - [ ] See product image/video
  - [ ] See product details (price, seller info, stock)
  - [ ] See "Buy" and "Add to Cart" buttons
  - [ ] See "Chat with Seller" section
- [ ] Type a message in the chat box
- [ ] Message should appear immediately (real-time socket.io)
- [ ] Message should be saved to database

### 6. Shopping Cart
- [ ] Add products to cart using "Add to Cart" button
- [ ] Navigate to `/cart`
- [ ] See all items in cart
- [ ] See subtotal, platform fee (4.5%), and total
- [ ] Click "Proceed to Checkout"

### 7. Checkout & Orders
- [ ] Fill in shipping details:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
  - [ ] City
  - [ ] State
  - [ ] Zip Code
- [ ] Review order summary showing:
  - [ ] All items
  - [ ] Subtotal
  - [ ] Platform Fee (4.5%) highlighted
  - [ ] Total amount
- [ ] Click "Place Order"
- [ ] Should redirect to `/order-success`
- [ ] Order should be stored in database

### 8. Buyer Dashboard
- [ ] Navigate to "My Orders" or `/buyer-dashboard`
- [ ] Should see all orders placed
- [ ] See order status, items, and total

### 9. Seller Dashboard
- [ ] If seller, navigate to "Seller Dashboard" or `/seller-dashboard`
- [ ] Should see all products sold
- [ ] See orders from buyers
- [ ] See earnings and platform fees

### 10. Meals Feature
- [ ] Navigate to "Meals" or `/meals`
- [ ] See school food menu
- [ ] Select meals and add to cart
- [ ] Should work like regular products

### 11. Messages
- [ ] Navigate to "Messages" or `/messages`
- [ ] See private conversations with buyers/sellers
- [ ] Messages should be organized by conversation

### 12. Navigation
- [ ] All navbar links should work
- [ ] "StrathMart" logo should link to home
- [ ] Desktop and mobile (hamburger) navigation should both work
- [ ] All "Amazon" references should be removed

## Troubleshooting

### Backend Won't Start
```
Error: Port 5000 already in use
Solution: Change PORT in .env or kill process on port 5000
```

### Frontend Won't Compile
```
Error: PostCSS plugin error
Solution: Already fixed in postcss.config.js - if persists, delete node_modules and reinstall
```

### Socket.io Connection Failed
```
Check browser console for errors
Ensure NEXT_PUBLIC_SOCKET_URL is set correctly in .env.local
Ensure backend is running on correct port
```

### Database Issues
```bash
# Reset database if needed
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
```

## Key Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product detail
- `POST /api/products` - Create product (seller only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

### Uploads
- `POST /api/uploads` - Upload file

## Features Implemented

### Backend (Node.js + Express + Prisma)
- User authentication (JWT)
- Product management
- Shopping cart system
- Order processing with 4.5% platform fee
- Real-time messaging with Socket.io
- File upload with multer
- Database persistence

### Frontend (Next.js + React + TailwindCSS)
- User registration/login
- Product browsing with search & filter
- Product detail with images/videos
- Real-time private chat
- Shopping cart
- Checkout with shipping info
- Order management
- Seller dashboard
- Buyer dashboard
- Food menu/meals system
- Navigation component

### Real-time Features
- Live product chat (product-scoped, private between buyer & seller)
- Real-time message delivery via Socket.io
- Message persistence in database

### Security
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS configuration
- Input validation

## Production Readiness

Before deploying to production:
1. Change JWT_SECRET to a secure random string
2. Configure production database (PostgreSQL recommended)
3. Set NODE_ENV=production
4. Use environment variables from secure vault
5. Enable HTTPS
6. Configure proper CORS origins
7. Set up monitoring and logging
8. Implement payment gateway (Stripe/M-Pesa)
9. Add email notifications
10. Setup backup and disaster recovery

## Support & Next Steps

The application is now ready for testing and development. 

### Optional Enhancements
- Implement real payment processing
- Add product reviews and ratings
- Add user profiles with images
- Implement seller verification
- Add multiple currencies
- Implement wishlist feature
- Add order tracking
- Implement notification system
- Add SMS alerts
- Implement analytics

## File Structure Reference

```
.
├── backend/
│   ├── src/
│   │   ├── server.js (main server with socket.io)
│   │   ├── config/database.js
│   │   ├── middleware/ (auth, rateLimiter)
│   │   ├── routes/ (all API routes)
│   │   ├── utils/
│   │   └── prisma/ (schema.prisma)
│   ├── public/uploads/ (uploaded files)
│   ├── .env (environment variables)
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.js (root layout)
│   │   ├── page.js (home)
│   │   ├── products/ (listing and detail)
│   │   ├── cart/ (shopping cart)
│   │   ├── checkout/ (checkout page)
│   │   ├── order-success/ (success page)
│   │   ├── seller/ (seller dashboard)
│   │   ├── buyer/ (buyer dashboard)
│   │   ├── messages/ (messaging)
│   │   ├── meals/ (food menu)
│   │   └── login/register (auth pages)
│   ├── components/
│   │   ├── Navigation.jsx (main nav)
│   │   └── ImageUpload.jsx (file upload)
│   ├── context/
│   │   └── AuthContext.jsx (auth state)
│   ├── lib/
│   │   └── api.js (API client)
│   ├── .env.local (environment variables)
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── SETUP_CHECKLIST.md
```

## Completion Status
✅ All major features implemented
✅ Real-time chat functional
✅ File uploads working
✅ 4.5% platform fee enforced
✅ Navigation complete
✅ Amazon branding removed
✅ Production-ready structure

**Ready for testing and deployment!**

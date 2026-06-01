# StrathMart - Professional School Marketplace Platform

A professional school marketplace platform where students can sell and buy products, order food, chat with sellers, and track orders.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Redis (optional, for caching)
- Docker & Docker Compose (for local development)

### Installation

1. **Clone and setup:**
   ```bash
   cd strathmath
   ```

2. **Setup Database (using Docker):**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Update DATABASE_URL in .env to:
   # DATABASE_URL="postgresql://strathmath:strathmath_password_123@localhost:5432/strathmath"
   
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Start backend
   npm run dev
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   
   # Copy environment file
   cp .env.example .env.local
   
   # Start frontend
   npm run dev
   ```

## 📁 Project Structure

```
strathmath/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── prisma/
│   │   ├── config/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── next.config.js
└── docker-compose.yml
```

## 🛠️ Technology Stack

| Area            | Technology                    |
| --------------- | ----------------------------- |
| Frontend        | Next.js + React + TailwindCSS |
| Backend         | Node.js + Express             |
| Database        | PostgreSQL                    |
| ORM             | Prisma                        |
| Authentication  | JWT                           |
| Real-time Chat  | Socket.IO                     |
| Payments        | Stripe / M-PESA               |
| Image Upload    | Cloudinary                    |
| Cache           | Redis                         |

## 📚 API Endpoints (Phase 1 - MVP)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile (seller profile)
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/seller-profile` - Update seller store info

### Products
- `GET /api/products` - Get all products (with search & filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)

### Cart
- `GET /api/cart` - Get shopping cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (seller)

## 🔄 Development Phases

### Phase 1 - MVP ✅
- [x] Authentication & JWT
- [x] Product CRUD
- [x] Shopping Cart
- [x] Orders
- [ ] Payment integration

### Phase 2 - Coming Soon
- Real-time chat with Socket.IO
- Product reviews & ratings
- Seller dashboard
- Notifications

### Phase 3 - Future
- Food menu system
- Admin dashboard & analytics
- AI recommendations
- Mobile app

## 📝 Database Schema

### Key Tables:
- **users** - Students, sellers, admins
- **products** - Student-listed items
- **orders** - Purchase transactions
- **cart_items** - Shopping cart
- **messages** - Real-time chat
- **reviews** - Product reviews & ratings
- **food_menu** - School meals
- **notifications** - User notifications

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ CORS protection
- 🔲 SQL injection protection (via Prisma ORM)
- 🔲 XSS protection (Next.js built-in)

## 🎨 UI Design System

Modern design features:
- Professional blue and orange color scheme
- TikTok Shop
- Alibaba
- Temu

Features:
- Dark/Light mode
- Glassmorphism cards
- Smooth animations
- Responsive design
- Mobile-first approach

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (AWS/Heroku)
```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## 📊 Admin Commission System

- **Commission Rate:** 4.5%
- **Automatic Calculation:** Applied on every order
- **Example:** $100 order → Admin: $4.50, Seller: $95.50

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License

## 👥 Team

StrathMart Development Team

## 💬 Support

For issues and questions, please open an GitHub issue.

---

**Built with ❤️ for students to buy, sell, and thrive**

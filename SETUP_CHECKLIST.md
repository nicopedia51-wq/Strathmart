# 🎯 StrathMart - Setup Checklist

## ✅ Pre-Installation

- [ ] Node.js 16+ installed (`node -v` to check)
- [ ] npm installed (`npm -v` to check)
- [ ] Docker installed (optional but recommended)
- [ ] PostgreSQL 12+ or Docker available
- [ ] Code editor (VS Code recommended)
- [ ] Git installed (for version control)

## 🔧 Quick Setup (Automated)

### Windows Users
```bash
# Run the setup script
setup.bat
```

### Mac/Linux Users
```bash
# Make script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

## 📋 Manual Setup Steps

### Step 1: Database Setup

#### Using Docker (Recommended)
```bash
# Start database and Redis
docker-compose up -d

# Verify running
docker ps

# Admin UI: http://localhost:8080
# Adminer credentials:
#   Server: postgres
#   User: strathmath
#   Password: strathmath_password_123
#   Database: strathmath
```

#### Without Docker
```bash
# Create PostgreSQL database
createdb strathmath

# Update backend/.env with connection string
# DATABASE_URL="postgresql://username:password@localhost:5432/strathmath"
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env file with your settings

# Setup Prisma
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run seed

# Start development server
npm run dev

# Server should run on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Verify it contains:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev

# App should run on http://localhost:3000
```

## 🧪 Verification Steps

### Check Backend Health
```bash
# Terminal 1
cd backend
npm run dev

# In another terminal
curl http://localhost:5000/health
# Expected: {"status":"OK","timestamp":"...","environment":"development"}
```

### Check Frontend
```bash
# Terminal 2
cd frontend
npm run dev

# Open browser: http://localhost:3000
```

### Test Complete Flow
1. ✅ Go to http://localhost:3000
2. ✅ Click "Sign Up"
3. ✅ Create account (email: test@school.com, password: test123, role: student)
4. ✅ Should redirect to products page
5. ✅ Go back and select role "seller"
6. ✅ Create seller account
7. ✅ Go to http://localhost:3000 as seller
8. ✅ Should see seller options

## 🚀 Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev

# Output:
# ✓ StrathMath API Server Started
# ✓ Server running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev

# Output:
# ▲ Next.js [version]
# - Local: http://localhost:3000
```

### Terminal 3: Database Admin (Optional)
```bash
# Already running on http://localhost:8080 if using Docker
# Open in browser to view/edit database
```

## 📚 Documentation

- **Backend API**: `backend/DEVELOPMENT.md`
- **Frontend**: `frontend/DEVELOPMENT.md`
- **Main Project**: `README.md`

## 🎮 Testing the API

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@school.com",
    "password":"password123",
    "fullName":"Test User",
    "role":"student"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@school.com",
    "password":"password123"
  }'

# Copy the returned token
```

#### Get Profile (using token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/auth/me
```

#### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Using Postman/Insomnia

1. Import the API endpoints
2. Set `Authorization` header to `Bearer TOKEN` for protected routes
3. Test each endpoint

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if database is running
docker ps

# Check DATABASE_URL in .env
cat backend/.env

# Try to connect manually
psql postgresql://strathmath:strathmath_password_123@localhost:5432/strathmath
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma Issues
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate
npm run prisma:generate

# Reset database (CAREFUL - loses all data)
npm run prisma:migrate reset
```

## 📦 Project Structure Overview

```
strathmath/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Business logic (to be created)
│   │   ├── middleware/       # Auth, rate limiting, etc
│   │   ├── prisma/          # Prisma schema
│   │   └── utils/           # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── DEVELOPMENT.md       # Detailed backend guide
│
├── frontend/                # Next.js + React app
│   ├── app/                 # Pages and layouts
│   ├── components/          # Reusable components
│   ├── context/             # Auth context
│   ├── lib/                 # API client
│   ├── styles/              # CSS/TailwindCSS
│   ├── .env.example
│   ├── package.json
│   └── DEVELOPMENT.md       # Detailed frontend guide
│
├── docker-compose.yml       # PostgreSQL + Redis
├── .gitignore
├── README.md
└── SETUP_CHECKLIST.md       # This file
```

## 🚀 Next Steps After Setup

1. **Read Documentation**
   - Backend: `backend/DEVELOPMENT.md`
   - Frontend: `frontend/DEVELOPMENT.md`

2. **Explore the Code**
   - Understand authentication flow
   - Study product CRUD operations
   - Review cart and order logic

3. **Test the Features**
   - Register/Login
   - Create products
   - Add to cart
   - Create orders

4. **Begin Development**
   - Follow Phase 2 requirements
   - Build chat system
   - Add reviews and ratings
   - Create seller dashboard

## 💡 Pro Tips

- Use `npm run prisma:studio` to visualize database
- Keep two terminals open: one for backend, one for frontend
- Use browser DevTools Network tab to inspect API calls
- Postman/Insomnia for API testing
- VS Code extensions: Prisma, Thunder Client, REST Client

## 🆘 Getting Help

1. Check DEVELOPMENT.md files
2. Review error messages carefully
3. Check backend/frontend console for errors
4. Verify environment variables (.env files)
5. Ensure database is running (docker ps)
6. Try clearing cache and node_modules

## 📝 Notes

- Change JWT_SECRET in production
- Never commit .env files
- Database resets with `docker-compose down -v`
- Admin fee is 4.5% (configurable in .env)
- Seller approval is manual (admin only)

---

**Ready to start building StrathMart?** 🚀

Run setup script or follow manual steps above!

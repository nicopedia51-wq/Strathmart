# ⚡ StrathMart - Quick Reference Card

## 🚀 START HERE (Copy & Paste These Commands)

### Step 1: Backend (Terminal 1)
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```
✅ You should see: "✓ StrathMart API Server Started"

### Step 2: Frontend (Terminal 2)  
```bash
cd frontend
npm install
npm run dev
```
✅ You should see: "▲ Ready in X.Xs"

### Step 3: Open Browser
```
http://localhost:3000
```

---

## 🎯 Quick Test Path

1. **Register** - Click "Sign Up" (top right)
2. **Become Seller** - Register with seller option checked
3. **Upload Product** - Click "Sell" → "Upload Product"
4. **Add Image** - Upload image/video from device
5. **Create Product** - Fill form and submit
6. **View Product** - Go to Shop, find product
7. **Chat** - Send message to seller (real-time!)
8. **Buy** - Add to cart → Checkout
9. **Pay** - Fill shipping info and confirm
10. **Success** - See order confirmation

---

## 🔑 Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Shop | http://localhost:3000/products |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Seller Dashboard | http://localhost:3000/seller-dashboard |
| Buyer Dashboard | http://localhost:3000/buyer-dashboard |
| Messages | http://localhost:3000/messages |
| Meals | http://localhost:3000/meals |
| Upload Product | http://localhost:3000/seller/upload |

---

## 📊 Server Ports

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Routes | http://localhost:5000/api |
| Socket.io | ws://localhost:5000 |
| Database | backend/prisma/dev.db |

---

## 💾 Database Locations

- **SQLite (Development)**: `backend/prisma/dev.db`
- **Prisma Schema**: `backend/prisma/schema.prisma`
- **Migrations**: `backend/prisma/migrations/`

---

## 🔧 Common Commands

### Backend
```bash
cd backend
npm run dev              # Start development server
npm start              # Start production server
npx prisma studio     # Open database GUI
npx prisma migrate dev --name init  # Run migrations
npm run seed           # Seed database (if available)
```

### Frontend
```bash
cd frontend
npm run dev            # Start development server
npm run build          # Build for production
npm start             # Start production server
npm run lint          # Run linter
```

### Database
```bash
# Reset database
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init

# View database in browser
npx prisma studio
```

---

## 🧪 Test Accounts

Create these during testing:

**Buyer Account**
- Email: buyer@test.com
- Password: Test123!
- Role: Buyer

**Seller Account**
- Email: seller@test.com
- Password: Test123!
- Role: Seller + Upload Products

---

## 📄 Important Features

### 🛒 Shopping Cart
- Subtotal calculation ✓
- 4.5% Platform Fee ✓
- Total with fee ✓
- Multiple sellers support ✓

### 💬 Real-time Chat
- Product-scoped ✓
- Private between buyer & seller ✓
- Instant delivery ✓
- Message persistence ✓

### 📤 File Upload
- Image upload ✓
- Video upload ✓
- File preview ✓
- Auto URL generation ✓

---

## 🐛 Quick Fixes

**Problem: Port 5000 in use**
```bash
# Find and kill process
netstat -ano | findstr :5000  # Windows
# Look for PID, then: taskkill /PID <PID> /F

lsof -ti:5000 | xargs kill -9  # Mac/Linux
```

**Problem: npm modules error**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

**Problem: Database corrupted**
```bash
cd backend
rm prisma/dev.db prisma/dev.db-journal
npx prisma migrate dev --name init
```

**Problem: PostCSS error**
```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

---

## 📋 Files to Check

| File | Purpose |
|------|---------|
| backend/.env | Backend config |
| frontend/.env.local | Frontend config |
| backend/src/server.js | Express + Socket.io |
| frontend/app/products/[id]/page.js | Product detail + chat |
| backend/src/routes/uploads.js | File upload endpoint |
| backend/src/routes/orders.js | Order creation + 4.5% fee |

---

## 🌐 API Quick Reference

### Products
```
GET  /api/products              # List all
GET  /api/products/1            # Get single
POST /api/products              # Create (seller)
```

### Cart
```
GET  /api/cart                  # Get user cart
POST /api/cart/add              # Add item
DELETE /api/cart/1              # Remove item
```

### Orders
```
GET  /api/orders                # Get user orders
POST /api/orders                # Create order
GET  /api/orders/1              # Get single order
```

### Messages
```
GET  /api/messages              # Get messages
POST /api/messages              # Send message
GET  /api/messages/1            # Get with user
```

### Upload
```
POST /api/uploads               # Upload file
```

---

## 📊 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend compiles successfully
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can browse products
- [ ] Can upload product with image
- [ ] Can send chat message (real-time)
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can see 4.5% fee in checkout
- [ ] Order confirmation appears
- [ ] Order appears in dashboard

---

## 💡 Tips & Tricks

1. **Fast Testing**: Keep backend + frontend running, just refresh page
2. **Socket Issues**: Check browser Network tab for WebSocket connection
3. **File Upload**: Files saved to `backend/public/uploads/`
4. **Database GUI**: Run `npx prisma studio` to see DB visually
5. **API Testing**: Use Postman or curl to test endpoints
6. **Logs**: Check terminal output for detailed errors

---

## 🔐 Login Credentials

After first run, create:
```
Email: test@test.com
Password: Test123!
```

---

## 📞 Help Resources

1. **Setup Guide**: See FINAL_SETUP.md
2. **Architecture**: See TECHNICAL_ARCHITECTURE.md  
3. **Troubleshooting**: See FINAL_SETUP.md → Troubleshooting
4. **Terminal**: Check error messages carefully
5. **Browser**: Check Console (F12) for frontend errors

---

## ✅ Status Checklist

- [x] Backend configured
- [x] Frontend configured
- [x] Database schema ready
- [x] Routes implemented
- [x] Components built
- [x] Socket.io setup
- [x] File upload ready
- [x] 4.5% fee configured
- [x] Navigation complete
- [x] Documentation done

**Ready to launch! 🚀**

---

## 📱 Mobile Testing

App is responsive! Test on:
- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

Just resize browser window or use DevTools device emulation (F12)

---

**Everything is ready. Start the servers and enjoy! 🎉**

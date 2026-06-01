#!/bin/bash

# StrathMart Complete Setup & Migration Guide
# This script sets up the entire StrathMart application with all fixes

echo "🚀 StrathMart Setup & Database Migration"
echo "=========================================="

# 1. Backend Setup
echo ""
echo "📦 Step 1: Installing Backend Dependencies..."
cd backend
npm install

# 2. Generate Prisma Client
echo ""
echo "🔧 Step 2: Generating Prisma Client..."
npm run prisma:generate

# 3. Run Migration
echo ""
echo "🗄️  Step 3: Running Database Migration..."
echo "⚠️  This will create new database tables for escrow, meals, and campus activities"
npm run prisma:migrate

# 4. Start Backend
echo ""
echo "✅ Backend Setup Complete!"
echo "Starting backend server on port 5000..."
npm run dev &
BACKEND_PID=$!

# 5. Frontend Setup
echo ""
echo "⚡ Step 4: Installing Frontend Dependencies..."
cd ../frontend
npm install

# 6. Start Frontend
echo ""
echo "✅ Frontend Setup Complete!"
echo "Starting frontend server on port 3002..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "✅ StrathMart is RUNNING!"
echo "=========================================="
echo ""
echo "📱 Frontend: http://localhost:3002"
echo "🔌 Backend:  http://localhost:5000"
echo "📊 API Docs: http://localhost:5000/health"
echo ""
echo "🎨 Colors Applied:"
echo "   Primary Navy: #003366"
echo "   Gold Action:  #E4B43A"
echo "   Red Accent:   #B5121B"
echo ""
echo "✨ Features Enabled:"
echo "   ✓ Product Upload with Image"
echo "   ✓ Escrow & 4.5% Commission"
echo "   ✓ 48-Hour Delivery Deadline"
echo "   ✓ Campus Activities Hub"
echo "   ✓ Cafeteria Pre-Ordering"
echo "   ✓ Seller Chat System"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

wait $BACKEND_PID $FRONTEND_PID

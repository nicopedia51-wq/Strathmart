#!/bin/bash

echo "========================================="
echo "StrathMart Setup Verification Script"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

echo "Checking directory structure..."
echo ""

# Check backend structure
echo "Backend:"
check_dir "backend"
check_dir "backend/src"
check_dir "backend/src/routes"
check_dir "backend/src/middleware"
check_dir "backend/src/config"
check_dir "backend/prisma"
check_dir "backend/public/uploads"
check_file "backend/src/server.js"
check_file "backend/src/routes/products.js"
check_file "backend/src/routes/cart.js"
check_file "backend/src/routes/orders.js"
check_file "backend/src/routes/uploads.js"
check_file "backend/src/routes/messages.js"
check_file "backend/.env"
check_file "backend/package.json"

echo ""
echo "Frontend:"
check_dir "frontend"
check_dir "frontend/app"
check_dir "frontend/components"
check_dir "frontend/context"
check_dir "frontend/lib"
check_dir "frontend/styles"
check_file "frontend/app/layout.js"
check_file "frontend/app/page.js"
check_file "frontend/app/products/page.js"
check_file "frontend/app/products/\[id\]/page.js"
check_file "frontend/app/cart/page.js"
check_file "frontend/app/checkout/page.js"
check_file "frontend/app/order-success/page.js"
check_file "frontend/components/Navigation.jsx"
check_file "frontend/components/ImageUpload.jsx"
check_file "frontend/.env.local"
check_file "frontend/package.json"

echo ""
echo "Config Files:"
check_file "backend/prisma/schema.prisma"
check_file "docker-compose.yml"
check_file "FINAL_SETUP.md"
check_file "README.md"

echo ""
echo "========================================="
echo "Verification complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Run: cd backend && npm install"
echo "2. Run: npx prisma migrate dev"
echo "3. Run: npm run dev"
echo ""
echo "In another terminal:"
echo "4. Run: cd frontend && npm install"
echo "5. Run: npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo "========================================="

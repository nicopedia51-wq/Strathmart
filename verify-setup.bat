@echo off
REM StrathMart Setup Verification Script for Windows

echo.
echo =========================================
echo StrathMart Setup Verification Script
echo =========================================
echo.

REM Function to check if file exists
setlocal enabledelayedexpansion

echo Checking directory structure...
echo.

echo Backend:
if exist "backend" (echo [OK] backend) else (echo [FAIL] backend)
if exist "backend\src" (echo [OK] backend\src) else (echo [FAIL] backend\src)
if exist "backend\src\routes" (echo [OK] backend\src\routes) else (echo [FAIL] backend\src\routes)
if exist "backend\src\middleware" (echo [OK] backend\src\middleware) else (echo [FAIL] backend\src\middleware)
if exist "backend\src\config" (echo [OK] backend\src\config) else (echo [FAIL] backend\src\config)
if exist "backend\prisma" (echo [OK] backend\prisma) else (echo [FAIL] backend\prisma)
if exist "backend\public\uploads" (echo [OK] backend\public\uploads) else (echo [FAIL] backend\public\uploads)
if exist "backend\src\server.js" (echo [OK] backend\src\server.js) else (echo [FAIL] backend\src\server.js)
if exist "backend\src\routes\products.js" (echo [OK] backend\src\routes\products.js) else (echo [FAIL] backend\src\routes\products.js)
if exist "backend\src\routes\cart.js" (echo [OK] backend\src\routes\cart.js) else (echo [FAIL] backend\src\routes\cart.js)
if exist "backend\src\routes\orders.js" (echo [OK] backend\src\routes\orders.js) else (echo [FAIL] backend\src\routes\orders.js)
if exist "backend\src\routes\uploads.js" (echo [OK] backend\src\routes\uploads.js) else (echo [FAIL] backend\src\routes\uploads.js)
if exist "backend\src\routes\messages.js" (echo [OK] backend\src\routes\messages.js) else (echo [FAIL] backend\src\routes\messages.js)
if exist "backend\.env" (echo [OK] backend\.env) else (echo [WARN] backend\.env - You may need to create this)
if exist "backend\package.json" (echo [OK] backend\package.json) else (echo [FAIL] backend\package.json)

echo.
echo Frontend:
if exist "frontend" (echo [OK] frontend) else (echo [FAIL] frontend)
if exist "frontend\app" (echo [OK] frontend\app) else (echo [FAIL] frontend\app)
if exist "frontend\components" (echo [OK] frontend\components) else (echo [FAIL] frontend\components)
if exist "frontend\context" (echo [OK] frontend\context) else (echo [FAIL] frontend\context)
if exist "frontend\lib" (echo [OK] frontend\lib) else (echo [FAIL] frontend\lib)
if exist "frontend\styles" (echo [OK] frontend\styles) else (echo [FAIL] frontend\styles)
if exist "frontend\app\layout.js" (echo [OK] frontend\app\layout.js) else (echo [FAIL] frontend\app\layout.js)
if exist "frontend\app\page.js" (echo [OK] frontend\app\page.js) else (echo [FAIL] frontend\app\page.js)
if exist "frontend\app\products\page.js" (echo [OK] frontend\app\products\page.js) else (echo [FAIL] frontend\app\products\page.js)
if exist "frontend\app\products\[id]\page.js" (echo [OK] frontend\app\products\[id]\page.js) else (echo [FAIL] frontend\app\products\[id]\page.js)
if exist "frontend\app\cart\page.js" (echo [OK] frontend\app\cart\page.js) else (echo [FAIL] frontend\app\cart\page.js)
if exist "frontend\app\checkout\page.js" (echo [OK] frontend\app\checkout\page.js) else (echo [FAIL] frontend\app\checkout\page.js)
if exist "frontend\app\order-success\page.js" (echo [OK] frontend\app\order-success\page.js) else (echo [FAIL] frontend\app\order-success\page.js)
if exist "frontend\components\Navigation.jsx" (echo [OK] frontend\components\Navigation.jsx) else (echo [FAIL] frontend\components\Navigation.jsx)
if exist "frontend\components\ImageUpload.jsx" (echo [OK] frontend\components\ImageUpload.jsx) else (echo [FAIL] frontend\components\ImageUpload.jsx)
if exist "frontend\.env.local" (echo [OK] frontend\.env.local) else (echo [WARN] frontend\.env.local - You may need to create this)
if exist "frontend\package.json" (echo [OK] frontend\package.json) else (echo [FAIL] frontend\package.json)

echo.
echo Config Files:
if exist "backend\prisma\schema.prisma" (echo [OK] backend\prisma\schema.prisma) else (echo [FAIL] backend\prisma\schema.prisma)
if exist "docker-compose.yml" (echo [OK] docker-compose.yml) else (echo [FAIL] docker-compose.yml)
if exist "FINAL_SETUP.md" (echo [OK] FINAL_SETUP.md) else (echo [FAIL] FINAL_SETUP.md)
if exist "README.md" (echo [OK] README.md) else (echo [FAIL] README.md)

echo.
echo =========================================
echo Verification complete!
echo =========================================
echo.
echo Next steps:
echo 1. Run: cd backend
echo 2. Run: npm install
echo 3. Run: npx prisma migrate dev
echo 4. Run: npm run dev
echo.
echo In another terminal:
echo 5. Run: cd frontend
echo 6. Run: npm install
echo 7. Run: npm run dev
echo.
echo Then open: http://localhost:3000
echo =========================================
echo.
pause

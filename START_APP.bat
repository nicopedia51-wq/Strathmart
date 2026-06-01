@echo off
REM StrathMart Complete Setup & Migration Guide (Windows)
REM This script sets up the entire StrathMart application with all fixes

echo.
echo ========================================== 
echo  STRATHMART COMPLETE SETUP & MIGRATION
echo ========================================== 
echo.

REM 1. Backend Setup
echo [1/6] Installing Backend Dependencies...
cd backend
call npm install

REM 2. Generate Prisma Client
echo.
echo [2/6] Generating Prisma Client...
call npm run prisma:generate

REM 3. Run Migration
echo.
echo [3/6] Running Database Migration...
echo This will create tables for escrow, meals, and campus activities
call npm run prisma:migrate

REM 4. Show Backend Ready
echo.
echo ========================================== 
echo  BACKEND READY
echo ========================================== 
echo Backend running on: http://localhost:5000
echo.
pause

REM 5. Frontend Setup
cd ..\frontend
echo [4/6] Installing Frontend Dependencies...
call npm install

REM 6. Show Complete
echo.
echo ========================================== 
echo  STRATHMART SETUP COMPLETE!
echo ========================================== 
echo.
echo NEXT STEPS:
echo -----------
echo 1. Open TWO NEW terminal windows
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo 📱 Frontend: http://localhost:3002
echo 🔌 Backend:  http://localhost:5000
echo.
echo 🎨 STRATHMORE BRANDING APPLIED:
echo    Primary Navy:    #003366
echo    Gold Action:     #E4B43A
echo    Red Accent:      #B5121B
echo    Background:      #FFFFFF (white), #F8F9FA (grey)
echo.
echo ✨ FEATURES ENABLED:
echo    ✓ Product Upload with Image Storage
echo    ✓ Escrow Payment System
echo    ✓ 4.5%% Platform Commission
echo    ✓ 48-Hour Delivery Deadline
echo    ✓ Campus Activities Hub
echo    ✓ Cafeteria Pre-Ordering System
echo    ✓ Seller Chat with 48h Timer
echo    ✓ Order Tracking
echo.
pause

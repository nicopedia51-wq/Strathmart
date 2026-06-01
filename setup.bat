@echo off
REM StrathMart Setup Script for Windows
REM This script automates the setup process

echo.
echo 🚀 StrathMart - Full Stack Setup
echo ================================
echo.

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo ✅ Node.js found
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Version: %NODE_VERSION%
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker not found. Database setup will require manual PostgreSQL installation.
) else (
    echo ✅ Docker found
    echo.
    echo 📦 Starting Docker services...
    docker-compose up -d
    echo ✅ Docker services started
    timeout /t 3 /nobreak
)

REM Backend Setup
echo.
echo 🔧 Setting up Backend...
cd backend

if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env created. Please edit it with your database credentials.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🗄️  Setting up Prisma...
call npm run prisma:generate

echo.
echo 📊 Running database migrations...
call npm run prisma:migrate

echo ✅ Backend setup complete!

REM Frontend Setup
echo.
echo ⚛️  Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    copy .env.example .env.local
    echo ✅ .env.local created
) else (
    echo ✅ .env.local file already exists
)

echo ✅ Frontend setup complete!

REM Summary
echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo 📚 Next Steps:
echo 1. Database: Check Docker containers are running
echo    docker ps
echo.
echo 2. Backend - Open a new terminal:
echo    cd backend
echo    npm run dev
echo    (API will run on http://localhost:5000)
echo.
echo 3. Frontend - Open another terminal:
echo    cd frontend
echo    npm run dev
echo    (App will run on http://localhost:3000)
echo.
echo 4. View API Docs:
echo    See backend/DEVELOPMENT.md
echo.
echo 5. Test the app:
echo    Go to http://localhost:3000
echo    Register a new account
echo    Start shopping!
echo.
echo 🎉 Happy coding!
echo.
pause

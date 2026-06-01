# StrathMart Setup Script
# This script automates the setup process

set -e

echo "🚀 StrathMart - Full Stack Setup"
echo "================================"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Database setup will require manual PostgreSQL installation."
fi

# Start Docker services
echo ""
echo "📦 Starting Docker services..."
if docker ps &> /dev/null; then
    docker-compose up -d
    echo "✅ Docker services started"
    sleep 3
else
    echo "⚠️  Docker not available. Please start PostgreSQL manually."
fi

# Backend Setup
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your database credentials."
else
    echo "✅ .env file already exists"
fi

# Prisma setup
echo ""
echo "🗄️  Setting up Prisma..."
npm run prisma:generate

# Try migrations
echo "📊 Running database migrations..."
npm run prisma:migrate || echo "⚠️  Migrations may have failed. Check database connection."

echo "✅ Backend setup complete!"

# Frontend Setup
echo ""
echo "⚛️  Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local file already exists"
fi

echo "✅ Frontend setup complete!"

# Summary
echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📚 Next Steps:"
echo "1. Database: Check the Docker containers are running"
echo "   docker ps"
echo ""
echo "2. Backend - In terminal 1:"
echo "   cd backend"
echo "   npm run dev"
echo "   (API will run on http://localhost:5000)"
echo ""
echo "3. Frontend - In terminal 2:"
echo "   cd frontend"
echo "   npm run dev"
echo "   (App will run on http://localhost:3000)"
echo ""
echo "4. View API Docs:"
echo "   See backend/DEVELOPMENT.md"
echo ""
echo "5. Test the app:"
echo "   Go to http://localhost:3000"
echo "   Register a new account"
echo "   Start shopping!"
echo ""
echo "🎉 Happy coding!"

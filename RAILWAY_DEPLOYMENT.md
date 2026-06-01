# 🚀 StrathMart Railway Deployment Guide

**Status**: ✅ Backend & Frontend running locally at http://localhost:3000

## Quick Deploy Steps (15 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named: `strathmart`
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"
5. Copy the URL (will be: `https://github.com/nicopedia51-wq/strathmart.git`)

### Step 2: Push Code to GitHub

Run these commands in PowerShell:

```powershell
cd c:\Users\ADMIN\Desktop\Shaileen
git remote add origin https://github.com/nicopedia51-wq/strathmart.git
git branch -M main
git push -u origin main
```

✅ Wait for push to complete (shows "master -> main")

### Step 3: Deploy to Railway

1. **Sign up/Log in to Railway**:
   - Go to https://railway.app
   - Click "Sign up with GitHub"
   - Authorize Railway to access your GitHub

2. **Create New Project**:
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Select repository: `strathmart`
   - Click "Deploy"

3. **Configure Backend Service**:
   - Railway automatically detects `backend/package.json`
   - Click the Backend service
   - Go to Settings tab:
     - **Root Directory**: `backend`
     - **Start Command**: `npm run prisma:migrate && node src/server.js`
   - Go to Variables tab, add:
     ```
     DATABASE_URL=file:./prisma/dev.db
     JWT_SECRET=your_production_secret_key_change_this_12345
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ADMIN_FEE_PERCENTAGE=4.5
     ```
   - Railway generates `RAILWAY_PUBLIC_URL` automatically - this is your backend URL
   - Save and deploy

4. **Configure Frontend Service**:
   - Click "Add Service" → "GitHub Repo"
   - Select same `strathmart` repo
   - In Root Directory: `frontend`
   - Go to Variables tab, add:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-backend-url
     ```
   - Save and deploy

### Step 4: Get Your Live URLs

After both services deploy:
- **Backend URL**: Click Backend service, see "Railway URL" (e.g., `https://railway.app/project/xyz`)
- **Frontend URL**: Click Frontend service, see "Railway URL"

Update Frontend Variables:
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Redeploy frontend

### Step 5: Test Live App

1. Go to your frontend URL
2. Click "Register" 
3. Create test account (email: test@test.com, password: Test123!)
4. Browse products
5. Add to cart and verify 4.5% admin fee calculates
6. Complete test order

## 🎉 You're Live!

Your StrathMart marketplace is now deployed and accessible worldwide!

## Troubleshooting

**Frontend not loading?**
- Check `NEXT_PUBLIC_API_URL` is set to backend Railway URL
- Redeploy frontend

**API calls failing?**
- Verify backend `FRONTEND_URL` matches your frontend domain
- Check DATABASE_URL is set correctly
- Check logs: Click service → Logs tab

**Database errors?**
- Backend uses SQLite (file-based)
- Database file is created automatically on first run
- Check Migration: `npm run prisma:migrate`

## Production Improvements (Phase 2)

1. **Database**: Migrate to PostgreSQL
   - Railway offers managed PostgreSQL
   - Update `DATABASE_URL` to PostgreSQL connection string

2. **Security**: 
   - Generate strong JWT_SECRET (use `openssl rand -base64 32`)
   - Use real domain with HTTPS
   - Configure CORS properly

3. **Performance**:
   - Add caching
   - Optimize images
   - Enable compression

## Support

If deployment fails:
1. Check Railway Logs (Service → Logs)
2. Verify environment variables are set
3. Check backend/package.json has all dependencies
4. Ensure Prisma migrations completed

Good luck! 🚀

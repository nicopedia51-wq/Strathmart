# StrathMart Frontend - Development Guide

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend API running on http://localhost:5000

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend

npm install
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Verify it contains (should be default):
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Your app will be available at **http://localhost:3000**

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.js           # Root layout with AuthProvider
│   ├── page.js             # Home page
│   ├── login/page.js       # Login page
│   ├── register/page.js    # Registration page
│   ├── products/
│   │   ├── page.js         # Products listing
│   │   └── [id]/page.js    # Product details
│   └── cart/page.js        # Shopping cart
├── components/             # Reusable components
├── context/
│   └── AuthContext.jsx     # Authentication context
├── lib/
│   └── api.js              # Axios instance
├── styles/
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
└── jsconfig.json           # Path aliases
```

## 🔑 Key Features

### Authentication System

The `AuthContext` provides:

```javascript
// Usage in components
'use client';
import { useAuth } from '@/context/AuthContext';

export default function Component() {
  const { user, token, login, register, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return <div>Welcome, {user.fullName}</div>;
  }
  
  return <div>Please login</div>;
}
```

### API Integration

```javascript
import api from '@/lib/api';

// Automatically includes token in requests
const response = await api.get('/products');

// POST request
await api.post('/cart/add', { productId: 1, quantity: 2 });

// PUT request
await api.put('/products/:id', { title: 'New Title' });

// DELETE request
await api.delete('/cart/:itemId');
```

## 📄 Available Pages

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/products` - Products listing (with search/filter)
- `/products/:id` - Product details

### Protected Pages (Require Login)
- `/cart` - Shopping cart
- `/dashboard` - User dashboard (to be implemented)
- `/orders` - Order history (to be implemented)
- `/profile` - User profile (to be implemented)

## 🎨 Styling

### TailwindCSS Configuration

The project uses TailwindCSS with custom colors:

```javascript
// Custom colors in tailwind.config.js
colors: {
  primary: '#0066cc',    // Professional blue
  secondary: '#ff9900',  // Orange accent
  danger: '#ff0000',
  success: '#00b300',
  warning: '#ffb300'
}
```

### Dark Mode

Built-in dark mode support:

```javascript
// Automatically applies dark: prefix
<div className="bg-white dark:bg-gray-900">
  Content adapts to theme
</div>
```

### Glassmorphism Component

```javascript
// Pre-built glass effect
<div className="glass p-6 rounded-lg">
  Modern glassmorphic card
</div>
```

## 🔄 Development Workflow

### Adding a New Page

1. Create file in `app/` directory
2. Use `'use client'` for client components
3. Import necessary hooks and components
4. Implement page logic

```javascript
// app/new-page/page.js
'use client';

import { useAuth } from '@/context/AuthContext';

export default function NewPage() {
  const { user } = useAuth();
  
  return (
    <main className="min-h-screen">
      <h1>New Page</h1>
    </main>
  );
}
```

### Adding a New Component

```javascript
// components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="glass p-4 rounded-lg">
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

### API Error Handling

```javascript
try {
  const response = await api.post('/orders/create', { ...data });
  console.log('Success:', response.data);
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  alert(message);
}
```

## 🧪 Testing Components

### Using Browser DevTools

1. Open http://localhost:3000
2. Open Developer Tools (F12)
3. Check Console for errors
4. Use Network tab to inspect API calls

### Testing Authentication

```javascript
// Test login
1. Go to /login
2. Enter: test@school.com / password123
3. Should redirect to /products on success

// Test registration
1. Go to /register
2. Fill in form
3. Should redirect to /products on success
```

### Testing Cart and Orders

```javascript
1. Register/Login
2. Go to /products
3. Click on a product
4. Add to cart
5. Go to /cart
6. Proceed to checkout
7. Check /orders for order history
```

## 🚀 Build and Deploy

### Production Build

```bash
npm run build

# This creates an optimized build in .next/
# Check for any errors before deploying
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project root)
vercel

# Or deploy frontend folder
vercel frontend/
```

### Deploy to Other Platforms

```bash
# Build the app
npm run build

# Export static site (for static hosting)
npm run export

# Deploy the 'out' folder to GitHub Pages, Netlify, etc.
```

## 🔐 Security Best Practices

1. **Never expose API keys** in frontend code
2. **Store tokens securely** in localStorage (or cookies with httpOnly)
3. **Validate user input** before sending to API
4. **Use HTTPS** in production
5. **Implement CORS** properly on backend

## 📦 Dependencies

### Core
- **next** - React framework
- **react** - UI library
- **react-dom** - React renderer

### Styling
- **tailwindcss** - Utility-first CSS
- **postcss** - CSS processing
- **autoprefixer** - Browser prefix automation

### State & API
- **axios** - HTTP client
- **zustand** - State management (optional)
- **socket.io-client** - Real-time features

### UI Enhancements
- **react-hot-toast** - Toast notifications
- **react-icons** - Icon library
- **clsx** - Conditional classnames

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### API Not Connecting
1. Verify backend is running: `http://localhost:5000/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for errors
4. Verify CORS is enabled on backend

### Build Errors
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

## 💡 Performance Tips

1. **Use Next.js Image component** for optimized images
2. **Implement lazy loading** for routes
3. **Code split** large components
4. **Cache API responses** when appropriate
5. **Monitor bundle size** regularly

## 📝 Phase 2 Components To Build

- [ ] Seller Dashboard
- [ ] Order History Page
- [ ] User Profile Page
- [ ] Chat Component (Socket.IO)
- [ ] Real-time Notifications
- [ ] Product Reviews Component
- [ ] Admin Dashboard (if admin)
- [ ] Wishlist Feature

## 🔗 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)

---

**Ready to start developing?** Happy coding! 🚀

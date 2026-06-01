'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { STRATHMORE_COLORS } from '@/lib/strathmore-colors';

export default function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav 
      className="text-white shadow-xl sticky top-0 z-50"
      style={{ backgroundColor: STRATHMORE_COLORS.primary }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Branding */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <img src="/logo.svg" alt="StrathMart" className="h-12 w-12" />
            <div className="hidden sm:block">
              <div className="text-2xl font-black">StrathMart</div>
              <div className="text-xs opacity-75">Strathmore University</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1 items-center">
            <Link 
              href="/products" 
              className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link 
                  href="/meals" 
                  className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  🍽️ Meals
                </Link>

                <Link 
                  href="/activities" 
                  className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  📢 News
                </Link>

                <Link 
                  href="/cart" 
                  className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  🛒 Cart
                </Link>

                <Link 
                  href="/sell" 
                  className="px-4 py-2 rounded transition flex items-center gap-2 font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: STRATHMORE_COLORS.action }}
                >
                  📦 Sell
                </Link>

                <Link 
                  href="/messages" 
                  className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  💬 Messages
                </Link>

                {user.role === 'seller' && (
                  <Link 
                    href="/seller/dashboard" 
                    className="px-4 py-2 rounded transition flex items-center gap-2 font-semibold text-white hover:opacity-90"
                    style={{ backgroundColor: STRATHMORE_COLORS.accent }}
                  >
                    📊 Dashboard
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative group">
                  <button 
                    className="px-4 py-2 hover:opacity-80 rounded transition flex items-center gap-2 font-semibold"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    👤 {user.fullName?.split(' ')[0]} ▼
                  </button>
                  <div 
                    className="absolute right-0 mt-0 w-56 rounded-lg shadow-2xl hidden group-hover:block z-10"
                    style={{ backgroundColor: STRATHMORE_COLORS.bgLight }}
                  >
                    <Link 
                      href="/buyer/dashboard" 
                      className="block px-4 py-3 hover:bg-gray-100 font-semibold border-b"
                      style={{ color: STRATHMORE_COLORS.primary }}
                    >
                      📋 My Orders
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 hover:bg-gray-100 font-semibold border-b"
                      style={{ color: STRATHMORE_COLORS.primary }}
                    >
                      ⚙️ Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 font-semibold"
                      style={{ color: STRATHMORE_COLORS.accent }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 rounded hover:opacity-90 transition font-semibold text-white"
                  style={{ backgroundColor: STRATHMORE_COLORS.action }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-3xl font-bold hover:opacity-80 p-2 rounded transition"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden pb-4 space-y-2 border-t border-opacity-20 border-white pt-4">
            <Link
              href="/products"
              className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => setMenuOpen(false)}
            >
              🛍️ Shop
            </Link>

            {user ? (
              <>
                <Link
                  href="/meals"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  🍽️ Meals
                </Link>

                <Link
                  href="/activities"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  📢 News
                </Link>

                <Link
                  href="/cart"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  🛒 Cart
                </Link>

                <Link
                  href="/sell"
                  className="block px-4 py-2 rounded transition font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: STRATHMORE_COLORS.action }}
                  onClick={() => setMenuOpen(false)}
                >
                  📦 Sell
                </Link>

                <Link
                  href="/messages"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  💬 Messages
                </Link>

                {user.role === 'seller' && (
                  <Link
                    href="/seller/dashboard"
                    className="block px-4 py-2 rounded transition font-semibold text-white hover:opacity-90"
                    style={{ backgroundColor: STRATHMORE_COLORS.accent }}
                    onClick={() => setMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                )}

                <Link
                  href="/buyer/dashboard"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  📋 My Orders
                </Link>

                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  ⚙️ Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:opacity-80 rounded transition font-semibold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 rounded hover:opacity-90 transition font-semibold text-white"
                  style={{ backgroundColor: STRATHMORE_COLORS.action }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

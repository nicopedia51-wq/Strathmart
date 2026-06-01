'use client';

import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { STRATHMORE_COLORS } from '@/lib/strathmore-colors';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Sports', 'Furniture', 'Accessories', 'Food', 'General'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          params: { page, search, category, limit: 12 }
        }
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, e) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✓ Product added to cart!');
    } catch (error) {
      alert('✕ Failed to add to cart');
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: STRATHMORE_COLORS.bgGrey }}>
      {/* Header */}
      <div className="text-white shadow-lg" style={{ backgroundColor: STRATHMORE_COLORS.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">🛍️ Products</h1>
          <p className="opacity-75">Browse thousands of products from student sellers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
                Search Products 🔍
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none transition"
                style={{ borderColor: STRATHMORE_COLORS.action, focusBorderColor: STRATHMORE_COLORS.primary }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
                Category 🏷️
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer transition"
                style={{ borderColor: STRATHMORE_COLORS.action }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sell Button */}
            <div className="flex items-end">
              <Link
                href="/sell"
                className="w-full py-2 px-4 rounded-lg text-white font-bold text-center transition hover:opacity-90"
                style={{ backgroundColor: STRATHMORE_COLORS.action }}
              >
                📦 Sell Product
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    
                    {/* Price & Stock */}
                    <div className="flex justify-between items-center mb-4">
                      <div style={{ color: STRATHMORE_COLORS.accent }} className="text-xl font-bold">
                        KES {product.price?.toFixed(2)}
                      </div>
                      <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: STRATHMORE_COLORS.bgGrey, color: STRATHMORE_COLORS.primary }}>
                        Stock: {product.stock}
                      </div>
                    </div>

                    {/* Seller Info */}
                    {product.seller && (
                      <div className="text-xs text-gray-600 mb-4 pb-4 border-b">
                        By: <strong>{product.seller.fullName}</strong>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition bg-gray-200 text-gray-800 hover:bg-gray-300 text-center"
                      >
                        👁️ View
                      </Link>
                      <button
                        onClick={(e) => addToCart(product.id, e)}
                        disabled={product.stock <= 0}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
                          product.stock > 0
                            ? 'text-white hover:opacity-90'
                            : 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                        }`}
                        style={{
                          backgroundColor: product.stock > 0 ? STRATHMORE_COLORS.action : undefined
                        }}
                      >
                        {product.stock > 0 ? '🛒 Buy' : 'Out'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
                  style={{ backgroundColor: STRATHMORE_COLORS.primary }}
                >
                  ← Previous
                </button>
                <div className="px-4 py-2 text-gray-700 font-bold">
                  Page {page}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-2 rounded-lg font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: STRATHMORE_COLORS.action }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

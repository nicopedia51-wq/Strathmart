'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { STRATHMORE_COLORS } from '@/lib/strathmore-colors';

export default function SellProductPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    image: null
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: STRATHMORE_COLORS.bgGrey }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: STRATHMORE_COLORS.primary }}>
            📦 Login to Sell
          </h1>
          <p className="text-gray-600 mb-8">You need to be logged in to list products</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-lg text-white font-bold text-lg transition hover:opacity-90"
            style={{ backgroundColor: STRATHMORE_COLORS.action }}
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Image must be less than 20MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title || !formData.price || !formData.category || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.image) {
      setError('Please select a product image');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('category', formData.category);
      form.append('stock', formData.stock);
      form.append('image', formData.image);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('✓ Product listed successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        stock: '',
        image: null
      });
      setImagePreview('');

      setTimeout(() => {
        router.push('/products');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: STRATHMORE_COLORS.bgGrey }}>
      {/* Header */}
      <div className="text-white shadow-lg" style={{ backgroundColor: STRATHMORE_COLORS.primary }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">📦</div>
            <div>
              <h1 className="text-3xl font-bold">List a New Product</h1>
              <p className="opacity-75">Reach thousands of students instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
            ✓ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 border-t-4" style={{ borderTopColor: STRATHMORE_COLORS.action }}>
          {/* Product Image */}
          <div className="mb-8">
            <label className="block text-lg font-bold mb-4" style={{ color: STRATHMORE_COLORS.primary }}>
              Product Image 🖼️
            </label>
            <div className="flex gap-8 items-start">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="block w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition"
                  style={{ borderColor: STRATHMORE_COLORS.action }}
                />
                <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP up to 20MB</p>
              </div>
              {imagePreview && (
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2" style={{ borderColor: STRATHMORE_COLORS.action }}>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
              Product Title 📝
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Apple Watch Series 8"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ focusBorderColor: STRATHMORE_COLORS.action, focusRingColor: STRATHMORE_COLORS.bgGrey }}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-lg font-bold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
              Description 📄
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Describe your product in detail..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
            />
          </div>

          {/* Price & Category Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Price */}
            <div>
              <label className="block text-lg font-bold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
                Price (KES) 💰
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-bold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
                Category 🏷️
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Food">Food</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="mb-8">
            <label className="block text-lg font-bold mb-2" style={{ color: STRATHMORE_COLORS.primary }}>
              Stock Quantity 📊
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Number of items available"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
            />
          </div>

          {/* Fee Info */}
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: STRATHMORE_COLORS.bgGrey }}>
            <p className="text-gray-700 font-semibold mb-2">💡 How We Calculate Your Earnings:</p>
            <p className="text-gray-700">
              Your earnings = Product Price - (4.5% commission) - Taxes (if applicable)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg text-white font-bold text-lg transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: STRATHMORE_COLORS.action }}
          >
            {loading ? '⏳ Uploading...' : '🚀 List Product'}
          </button>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/products" className="text-gray-600 hover:underline">
              ← Back to Products
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

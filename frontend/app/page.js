'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <img src="/logo.svg" alt="StrathMart Logo" className="w-32 h-32 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-6xl font-black mb-4 drop-shadow-lg">StrathMart</h1>
            <p className="text-2xl font-bold mb-2 drop-shadow-lg">Your Student Marketplace</p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto drop-shadow-lg">
              Buy, sell, and trade with thousands of students. Fast shipping. Safe payments. Real community.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-8">🎯 Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '💻', name: 'Electronics', color: 'from-blue-400 to-blue-600' },
            { icon: '📚', name: 'Books', color: 'from-purple-400 to-purple-600' },
            { icon: '👕', name: 'Clothing', color: 'from-pink-400 to-pink-600' },
            { icon: '⚽', name: 'Sports', color: 'from-green-400 to-green-600' },
            { icon: '🪑', name: 'Furniture', color: 'from-yellow-400 to-yellow-600' },
            { icon: '🎀', name: 'Accessories', color: 'from-red-400 to-red-600' },
            { icon: '🍽️', name: 'Food & Meals', color: 'from-orange-400 to-orange-600' },
            { icon: '🎁', name: 'General', color: 'from-indigo-400 to-indigo-600' },
          ].map((cat, i) => (
            <Link key={i} href="/products" className={`bg-gradient-to-br ${cat.color} rounded-lg p-6 text-white text-center font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition`}>
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16 my-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black mb-2 drop-shadow-lg">🔥 Today's Hot Deals</h2>
              <p className="text-lg opacity-90">Limited time offers you won&apos;t want to miss</p>
            </div>
            <Link href="/deals" className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">
              View All Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* Why StrathMart Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">💡 Why Choose StrathMart?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎓',
              title: 'By Students, For Students',
              desc: 'Built specifically for the school community with features that matter to you.'
            },
            {
              icon: '🛡️',
              title: 'Safe & Secure',
              desc: 'Verified sellers, secure payments, and buyer protection on every transaction.'
            },
            {
              icon: '⚡',
              title: 'Fast & Easy',
              desc: 'List products in seconds. Buy instantly. Get what you need without the hassle.'
            },
            {
              icon: '💰',
              title: 'Best Prices',
              desc: 'Compare prices across thousands of sellers. Always get the best deal.'
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              desc: 'Shop anytime, anywhere on your phone. Easy checkout in just a few taps.'
            },
            {
              icon: '🤝',
              title: 'Real Community',
              desc: 'Chat with sellers. Build reputation. Be part of something bigger.'
            },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-xl border-2 border-orange-200 hover:shadow-xl transition">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 my-12 rounded-2xl mx-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4 drop-shadow-lg">Ready to Start Selling? 🚀</h2>
          <p className="text-lg mb-6 opacity-90">Join hundreds of student sellers. Turn your items into cash today!</p>
          {!user ? (
            <Link href="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-500 transition shadow-lg text-lg">
              Sign Up & Start Selling →
            </Link>
          ) : (
            <Link href="/sell" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-500 transition shadow-lg text-lg">
              List Your First Product →
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10K+', label: 'Active Products' },
            { number: '5K+', label: 'Student Sellers' },
            { number: '50K+', label: 'Happy Buyers' },
            { number: '24/7', label: 'Customer Support' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl border-2 border-orange-300">
              <div className="text-4xl font-black text-orange-600 mb-2">{stat.number}</div>
              <div className="text-gray-700 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Join the StrathMart Community Today</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition">
              🛍️ Shop Now
            </Link>
            <Link href="/register" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition">
              📝 Register
            </Link>
            <Link href="/meals" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition">
              🍽️ Order Food
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'breakfast', 'lunch', 'dinner'];

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meals`);
      setMeals(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = category === 'all' 
    ? meals 
    : meals.filter(meal => meal.category === category);

  const addToCart = (meal) => {
    const existing = cart.find(item => item.id === meal.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === meal.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
  };

  const removeFromCart = (mealId) => {
    setCart(cart.filter(item => item.id !== mealId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading meals...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">School Meals</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <Link href="/products" className="text-primary hover:underline">Products</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Meals List */}
          <div className="md:col-span-3">
            {/* Category Filter */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 border border-primary text-primary hover:bg-gray-100'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Meals Grid */}
            {filteredMeals.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>No meals available in this category</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredMeals.map((meal) => (
                  <div key={meal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    {meal.imageUrl && (
                      <img src={meal.imageUrl} alt={meal.foodName} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{meal.foodName}</h3>
                      {meal.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{meal.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-primary">KES {meal.price}</p>
                        <button
                          onClick={() => addToCart(meal)}
                          disabled={!meal.available}
                          className={`px-4 py-2 rounded font-semibold transition ${
                            meal.available
                              ? 'bg-primary text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {meal.available ? '+ Order' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit sticky top-20">
            <h3 className="text-xl font-bold mb-4">Your Order</h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">No items selected</p>
            ) : (
              <>
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.foodName}</p>
                        <p className="text-xs text-gray-500">KES {item.price} × {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">KES {getTotalPrice()}</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700">
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

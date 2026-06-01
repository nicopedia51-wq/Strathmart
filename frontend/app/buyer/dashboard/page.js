'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function BuyerDashboard() {
  const { user, token, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchBuyerData();
    }
  }, [token]);

  const fetchBuyerData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/buyer/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/buyer/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBuyerData();
      alert('Order cancelled successfully');
    } catch (error) {
      alert('Failed to cancel order: ' + error.message);
    }
  };

  if (loading || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Purchases</h1>
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/products" className="bg-primary text-white p-6 rounded-lg hover:bg-blue-700 text-center">
            <p className="text-2xl font-bold">📦</p>
            <p className="font-semibold">Continue Shopping</p>
          </Link>
          <Link href="/messages" className="bg-secondary text-white p-6 rounded-lg hover:bg-purple-700 text-center">
            <p className="text-2xl font-bold">💬</p>
            <p className="font-semibold">Messages</p>
          </Link>
          <Link href="/cart" className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-center">
            <p className="text-2xl font-bold">🛒</p>
            <p className="font-semibold">My Cart</p>
          </Link>
        </div>

        {/* Orders Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold">Your Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet.</p>
              <Link href="/products" className="text-primary hover:underline">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="font-semibold">{order.product?.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-semibold">KES {order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-semibold px-3 py-1 rounded-full text-sm w-fit ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/messages?seller=${order.seller?.id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Message Seller
                      </Link>
                      {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

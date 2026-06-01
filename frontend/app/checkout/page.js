'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user, router]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load cart');
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const adminFee = subtotal * 0.045; // 4.5% fee
    const total = subtotal + adminFee;
    return { subtotal, adminFee, total };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
          !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
        setError('Please fill in all shipping details');
        setProcessing(false);
        return;
      }

      if (cart.length === 0) {
        setError('Your cart is empty');
        setProcessing(false);
        return;
      }

      const token = localStorage.getItem('token');

      // Group items by seller for order creation
      const ordersBySeller = {};
      cart.forEach(item => {
        const sellerId = item.product.sellerId;
        if (!ordersBySeller[sellerId]) {
          ordersBySeller[sellerId] = [];
        }
        ordersBySeller[sellerId].push(item);
      });

      // Create orders for each seller
      const orderPromises = Object.entries(ordersBySeller).map(([sellerId, items]) => {
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          })),
          shippingInfo,
          subtotal
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      await Promise.all(orderPromises);

      // Clear cart
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to success page
      router.push('/order-success');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, adminFee, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handlePlaceOrder}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Order Items Summary */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 border-b border-gray-200 pb-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{item.product.title} x {item.quantity}</span>
                        <span className="font-semibold">KES {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">KES {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-orange-600">
                  <span>Platform Fee (4.5%):</span>
                  <span className="font-semibold">+ KES {adminFee.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>KES {total.toFixed(2)}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Platform Fee Breakdown:</p>
                  <p>Our 4.5% platform fee helps us maintain and improve the marketplace for all users.</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-600">
                  <p className="font-semibold mb-2">Items in cart:</p>
                  <p className="text-lg font-bold text-gray-900">{cart.length} items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

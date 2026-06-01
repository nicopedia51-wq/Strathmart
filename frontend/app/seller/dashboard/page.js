'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalEarnings: 0,
    totalProducts: 0,
    totalOrders: 0,
    rating: 0
  });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'seller')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      fetchSellerData();
    }
  }, [token]);

  const fetchSellerData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data.data || []);
      setOrders(ordersRes.data.data || []);

      // Calculate stats
      const totalEarnings = ordersRes.data.data?.reduce((sum, order) => sum + (order.sellerAmount || 0), 0) || 0;
      setStats({
        totalSales: ordersRes.data.data?.length || 0,
        totalEarnings: totalEarnings,
        totalProducts: productsRes.data.data?.length || 0,
        totalOrders: ordersRes.data.data?.length || 0,
        rating: user?.sellerRating || 0
      });
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/seller/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      alert('Failed to delete product: ' + error.message);
    }
  };

  if (loading || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'seller') {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalSales}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
            <p className="text-3xl font-bold mt-2">KES {stats.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Products Listed</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Seller Rating</h3>
            <p className="text-3xl font-bold mt-2">⭐ {stats.rating.toFixed(1)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/seller/upload"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            + Upload Product
          </Link>
          <Link
            href="/seller/store"
            className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Manage Store
          </Link>
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold">Your Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No products listed yet.</p>
              <Link href="/seller/upload" className="text-primary hover:underline mt-2">Upload your first product</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Sales</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 font-semibold">{product.title}</td>
                      <td className="px-6 py-4">KES {product.price}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4">{product._count?.orders || 0}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Link href={`/seller/edit/${product.id}`} className="text-blue-500 hover:underline">Edit</Link>
                        <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Buyer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.product?.title}</td>
                      <td className="px-6 py-4">{order.buyer?.fullName}</td>
                      <td className="px-6 py-4">KES {order.sellerAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

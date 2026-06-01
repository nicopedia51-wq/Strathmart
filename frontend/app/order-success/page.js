'use client';

import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly with order details and tracking information.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600">You can track your orders in your account dashboard</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Questions? Check our <span className="text-blue-600 font-semibold">Help Center</span></p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/buyer-dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

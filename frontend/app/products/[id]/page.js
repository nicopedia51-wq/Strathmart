'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetail({ params }) {
  const { id } = params;
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const room = user ? `product-${id}-seller-${product?.seller?.id}-buyer-${user.id}` : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !user) return;

    // initialize socket
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL.replace('/api', ''), {
      transports: ['websocket']
    });

    socketRef.current = socket;

    const myRoom = `product-${id}-seller-${product.seller.id}-buyer-${user.id}`;
    socket.emit('joinRoom', myRoom);

    socket.on('newMessage', (msg) => {
      // Filter only messages for this product (if content was prefixed)
      if (msg.content && msg.content.includes(`[product:${id}]`)) {
        // strip prefix for display
        const display = msg.content.replace(`[product:${id}] `, '');
        setMessages((m) => [...m, { ...msg, content: display }]);
      }
    });

    return () => {
      socket.emit('leaveRoom', myRoom);
      socket.disconnect();
    };
  }, [product, user]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      setProduct(res.data.product);
      setLoading(false);
      if (user) fetchMessages(res.data.product.seller.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMessages = async (sellerId) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${sellerId}`, {
        params: { productId: id },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Strip product prefix for display
      const msgs = res.data.data.map((m) => ({ ...m, content: m.content.replace(`[product:${id}] `, '') }));
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    try {
      // Persist via API (will prefix with productId)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        receiverId: product.seller.id,
        content: text,
        productId: id
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Emit over socket to the room
      const myRoom = `product-${id}-seller-${product.seller.id}-buyer-${user.id}`;
      socketRef.current?.emit('sendMessage', {
        content: text,
        senderId: user.id,
        receiverId: product.seller.id,
        productId: id,
        room: myRoom
      });

      setText('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.title} className="w-full h-96 object-cover rounded-lg mb-6" />
          )}
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-primary mb-4">KES {product.price}</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded">Buy Now</button>
            <button className="px-4 py-2 bg-gray-100 rounded">Add to Cart</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-bold mb-2">Chat with Seller</h3>
          {!user ? (
            <p className="text-gray-500">Please login to message the seller.</p>
          ) : (
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-2 space-y-2 mb-2">
                {messages.map((m) => (
                  <div key={m.id} className={`p-2 rounded ${m.senderId === user.id ? 'bg-primary text-white self-end' : 'bg-gray-100 dark:bg-gray-700 self-start'}`}>
                    <div className="text-sm">{m.content}</div>
                    <div className="text-xs opacity-60 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Type your message..." />
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

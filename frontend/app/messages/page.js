'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  const { user, token, loading } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchConversations();
      const sellerId = searchParams.get('seller');
      if (sellerId) {
        setSelectedUser({ id: parseInt(sellerId) });
      }
    }
  }, [token]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        {
          receiverId: selectedUser.id,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data.data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      alert('Failed to send message: ' + error.message);
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
          <h1 className="text-2xl font-bold">Messages</h1>
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4 h-96">
          {/* Conversations List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-bold">Conversations</h3>
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedUser(conv.otherUser)}
                    className={`w-full p-4 border-b dark:border-gray-700 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                      selectedUser?.id === conv.otherUser?.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                  >
                    <p className="font-semibold">{conv.otherUser?.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
            {!selectedUser ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-700 font-bold">
                  {selectedUser.fullName}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.senderId === user?.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="border-t dark:border-gray-700 p-4 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

/**
 * GET /api/messages/conversations
 * Get all conversations for the authenticated user
 */
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation
    const conversations = {};
    messages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          id: otherUserId,
          otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt
        };
      }
    });

    const conversationList = Object.values(conversations).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.json({
      status: 'success',
      data: conversationList
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * GET /api/messages/:userId
 * Get all messages between authenticated user and another user
 */
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const { productId } = req.query;

    // Optional product-scoped messages. Messages created with a product will have a prefix [product:ID] in content.
    const baseFilter = {
      OR: [
        { senderId: currentUserId, receiverId: parseInt(userId) },
        { senderId: parseInt(userId), receiverId: currentUserId }
      ]
    };

    const contentFilter = productId ? { content: { contains: `[product:${productId}]` } } : {};

    const messages = await prisma.message.findMany({
      where: {
        AND: [baseFilter, contentFilter]
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: parseInt(userId),
        receiverId: currentUserId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      status: 'success',
      data: messages
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/messages
 * Send a message
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content, productId } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        error: { message: 'Receiver ID and content are required' }
      });
    }

    // If productId is provided, prefix the content so we can filter by product conversations
    const storedContent = productId ? `[product:${productId}] ${content}` : content;

    const message = await prisma.message.create({
      data: {
        content: storedContent,
        senderId: req.user.id,
        receiverId: parseInt(receiverId)
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        receiver: { select: { id: true, fullName: true } }
      }
    });

    res.status(201).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * GET /api/messages/:userId/unread
 * Get count of unread messages from a user
 */
router.get('/:userId/unread', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const count = await prisma.message.count({
      where: {
        senderId: parseInt(userId),
        receiverId: currentUserId,
        isRead: false
      }
    });

    res.json({
      status: 'success',
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;

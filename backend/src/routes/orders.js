const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');
const { calculateAdminFee, calculateSellerAmount, generateOrderNumber } = require('../utils/helpers');

/**
 * POST /api/orders/create
 * Create order from cart
 */
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: 'Empty cart',
        message: 'Cannot create order from an empty cart'
      });
    }

    // Group by seller
    const ordersBySeller = {};
    cartItems.forEach(item => {
      if (!ordersBySeller[item.product.sellerId]) {
        ordersBySeller[item.product.sellerId] = [];
      }
      ordersBySeller[item.product.sellerId].push(item);
    });

    const orders = [];

    // Create orders for each seller
    for (const [sellerId, items] of Object.entries(ordersBySeller)) {
      const orderData = [];

      for (const item of items) {
        const totalAmount = item.product.price * item.quantity;
        const adminFee = calculateAdminFee(totalAmount);
        const sellerAmount = calculateSellerAmount(totalAmount);

        // Create individual order
        const order = await prisma.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            quantity: item.quantity,
            totalAmount,
            adminFee,
            sellerAmount,
            buyerId: req.user.id,
            sellerId: parseInt(sellerId),
            productId: item.productId,
            paymentMethod: paymentMethod || 'stripe',
            orderStatus: 'pending',
            paymentStatus: 'unpaid'
          }
        });

        // Update product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        orders.push(order);
      }
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.status(201).json({
      message: 'Order(s) created successfully',
      orders,
      orderCount: orders.length,
      totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      totalAdminFee: orders.reduce((sum, o) => sum + o.adminFee, 0)
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: error.message
    });
  }
});

/**
 * GET /api/orders
 * Get user's orders (buyer or seller)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      OR: [
        { buyerId: req.user.id },
        { sellerId: req.user.id }
      ],
      ...(status && { orderStatus: status })
    };

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        product: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            price: true
          }
        },
        buyer: {
          select: { id: true, fullName: true, email: true }
        },
        seller: {
          select: { id: true, fullName: true, storeName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to get orders',
      message: error.message
    });
  }
});

/**
 * GET /api/orders/:id
 * Get single order details
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        product: true,
        buyer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            address: true
          }
        },
        seller: {
          select: {
            id: true,
            fullName: true,
            storeName: true,
            sellerRating: true
          }
        },
        reviews: true
      }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    // Check authorization
    if (order.buyerId !== req.user.id && order.sellerId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this order'
      });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Failed to get order',
      message: error.message
    });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status (seller only)
 */
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    if (order.sellerId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only seller can update order status'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { orderStatus }
    });

    res.json({
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      message: error.message
    });
  }
});

module.exports = router;

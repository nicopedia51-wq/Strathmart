const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

/**
 * GET /api/buyer/orders
 * Get all orders for the authenticated buyer
 */
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: {
        product: true,
        seller: { select: { id: true, fullName: true, storeName: true } },
        buyer: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/buyer/orders
 * Create a new order
 */
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        error: { message: 'Product ID and quantity are required' }
      });
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        error: { message: 'Product not found' }
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: { message: 'Insufficient stock' }
      });
    }

    // Calculate amounts
    const totalAmount = product.price * quantity;
    const adminFee = totalAmount * 0.045; // 4.5%
    const sellerAmount = totalAmount - adminFee;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        quantity: parseInt(quantity),
        totalAmount,
        adminFee,
        sellerAmount,
        paymentMethod: paymentMethod || 'wallet',
        buyerId: req.user.id,
        sellerId: product.sellerId,
        productId: parseInt(productId),
        orderStatus: 'pending',
        paymentStatus: 'unpaid'
      },
      include: {
        product: true,
        seller: true,
        buyer: true
      }
    });

    // Update product stock
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { stock: product.stock - quantity }
    });

    res.status(201).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/buyer/orders/:id/cancel
 * Cancel an order
 */
router.post('/orders/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({
        error: { message: 'Order not found' }
      });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        error: { message: 'Cannot cancel this order' }
      });
    }

    // Update order status
    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { orderStatus: 'cancelled' },
      include: { product: true, seller: true }
    });

    // Restore product stock
    await prisma.product.update({
      where: { id: order.productId },
      data: { stock: { increment: order.quantity } }
    });

    res.json({
      status: 'success',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/buyer/orders/:id/review
 * Add a review to an order
 */
router.post('/orders/:id/review', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: { message: 'Rating must be between 1 and 5' }
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });

    if (!order) {
      return res.status(404).json({
        error: { message: 'Order not found' }
      });
    }

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        orderId: parseInt(id),
        userId: req.user.id,
        productId: order.productId
      }
    });

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId: order.productId }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: order.productId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;

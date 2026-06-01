const express = require('express');
const router = express.Router();
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

/**
 * GET /api/seller/products
 * Get all products for the authenticated seller
 */
router.get('/products', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      include: {
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/seller/products
 * Create a new product
 */
router.post('/products', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { title, description, price, stock, category, imageUrl } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        error: { message: 'Title and price are required' }
      });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category: category || 'general',
        imageUrl,
        sellerId: req.user.id
      }
    });

    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * PUT /api/seller/products/:id
 * Update a product
 */
router.put('/products/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category, imageUrl } = req.body;

    // Check if product belongs to seller
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product || product.sellerId !== req.user.id) {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock && { stock: parseInt(stock) }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl })
      }
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
 * DELETE /api/seller/products/:id
 * Delete a product
 */
router.delete('/products/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product belongs to seller
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product || product.sellerId !== req.user.id) {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      status: 'success',
      message: 'Product deleted'
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * GET /api/seller/orders
 * Get all orders for the seller's products
 */
router.get('/orders', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { sellerId: req.user.id },
      include: {
        product: true,
        buyer: { select: { id: true, fullName: true, email: true } },
        seller: { select: { id: true, fullName: true } }
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
 * PUT /api/seller/orders/:id
 * Update order status
 */
router.put('/orders/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Check if order belongs to seller
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order || order.sellerId !== req.user.id) {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { orderStatus },
      include: { product: true, buyer: true }
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
 * GET /api/seller/earnings
 * Get seller earnings and stats
 */
router.get('/earnings', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        sellerId: req.user.id,
        paymentStatus: 'paid'
      }
    });

    const totalEarnings = orders.reduce((sum, order) => sum + (order.sellerAmount || 0), 0);

    res.json({
      status: 'success',
      data: {
        totalEarnings,
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? totalEarnings / orders.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;

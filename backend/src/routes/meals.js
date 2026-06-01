const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

/**
 * GET /api/meals
 * Get all food menu items with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    const where = {
      ...(category && category !== 'all' && { category })
    };

    const meals = await prisma.foodMenu.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: meals
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * POST /api/meals
 * Create a new food menu item (admin only)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin (for now allow sellers to add meals)
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    const { foodName, description, price, category, imageUrl, available } = req.body;

    if (!foodName || !price) {
      return res.status(400).json({
        error: { message: 'Food name and price are required' }
      });
    }

    const meal = await prisma.foodMenu.create({
      data: {
        foodName,
        description,
        price: parseFloat(price),
        category: category || 'lunch',
        imageUrl,
        available: available !== false
      }
    });

    res.status(201).json({
      status: 'success',
      data: meal
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * PUT /api/meals/:id
 * Update food menu item
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    const { id } = req.params;
    const { foodName, description, price, category, imageUrl, available } = req.body;

    const meal = await prisma.foodMenu.update({
      where: { id: parseInt(id) },
      data: {
        ...(foodName && { foodName }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
        ...(available !== undefined && { available })
      }
    });

    res.json({
      status: 'success',
      data: meal
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

/**
 * DELETE /api/meals/:id
 * Delete food menu item
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({
        error: { message: 'Unauthorized' }
      });
    }

    const { id } = req.params;

    await prisma.foodMenu.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      status: 'success',
      message: 'Meal deleted'
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

/**
 * GET /api/users/:id
 * Get user profile by ID (seller profile)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        fullName: true,
        profileImage: true,
        storeName: true,
        storeDescription: true,
        sellerRating: true,
        sellerReviews: true,
        isSellerApproved: true,
        createdAt: true,
        productsForSale: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            rating: true
          },
          take: 6
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, bio, phone, address, profileImage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(profileImage && { profileImage })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        profileImage: true,
        bio: true,
        phone: true,
        address: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

/**
 * PUT /api/users/seller-profile
 * Update seller profile (store info)
 */
router.put('/seller-profile', authMiddleware, async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only sellers can update seller profile'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(storeName && { storeName }),
        ...(storeDescription && { storeDescription })
      },
      select: {
        id: true,
        fullName: true,
        storeName: true,
        storeDescription: true,
        isSellerApproved: true,
        sellerRating: true,
        earnings: true
      }
    });

    res.json({
      message: 'Seller profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({
      error: 'Failed to update seller profile',
      message: error.message
    });
  }
});

module.exports = router;

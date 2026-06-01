const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'));
    }
  }
});

/**
 * GET /api/products
 * Get all products with pagination and filtering
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const where = {
      ...(category && category !== 'all' && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        category: true,
        rating: true,
        reviewCount: true,
        seller: {
          select: {
            id: true,
            fullName: true,
            storeName: true,
            sellerRating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get products',
      message: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * Get single product details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            storeName: true,
            profileImage: true,
            sellerRating: true,
            sellerReviews: true,
            isSellerApproved: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: { id: true, fullName: true, profileImage: true }
            },
            createdAt: true
          },
          take: 5
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get product',
      message: error.message
    });
  }
});

/**
 * POST /api/products
 * Create new product (seller only) with image upload
 */
router.post('/', authMiddleware, sellerMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    // Validation
    if (!title || !price) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Delete uploaded file if validation fails
      }
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Title and price are required'
      });
    }

    // Generate image URL if file was uploaded
    let imageUrl = null;
    if (req.file) {
      const host = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      imageUrl = `${host}/uploads/${req.file.filename}`;
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        imageUrl: imageUrl || '',
        category: category || 'General',
        sellerId: req.user.id
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            storeName: true,
            sellerRating: true
          }
        }
      }
    });

    console.log(`✅ Product created successfully: ${product.id} - ${product.title}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    // Clean up uploaded file if database save failed
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product (seller only)
 */
router.put('/:id', authMiddleware, sellerMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category } = req.body;

    // Check ownership
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    if (product.sellerId !== req.user.id) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You can only edit your own products'
      });
    }

    // Handle image update
    let imageUrl = product.imageUrl;
    if (req.file) {
      // Delete old image if it exists
      if (product.imageUrl) {
        const oldFilename = product.imageUrl.split('/').pop();
        const oldPath = path.join(uploadsDir, oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      const host = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      imageUrl = `${host}/uploads/${req.file.filename}`;
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category })
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            storeName: true,
            sellerRating: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (seller only)
 */
router.delete('/:id', authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You can only delete your own products'
      });
    }

    // Delete image file
    if (product.imageUrl) {
      const filename = product.imageUrl.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

module.exports = router;

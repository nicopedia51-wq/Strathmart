const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Generate JWT Token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

/**
 * Hash password
 * @param {String} password - Plain text password
 * @returns {Promise<String>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password
 * @param {String} plainPassword - Plain text password
 * @param {String} hashedPassword - Hashed password
 * @returns {Promise<Boolean>} Password match result
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Calculate admin fee (4.5%)
 * @param {Number} amount - Original amount
 * @returns {Number} Admin fee
 */
const calculateAdminFee = (amount) => {
  const percentage = parseFloat(process.env.ADMIN_FEE_PERCENTAGE || 4.5);
  return Math.round((amount * percentage / 100) * 100) / 100;
};

/**
 * Calculate seller amount (total - admin fee)
 * @param {Number} amount - Total amount
 * @returns {Number} Amount for seller
 */
const calculateSellerAmount = (amount) => {
  const adminFee = calculateAdminFee(amount);
  return Math.round((amount - adminFee) * 100) / 100;
};

/**
 * Generate unique order number
 * @returns {String} Order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  calculateAdminFee,
  calculateSellerAmount,
  generateOrderNumber
};

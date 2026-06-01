const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token is expired or invalid'
    });
  }
};

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only admins can access this resource'
    });
  }
  next();
};

// Middleware to check seller or admin role
const sellerMiddleware = (req, res, next) => {
  if (req.user?.role !== 'seller' && req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Only sellers can access this resource'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  sellerMiddleware
};

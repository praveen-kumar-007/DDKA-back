const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];

    // Header present but token missing (e.g. "Bearer " only)
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from token
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No Authorization header or not Bearer format
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };

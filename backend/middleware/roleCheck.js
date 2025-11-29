const logger = require('../utils/logger');

/**
 * Middleware to verify user has admin role
 * Must be used after authenticateToken middleware
 */
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      logger.security('ADMIN_CHECK_FAILED', 'No user found in request', {
        ip: req.ip,
        path: req.path
      });
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== 'admin') {
      logger.security('ADMIN_ACCESS_DENIED', `User ${req.user.email} attempted admin action`, {
        userId: req.user.userId,
        ip: req.ip,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    logger.info('ADMIN_ACCESS_GRANTED', `Admin ${req.user.email} accessed protected route`, {
      userId: req.user.userId,
      ip: req.ip,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('ROLE_CHECK_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    return res.status(500).json({
      success: false,
      message: 'Error verifying permissions.'
    });
  }
};

/**
 * Middleware to verify user has customer or admin role
 */
const requireCustomer = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying permissions.'
    });
  }
};

module.exports = {
  requireAdmin,
  requireCustomer
};

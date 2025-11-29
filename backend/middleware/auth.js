const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 * Checks both Authorization header and httpOnly cookie
 */
const authenticateToken = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first (Bearer token)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // If no header token, check httpOnly cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // No token found
    if (!token) {
      logger.security('AUTH_FAILED', 'No token provided', {
        ip: req.ip,
        path: req.path
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    logger.info('AUTH_SUCCESS', `User authenticated: ${decoded.email}`, {
      userId: decoded.userId,
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.security('AUTH_FAILED', `Invalid token: ${error.message}`, {
      ip: req.ip,
      path: req.path
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for routes that work for both authenticated and guest users
 */
const optionalAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};

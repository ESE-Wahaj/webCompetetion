const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Must be last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('UNHANDLED_ERROR', err.message, {
    userId: req.user?.userId,
    ip: req.ip,
    path: req.path,
    stack: err.stack
  });

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: isDevelopment ? err.message : undefined
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
      error: isDevelopment ? err.message : undefined
    });
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      success: false,
      message: 'Invalid reference to related resource'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: isDevelopment ? err.stack : undefined
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

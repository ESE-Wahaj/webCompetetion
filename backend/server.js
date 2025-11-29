/**
 * ShoppingMart Backend Server
 * Secure e-commerce API with DLL-protected product operations
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==========================
// MIDDLEWARE CONFIGURATION
// ==========================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
app.use(generalLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP_REQUEST', `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
      userId: req.user?.userId,
      ip: req.ip,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
});

// ==========================
// ROUTES
// ==========================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ShoppingMart API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ShoppingMart API',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// ==========================
// ERROR HANDLING
// ==========================

// 404 Not Found handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ==========================
// DATABASE CONNECTION TEST
// ==========================

const pool = require('./config/database');

async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('DATABASE_CONNECTED', 'Database connection test successful', {
      timestamp: result.rows[0].now
    });
    return true;
  } catch (error) {
    logger.error('DATABASE_CONNECTION_FAILED', error.message, {
      stack: error.stack
    });
    return false;
  }
}

// ==========================
// START SERVER
// ==========================

async function startServer() {
  // Test database connection
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Server not started.');
    process.exit(1);
  }

  // Start listening
  app.listen(PORT, () => {
    console.log('================================================');
    console.log('🚀 ShoppingMart Backend Server');
    console.log('================================================');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server running on port: ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log('================================================');
    console.log('📋 Available Routes:');
    console.log('  POST   /api/auth/register');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/products');
    console.log('  GET    /api/categories');
    console.log('  GET    /api/cart (auth)');
    console.log('  POST   /api/orders/checkout (auth)');
    console.log('  POST   /api/admin/products (admin)');
    console.log('================================================');
    console.log('🔒 Security Features:');
    console.log('  ✓ Helmet security headers');
    console.log('  ✓ CORS protection');
    console.log('  ✓ Rate limiting');
    console.log('  ✓ JWT authentication');
    console.log('  ✓ DLL-protected admin operations');
    console.log('  ✓ Input validation');
    console.log('  ✓ XSS prevention');
    console.log('================================================');

    logger.info('SERVER_STARTED', `Server started on port ${PORT}`, {
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT_EXCEPTION', error.message, {
    stack: error.stack
  });
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED_REJECTION', String(reason), {
    promise: String(promise)
  });
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SERVER_SHUTDOWN', 'SIGTERM received, closing server gracefully');
  console.log('\n🛑 SIGTERM received, closing server gracefully...');

  pool.end(() => {
    logger.info('DATABASE_POOL_CLOSED', 'Database pool closed');
    console.log('✓ Database connections closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = app;

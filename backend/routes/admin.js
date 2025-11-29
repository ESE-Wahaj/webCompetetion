const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { validateProduct, validateProductId } = require('../middleware/validateInput');
const { adminLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');

/**
 * Admin Routes (Requires Admin Role)
 */

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);
router.use(adminLimiter);

// Product Management (via DLL)
// POST /api/admin/products - Create product
router.post('/products', validateProduct, adminController.createProduct);

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', validateProductId, adminController.updateProduct);

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', validateProductId, adminController.deleteProduct);

// User Management
// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', [
  body('role').isIn(['customer', 'admin']).withMessage('Role must be customer or admin')
], adminController.updateUserRole);

// Order Management
// GET /api/admin/orders - Get all orders
router.get('/orders', adminController.getAllOrders);

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
], adminController.updateOrderStatus);

// PUT /api/admin/orders/:id/tracking - Add tracking number
router.put('/orders/:id/tracking', [
  body('tracking_number').notEmpty().withMessage('Tracking number is required')
], adminController.addTrackingNumber);

// GET /api/admin/statistics - Get order statistics
router.get('/statistics', adminController.getOrderStatistics);

module.exports = router;

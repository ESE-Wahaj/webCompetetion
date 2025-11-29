const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { validateCheckout } = require('../middleware/validateInput');

/**
 * Order Routes (Requires Authentication)
 */

// All order routes require authentication
router.use(authenticateToken);

// POST /api/orders/checkout - Create order from cart
router.post('/checkout', validateCheckout, orderController.checkout);

// GET /api/orders - Get user's orders
router.get('/', orderController.getUserOrders);

// GET /api/orders/:id - Get single order details
router.get('/:id', orderController.getOrderById);

module.exports = router;

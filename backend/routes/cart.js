const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { validateAddToCart, validateUpdateCart } = require('../middleware/validateInput');

/**
 * Cart Routes (Requires Authentication)
 */

// All cart routes require authentication
router.use(authenticateToken);

// GET /api/cart - Get user's cart
router.get('/', cartController.getCart);

// GET /api/cart/count - Get cart item count
router.get('/count', cartController.getCartCount);

// POST /api/cart - Add item to cart
router.post('/', validateAddToCart, cartController.addToCart);

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', validateUpdateCart, cartController.updateCartItem);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', cartController.removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', cartController.clearCart);

module.exports = router;

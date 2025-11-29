const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProductId, validateSearch } = require('../middleware/validateInput');

/**
 * Product Routes (Public)
 */

// GET /api/products - Get all products with optional filters
router.get('/', validateSearch, productController.getAllProducts);

// GET /api/products/search - Search products
router.get('/search', validateSearch, productController.searchProducts);

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// GET /api/products/:id - Get single product
router.get('/:id', validateProductId, productController.getProductById);

module.exports = router;

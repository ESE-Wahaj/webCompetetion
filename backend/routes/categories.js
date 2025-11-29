const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * Category Routes (Public)
 */

// GET /api/categories - Get all categories
router.get('/', productController.getAllCategories);

module.exports = router;

const productModel = require('../models/productModel');
const logger = require('../utils/logger');

/**
 * Product Controller
 * Handles product browsing (non-admin operations)
 */

/**
 * Get all products with optional filters
 */
async function getAllProducts(req, res) {
  try {
    const filters = {
      category_id: req.query.category_id,
      search: req.query.search,
      minPrice: req.query.min_price,
      maxPrice: req.query.max_price
    };

    const products = await productModel.getAllProducts(filters);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    logger.error('GET_PRODUCTS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
}

/**
 * Get single product by ID
 */
async function getProductById(req, res) {
  try {
    const productId = req.params.id;

    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    logger.error('GET_PRODUCT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip,
      productId: req.params.id
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
}

/**
 * Get all categories
 */
async function getAllCategories(req, res) {
  try {
    const categories = await productModel.getAllCategories();

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    logger.error('GET_CATEGORIES_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
}

/**
 * Search products
 */
async function searchProducts(req, res) {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const products = await productModel.searchProducts(searchTerm);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    logger.error('SEARCH_PRODUCTS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
}

/**
 * Get products by category
 */
async function getProductsByCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;

    const products = await productModel.getProductsByCategory(categoryId);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    logger.error('GET_PRODUCTS_BY_CATEGORY_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip,
      categoryId: req.params.categoryId
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories,
  searchProducts,
  getProductsByCategory
};

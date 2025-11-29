const pool = require('../config/database');

/**
 * Product Model
 * Database operations for products (non-DLL operations)
 */

/**
 * Get all active products with optional filters
 * @param {Object} filters - {category_id, search, minPrice, maxPrice}
 * @returns {Array} Products
 */
async function getAllProducts(filters = {}) {
  const conditions = ['p.is_active = true'];
  const values = [];
  let paramCount = 1;

  if (filters.category_id) {
    conditions.push(`p.category_id = $${paramCount}`);
    values.push(filters.category_id);
    paramCount++;
  }

  if (filters.search) {
    conditions.push(`p.name ILIKE $${paramCount}`);
    values.push(`%${filters.search}%`);
    paramCount++;
  }

  if (filters.minPrice !== undefined) {
    conditions.push(`p.price >= $${paramCount}`);
    values.push(filters.minPrice);
    paramCount++;
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(`p.price <= $${paramCount}`);
    values.push(filters.maxPrice);
    paramCount++;
  }

  const query = `
    SELECT p.*, c.name as category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY p.created_at DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Get single product by ID
 * @param {number} productId
 * @returns {Object} Product
 */
async function getProductById(productId) {
  const query = `
    SELECT p.*, c.name as category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;

  const result = await pool.query(query, [productId]);
  return result.rows[0] || null;
}

/**
 * Check if product has sufficient stock
 * @param {number} productId
 * @param {number} quantity
 * @returns {Object} {available: boolean, currentStock: number}
 */
async function checkStock(productId, quantity) {
  const query = 'SELECT stock FROM Products WHERE id = $1 AND is_active = true';
  const result = await pool.query(query, [productId]);

  if (result.rows.length === 0) {
    return { available: false, currentStock: 0 };
  }

  const currentStock = result.rows[0].stock;
  return {
    available: currentStock >= quantity,
    currentStock
  };
}

/**
 * Reduce product stock (for order placement)
 * @param {number} productId
 * @param {number} quantity
 * @returns {Object} Updated product
 */
async function reduceStock(productId, quantity) {
  const query = `
    UPDATE Products
    SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND stock >= $1
    RETURNING *
  `;

  const result = await pool.query(query, [quantity, productId]);

  if (result.rows.length === 0) {
    throw new Error('Insufficient stock or product not found');
  }

  return result.rows[0];
}

/**
 * Get all categories
 * @returns {Array} Categories
 */
async function getAllCategories() {
  const query = `
    SELECT * FROM Categories
    WHERE is_active = true
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get products by category
 * @param {number} categoryId
 * @returns {Array} Products
 */
async function getProductsByCategory(categoryId) {
  const query = `
    SELECT p.*, c.name as category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    WHERE p.category_id = $1 AND p.is_active = true
    ORDER BY p.name ASC
  `;

  const result = await pool.query(query, [categoryId]);
  return result.rows;
}

/**
 * Search products by name
 * @param {string} searchTerm
 * @returns {Array} Products
 */
async function searchProducts(searchTerm) {
  const query = `
    SELECT p.*, c.name as category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    WHERE p.name ILIKE $1 AND p.is_active = true
    ORDER BY p.name ASC
  `;

  const result = await pool.query(query, [`%${searchTerm}%`]);
  return result.rows;
}

module.exports = {
  getAllProducts,
  getProductById,
  checkStock,
  reduceStock,
  getAllCategories,
  getProductsByCategory,
  searchProducts
};

const { Pool } = require('pg');
const { authenticateDLL } = require('./dllAuth');
const { validateProductData, validateProductId, validateFilters } = require('./dllValidator');
require('dotenv').config({ path: '../backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shoppingmart',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

/**
 * Log DLL function calls
 */
function logDLLCall(functionName, userId, action) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [DLL] [USER:${userId}] [${functionName}] ${action}`);
}

/**
 * Insert a new product into the database
 * @param {Object} productData - {name, description, price, stock, category_id, sku, image_url}
 * @param {String} dllPassword - DLL authentication password
 * @param {String} userToken - JWT token of requesting user
 * @returns {Object} {success: boolean, productId: number, message: string}
 */
async function InsertProduct(productData, dllPassword, userToken) {
  const client = await pool.connect();

  try {
    // Double authentication
    const auth = authenticateDLL(dllPassword, userToken, true); // Requires admin
    if (!auth.success) {
      logDLLCall('InsertProduct', 'UNAUTHORIZED', 'Authentication failed');
      return { success: false, message: auth.message };
    }

    // Validate product data
    const validation = validateProductData(productData);
    if (!validation.valid) {
      return { success: false, message: 'Validation failed', errors: validation.errors };
    }

    // Insert product using parameterized query
    const query = `
      INSERT INTO Products (name, description, price, stock, sku, image_url, category_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING id
    `;

    const values = [
      productData.name,
      productData.description || null,
      productData.price,
      productData.stock,
      productData.sku || null,
      productData.image_url || null,
      productData.category_id || null
    ];

    const result = await client.query(query, values);
    const productId = result.rows[0].id;

    logDLLCall('InsertProduct', auth.user.userId, `Product created: ID ${productId}`);

    return {
      success: true,
      productId,
      message: 'Product created successfully'
    };
  } catch (error) {
    logDLLCall('InsertProduct', 'ERROR', error.message);

    // Handle unique constraint violations
    if (error.code === '23505') {
      return { success: false, message: 'Product with this SKU already exists' };
    }

    return { success: false, message: `Failed to create product: ${error.message}` };
  } finally {
    client.release();
  }
}

/**
 * Update existing product
 * @param {Number} productId - ID of product to update
 * @param {Object} updateData - Fields to update
 * @param {String} dllPassword
 * @param {String} userToken
 * @returns {Object} {success: boolean, message: string}
 */
async function UpdateProduct(productId, updateData, dllPassword, userToken) {
  const client = await pool.connect();

  try {
    // Double authentication
    const auth = authenticateDLL(dllPassword, userToken, true); // Requires admin
    if (!auth.success) {
      logDLLCall('UpdateProduct', 'UNAUTHORIZED', 'Authentication failed');
      return { success: false, message: auth.message };
    }

    // Validate product ID
    const idValidation = validateProductId(productId);
    if (!idValidation.valid) {
      return { success: false, message: idValidation.message };
    }

    // Validate update data
    if (Object.keys(updateData).length === 0) {
      return { success: false, message: 'No update data provided' };
    }

    // Build dynamic update query
    const allowedFields = ['name', 'description', 'price', 'stock', 'sku', 'image_url', 'category_id', 'is_active'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return { success: false, message: 'No valid fields to update' };
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add product ID to values
    values.push(productId);

    const query = `
      UPDATE Products
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id
    `;

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return { success: false, message: 'Product not found' };
    }

    logDLLCall('UpdateProduct', auth.user.userId, `Product updated: ID ${productId}`);

    return {
      success: true,
      message: 'Product updated successfully'
    };
  } catch (error) {
    logDLLCall('UpdateProduct', 'ERROR', error.message);
    return { success: false, message: `Failed to update product: ${error.message}` };
  } finally {
    client.release();
  }
}

/**
 * Soft delete product (set is_active = false)
 * @param {Number} productId
 * @param {String} dllPassword
 * @param {String} userToken
 * @returns {Object} {success: boolean, message: string}
 */
async function DeleteProduct(productId, dllPassword, userToken) {
  const client = await pool.connect();

  try {
    // Double authentication
    const auth = authenticateDLL(dllPassword, userToken, true); // Requires admin
    if (!auth.success) {
      logDLLCall('DeleteProduct', 'UNAUTHORIZED', 'Authentication failed');
      return { success: false, message: auth.message };
    }

    // Validate product ID
    const idValidation = validateProductId(productId);
    if (!idValidation.valid) {
      return { success: false, message: idValidation.message };
    }

    // Soft delete using parameterized query
    const query = `
      UPDATE Products
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;

    const result = await client.query(query, [productId]);

    if (result.rowCount === 0) {
      return { success: false, message: 'Product not found' };
    }

    logDLLCall('DeleteProduct', auth.user.userId, `Product deleted: ID ${productId}`);

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    logDLLCall('DeleteProduct', 'ERROR', error.message);
    return { success: false, message: `Failed to delete product: ${error.message}` };
  } finally {
    client.release();
  }
}

/**
 * Get single product by ID
 * @param {Number} productId
 * @param {String} dllPassword
 * @param {String} userToken
 * @returns {Object} {success: boolean, product: Object}
 */
async function GetProduct(productId, dllPassword, userToken) {
  const client = await pool.connect();

  try {
    // Double authentication (doesn't require admin for read)
    const auth = authenticateDLL(dllPassword, userToken, false);
    if (!auth.success) {
      logDLLCall('GetProduct', 'UNAUTHORIZED', 'Authentication failed');
      return { success: false, message: auth.message };
    }

    // Validate product ID
    const idValidation = validateProductId(productId);
    if (!idValidation.valid) {
      return { success: false, message: idValidation.message };
    }

    // Fetch product using parameterized query
    const query = `
      SELECT p.*, c.name as category_name
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;

    const result = await client.query(query, [productId]);

    if (result.rows.length === 0) {
      return { success: false, message: 'Product not found' };
    }

    logDLLCall('GetProduct', auth.user.userId, `Product fetched: ID ${productId}`);

    return {
      success: true,
      product: result.rows[0]
    };
  } catch (error) {
    logDLLCall('GetProduct', 'ERROR', error.message);
    return { success: false, message: `Failed to fetch product: ${error.message}` };
  } finally {
    client.release();
  }
}

/**
 * Get all active products with optional filters
 * @param {Object} filters - {category_id, search, minPrice, maxPrice}
 * @param {String} dllPassword
 * @param {String} userToken
 * @returns {Object} {success: boolean, products: Array}
 */
async function GetAllProducts(filters = {}, dllPassword, userToken) {
  const client = await pool.connect();

  try {
    // Double authentication
    const auth = authenticateDLL(dllPassword, userToken, false);
    if (!auth.success) {
      logDLLCall('GetAllProducts', 'UNAUTHORIZED', 'Authentication failed');
      return { success: false, message: auth.message };
    }

    // Validate filters
    const validation = validateFilters(filters);
    if (!validation.valid) {
      return { success: false, message: 'Invalid filters', errors: validation.errors };
    }

    // Build dynamic query
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

    const result = await client.query(query, values);

    logDLLCall('GetAllProducts', auth.user.userId, `Fetched ${result.rows.length} products`);

    return {
      success: true,
      products: result.rows,
      count: result.rows.length
    };
  } catch (error) {
    logDLLCall('GetAllProducts', 'ERROR', error.message);
    return { success: false, message: `Failed to fetch products: ${error.message}` };
  } finally {
    client.release();
  }
}

module.exports = {
  InsertProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct,
  GetAllProducts
};

const pool = require('../config/database');

/**
 * Cart Model
 * Database operations for shopping cart
 */

/**
 * Get user's cart items
 * @param {number} userId
 * @returns {Array} Cart items with product details
 */
async function getCartByUserId(userId) {
  const query = `
    SELECT
      c.id,
      c.product_id,
      c.quantity,
      p.name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      (p.price * c.quantity) as item_total
    FROM Cart c
    JOIN Products p ON c.product_id = p.id
    WHERE c.user_id = $1 AND p.is_active = true
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

/**
 * Add item to cart
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 * @returns {Object} Cart item
 */
async function addToCart(userId, productId, quantity) {
  // Check if item already exists in cart
  const existingItem = await pool.query(
    'SELECT * FROM Cart WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (existingItem.rows.length > 0) {
    // Update quantity if item exists
    const query = `
      UPDATE Cart
      SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, userId, productId]);
    return result.rows[0];
  } else {
    // Insert new item
    const query = `
      INSERT INTO Cart (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, productId, quantity]);
    return result.rows[0];
  }
}

/**
 * Update cart item quantity
 * @param {number} cartItemId
 * @param {number} userId
 * @param {number} quantity
 * @returns {Object} Updated cart item
 */
async function updateCartItemQuantity(cartItemId, userId, quantity) {
  const query = `
    UPDATE Cart
    SET quantity = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;

  const result = await pool.query(query, [quantity, cartItemId, userId]);

  if (result.rows.length === 0) {
    throw new Error('Cart item not found or unauthorized');
  }

  return result.rows[0];
}

/**
 * Remove item from cart
 * @param {number} cartItemId
 * @param {number} userId
 * @returns {Object} Result
 */
async function removeFromCart(cartItemId, userId) {
  const query = `
    DELETE FROM Cart
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [cartItemId, userId]);

  if (result.rows.length === 0) {
    throw new Error('Cart item not found or unauthorized');
  }

  return result.rows[0];
}

/**
 * Clear user's cart
 * @param {number} userId
 * @returns {Object} Result
 */
async function clearCart(userId) {
  const query = 'DELETE FROM Cart WHERE user_id = $1';
  const result = await pool.query(query, [userId]);

  return { deletedCount: result.rowCount };
}

/**
 * Get cart item count
 * @param {number} userId
 * @returns {number} Count of items
 */
async function getCartItemCount(userId) {
  const query = `
    SELECT COALESCE(SUM(quantity), 0) as count
    FROM Cart
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count, 10);
}

/**
 * Get cart total
 * @param {number} userId
 * @returns {Object} {subtotal, itemCount}
 */
async function getCartTotal(userId) {
  const query = `
    SELECT
      COALESCE(SUM(p.price * c.quantity), 0) as subtotal,
      COALESCE(SUM(c.quantity), 0) as item_count
    FROM Cart c
    JOIN Products p ON c.product_id = p.id
    WHERE c.user_id = $1 AND p.is_active = true
  `;

  const result = await pool.query(query, [userId]);
  return {
    subtotal: parseFloat(result.rows[0].subtotal),
    itemCount: parseInt(result.rows[0].item_count, 10)
  };
}

/**
 * Check if cart item belongs to user
 * @param {number} cartItemId
 * @param {number} userId
 * @returns {boolean}
 */
async function isCartItemOwnedByUser(cartItemId, userId) {
  const query = 'SELECT id FROM Cart WHERE id = $1 AND user_id = $2';
  const result = await pool.query(query, [cartItemId, userId]);

  return result.rows.length > 0;
}

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartItemCount,
  getCartTotal,
  isCartItemOwnedByUser
};

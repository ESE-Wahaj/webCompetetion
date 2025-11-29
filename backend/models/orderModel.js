const pool = require('../config/database');

/**
 * Order Model
 * Database operations for orders
 */

/**
 * Create a new order
 * @param {number} userId
 * @param {number} orderTotal
 * @param {string} shippingAddress
 * @param {string} paymentMethod
 * @returns {Object} Created order
 */
async function createOrder(userId, orderTotal, shippingAddress, paymentMethod) {
  const query = `
    INSERT INTO Orders (user_id, order_total, shipping_address, payment_method, status)
    VALUES ($1, $2, $3, $4, 'pending')
    RETURNING *
  `;

  const result = await pool.query(query, [userId, orderTotal, shippingAddress, paymentMethod]);
  return result.rows[0];
}

/**
 * Add items to order
 * @param {number} orderId
 * @param {Array} items - [{product_id, quantity, price_at_purchase}, ...]
 * @returns {Array} Created order items
 */
async function addOrderItems(orderId, items) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderItems = [];

    for (const item of items) {
      const query = `
        INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const result = await client.query(query, [
        orderId,
        item.product_id,
        item.quantity,
        item.price_at_purchase
      ]);

      orderItems.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return orderItems;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get user's orders
 * @param {number} userId
 * @returns {Array} Orders
 */
async function getOrdersByUserId(userId) {
  const query = `
    SELECT
      o.*,
      COUNT(oi.id) as item_count
    FROM Orders o
    LEFT JOIN OrderItems oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}

/**
 * Get single order by ID
 * @param {number} orderId
 * @param {number} userId - Optional, for authorization check
 * @returns {Object} Order with items
 */
async function getOrderById(orderId, userId = null) {
  let query = `
    SELECT
      o.*,
      u.email as user_email,
      u.username as user_name
    FROM Orders o
    LEFT JOIN Users u ON o.user_id = u.id
    WHERE o.id = $1
  `;

  const values = [orderId];

  if (userId !== null) {
    query += ' AND o.user_id = $2';
    values.push(userId);
  }

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  const order = result.rows[0];

  // Get order items
  const itemsQuery = `
    SELECT
      oi.*,
      p.name as product_name,
      p.image_url as product_image
    FROM OrderItems oi
    LEFT JOIN Products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `;

  const itemsResult = await pool.query(itemsQuery, [orderId]);
  order.items = itemsResult.rows;

  return order;
}

/**
 * Update order status
 * @param {number} orderId
 * @param {string} status - 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
 * @returns {Object} Updated order
 */
async function updateOrderStatus(orderId, status) {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid order status');
  }

  const query = `
    UPDATE Orders
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [status, orderId]);

  if (result.rows.length === 0) {
    throw new Error('Order not found');
  }

  return result.rows[0];
}

/**
 * Add tracking number to order
 * @param {number} orderId
 * @param {string} trackingNumber
 * @returns {Object} Updated order
 */
async function addTrackingNumber(orderId, trackingNumber) {
  const query = `
    UPDATE Orders
    SET tracking_number = $1, status = 'shipped', updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [trackingNumber, orderId]);

  if (result.rows.length === 0) {
    throw new Error('Order not found');
  }

  return result.rows[0];
}

/**
 * Get all orders (admin only)
 * @param {Object} filters - {status, userId, startDate, endDate}
 * @returns {Array} Orders
 */
async function getAllOrders(filters = {}) {
  const conditions = [];
  const values = [];
  let paramCount = 1;

  if (filters.status) {
    conditions.push(`o.status = $${paramCount}`);
    values.push(filters.status);
    paramCount++;
  }

  if (filters.userId) {
    conditions.push(`o.user_id = $${paramCount}`);
    values.push(filters.userId);
    paramCount++;
  }

  if (filters.startDate) {
    conditions.push(`o.created_at >= $${paramCount}`);
    values.push(filters.startDate);
    paramCount++;
  }

  if (filters.endDate) {
    conditions.push(`o.created_at <= $${paramCount}`);
    values.push(filters.endDate);
    paramCount++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      o.*,
      u.email as user_email,
      u.username as user_name,
      COUNT(oi.id) as item_count
    FROM Orders o
    LEFT JOIN Users u ON o.user_id = u.id
    LEFT JOIN OrderItems oi ON o.id = oi.order_id
    ${whereClause}
    GROUP BY o.id, u.email, u.username
    ORDER BY o.created_at DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Get order statistics (admin only)
 * @returns {Object} Statistics
 */
async function getOrderStatistics() {
  const query = `
    SELECT
      COUNT(*) as total_orders,
      COALESCE(SUM(order_total), 0) as total_revenue,
      COALESCE(AVG(order_total), 0) as average_order_value,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
      COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
      COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
    FROM Orders
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

module.exports = {
  createOrder,
  addOrderItems,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  addTrackingNumber,
  getAllOrders,
  getOrderStatistics
};

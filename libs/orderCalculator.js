const { Pool } = require('pg');
require('dotenv').config({ path: '../backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shoppingmart',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

/**
 * Calculate order totals with tax and shipping
 * @param {Array} cartItems - [{productId, quantity}, ...]
 * @returns {Object} {success: boolean, subtotal, tax, shipping, total, items}
 */
async function calculateOrderBreakdown(cartItems) {
  const client = await pool.connect();

  try {
    const itemDetails = [];
    let subtotal = 0;

    // Fetch current prices for each item
    for (const item of cartItems) {
      const result = await client.query(
        'SELECT id, name, price, stock FROM Products WHERE id = $1 AND is_active = true',
        [item.productId]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: `Product with ID ${item.productId} not found or inactive`
        };
      }

      const product = result.rows[0];

      // Check stock availability
      if (product.stock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        };
      }

      const itemTotal = parseFloat(product.price) * parseInt(item.quantity);
      subtotal += itemTotal;

      itemDetails.push({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: parseInt(item.quantity),
        itemTotal: itemTotal.toFixed(2)
      });
    }

    // Calculate tax (10%)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;

    // Calculate shipping (free over $100, otherwise $10)
    const shipping = subtotal >= 100 ? 0 : 10;

    // Calculate total
    const total = subtotal + tax + shipping;

    return {
      success: true,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      taxRate: `${(taxRate * 100).toFixed(0)}%`,
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      items: itemDetails,
      message: 'Order calculation successful'
    };
  } catch (error) {
    return {
      success: false,
      message: `Order calculation failed: ${error.message}`
    };
  } finally {
    client.release();
  }
}

module.exports = {
  calculateOrderBreakdown
};

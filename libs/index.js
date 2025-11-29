/**
 * ShoppingMart DLL Module
 * Password-protected library for secure product CRUD operations
 *
 * Security Features:
 * - Double authentication (DLL password + JWT token)
 * - Parameterized queries (SQL injection prevention)
 * - Input validation
 * - Audit logging
 * - Role-based access control
 */

const {
  InsertProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct,
  GetAllProducts
} = require('./productDLL');

const { calculateOrderBreakdown } = require('./orderCalculator');
const { authenticateDLL } = require('./dllAuth');
const { validateProductData, validateCartItems } = require('./dllValidator');

/**
 * Calculate order totals (wrapper with authentication)
 * @param {Array} cartItems - [{productId, quantity}, ...]
 * @param {String} dllPassword
 * @param {String} userToken
 * @returns {Object} {success: boolean, subtotal, tax, shipping, total}
 */
async function CalculateOrderTotal(cartItems, dllPassword, userToken) {
  try {
    // Authenticate
    const auth = authenticateDLL(dllPassword, userToken, false);
    if (!auth.success) {
      return { success: false, message: auth.message };
    }

    // Validate cart items
    const validation = validateCartItems(cartItems);
    if (!validation.valid) {
      return { success: false, message: 'Invalid cart items', errors: validation.errors };
    }

    // Calculate order
    const result = await calculateOrderBreakdown(cartItems);
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Order calculation failed: ${error.message}`
    };
  }
}

module.exports = {
  // Product CRUD Operations (Admin only)
  InsertProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct,
  GetAllProducts,

  // Order Calculation (Authenticated users)
  CalculateOrderTotal,

  // Utility functions (for testing)
  authenticateDLL,
  validateProductData,
  validateCartItems
};

/**
 * DLL Input Validation
 * Validates all inputs before database operations
 */

/**
 * Validate product data for insert/update
 * @param {Object} productData - Product data to validate
 * @returns {Object} {valid: boolean, errors: Array}
 */
function validateProductData(productData) {
  const errors = [];

  // Validate name
  if (!productData.name || typeof productData.name !== 'string') {
    errors.push('Product name is required and must be a string');
  } else if (productData.name.length > 255) {
    errors.push('Product name is too long (max 255 characters)');
  }

  // Validate price
  const price = parseFloat(productData.price);
  if (isNaN(price) || price < 0 || price > 999999.99) {
    errors.push('Price must be between 0 and 999999.99');
  }

  // Validate stock
  const stock = parseInt(productData.stock, 10);
  if (!Number.isInteger(stock) || stock < 0) {
    errors.push('Stock must be a non-negative integer');
  }

  // Validate SKU (optional)
  if (productData.sku && productData.sku.length > 50) {
    errors.push('SKU is too long (max 50 characters)');
  }

  // Validate category_id (optional)
  if (productData.category_id) {
    const categoryId = parseInt(productData.category_id, 10);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      errors.push('Category ID must be a positive integer');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate product ID
 * @param {number} productId - Product ID to validate
 * @returns {Object} {valid: boolean, message: string}
 */
function validateProductId(productId) {
  const id = parseInt(productId, 10);

  if (!Number.isInteger(id) || id < 1) {
    return {
      valid: false,
      message: 'Product ID must be a positive integer'
    };
  }

  return {
    valid: true,
    message: 'Valid product ID'
  };
}

/**
 * Validate cart items array for order calculation
 * @param {Array} cartItems - Array of {productId, quantity}
 * @returns {Object} {valid: boolean, errors: Array}
 */
function validateCartItems(cartItems) {
  const errors = [];

  if (!Array.isArray(cartItems)) {
    errors.push('Cart items must be an array');
    return { valid: false, errors };
  }

  if (cartItems.length === 0) {
    errors.push('Cart is empty');
    return { valid: false, errors };
  }

  cartItems.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Item ${index + 1}: Product ID is required`);
    } else {
      const productId = parseInt(item.productId, 10);
      if (!Number.isInteger(productId) || productId < 1) {
        errors.push(`Item ${index + 1}: Product ID must be a positive integer`);
      }
    }

    if (!item.quantity) {
      errors.push(`Item ${index + 1}: Quantity is required`);
    } else {
      const quantity = parseInt(item.quantity, 10);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
        errors.push(`Item ${index + 1}: Quantity must be between 1 and 10000`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize string to prevent SQL injection
 * NOTE: This is a safety measure - parameterized queries are the primary defense
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // Remove dangerous characters
  return str.replace(/[;'"\\]/g, '');
}

/**
 * Validate filter object for GetAllProducts
 * @param {Object} filters - Filter object
 * @returns {Object} {valid: boolean, errors: Array}
 */
function validateFilters(filters) {
  const errors = [];

  if (filters.category_id) {
    const categoryId = parseInt(filters.category_id, 10);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      errors.push('Category ID must be a positive integer');
    }
  }

  if (filters.minPrice !== undefined) {
    const minPrice = parseFloat(filters.minPrice);
    if (isNaN(minPrice) || minPrice < 0) {
      errors.push('Minimum price must be non-negative');
    }
  }

  if (filters.maxPrice !== undefined) {
    const maxPrice = parseFloat(filters.maxPrice);
    if (isNaN(maxPrice) || maxPrice < 0) {
      errors.push('Maximum price must be non-negative');
    }
  }

  if (filters.search && typeof filters.search !== 'string') {
    errors.push('Search query must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateProductData,
  validateProductId,
  validateCartItems,
  sanitizeString,
  validateFilters
};

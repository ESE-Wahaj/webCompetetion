const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email is too long'),

  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be 8-100 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),

  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name is too long')
    .escape(),

  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name is too long')
    .escape(),

  checkValidation
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  checkValidation
];

/**
 * Validation rules for product creation/update
 */
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 255 })
    .withMessage('Product name is too long')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description is too long')
    .escape(),

  body('price')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be between 0 and 999999.99'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('SKU is too long')
    .escape(),

  body('image_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),

  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),

  checkValidation
];

/**
 * Validation rules for add to cart
 */
const validateAddToCart = [
  body('product_id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  checkValidation
];

/**
 * Validation rules for update cart quantity
 */
const validateUpdateCart = [
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  checkValidation
];

/**
 * Validation rules for checkout
 */
const validateCheckout = [
  body('shipping_address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required')
    .isLength({ max: 500 })
    .withMessage('Shipping address is too long')
    .escape(),

  body('payment_method')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['credit_card', 'paypal'])
    .withMessage('Invalid payment method'),

  body('card_number')
    .if(body('payment_method').equals('credit_card'))
    .notEmpty()
    .withMessage('Card number is required')
    .matches(/^\d{13,19}$/)
    .withMessage('Card number must be 13-19 digits'),

  body('card_expiry')
    .if(body('payment_method').equals('credit_card'))
    .notEmpty()
    .withMessage('Card expiry is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage('Card expiry must be in MM/YY format'),

  body('card_cvv')
    .if(body('payment_method').equals('credit_card'))
    .notEmpty()
    .withMessage('CVV is required')
    .matches(/^\d{3,4}$/)
    .withMessage('CVV must be 3-4 digits'),

  body('card_name')
    .if(body('payment_method').equals('credit_card'))
    .trim()
    .notEmpty()
    .withMessage('Cardholder name is required')
    .escape(),

  checkValidation
];

/**
 * Validation rules for product ID param
 */
const validateProductId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),

  checkValidation
];

/**
 * Validation rules for search query
 */
const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query is too long')
    .escape(),

  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),

  query('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be non-negative'),

  query('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be non-negative'),

  checkValidation
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  validateAddToCart,
  validateUpdateCart,
  validateCheckout,
  validateProductId,
  validateSearch
};

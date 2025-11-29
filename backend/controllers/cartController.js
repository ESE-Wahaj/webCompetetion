const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const logger = require('../utils/logger');

/**
 * Cart Controller
 * Handles shopping cart operations
 */

/**
 * Get user's cart
 */
async function getCart(req, res) {
  try {
    const userId = req.user.userId;

    const cartItems = await cartModel.getCartByUserId(userId);
    const cartTotal = await cartModel.getCartTotal(userId);

    res.json({
      success: true,
      cart: {
        items: cartItems,
        subtotal: cartTotal.subtotal,
        itemCount: cartTotal.itemCount
      }
    });
  } catch (error) {
    logger.error('GET_CART_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
}

/**
 * Add item to cart
 */
async function addToCart(req, res) {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    // Check if product exists and is active
    const product = await productModel.getProductById(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock availability
    const stockCheck = await productModel.checkStock(product_id, quantity);
    if (!stockCheck.available) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${stockCheck.currentStock} available`
      });
    }

    // Add to cart
    const cartItem = await cartModel.addToCart(userId, product_id, quantity);

    logger.info('ITEM_ADDED_TO_CART', `Product ${product_id} added to cart`, {
      userId,
      productId: product_id,
      quantity,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    logger.error('ADD_TO_CART_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
}

/**
 * Update cart item quantity
 */
async function updateCartItem(req, res) {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.itemId;
    const { quantity } = req.body;

    // Verify cart item belongs to user
    const isOwned = await cartModel.isCartItemOwnedByUser(cartItemId, userId);
    if (!isOwned) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this cart item'
      });
    }

    // Update quantity
    const updatedItem = await cartModel.updateCartItemQuantity(cartItemId, userId, quantity);

    logger.info('CART_ITEM_UPDATED', `Cart item ${cartItemId} updated`, {
      userId,
      cartItemId,
      quantity,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Cart item updated',
      cartItem: updatedItem
    });
  } catch (error) {
    logger.error('UPDATE_CART_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    });
  }
}

/**
 * Remove item from cart
 */
async function removeFromCart(req, res) {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.itemId;

    // Verify cart item belongs to user
    const isOwned = await cartModel.isCartItemOwnedByUser(cartItemId, userId);
    if (!isOwned) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to remove this cart item'
      });
    }

    // Remove item
    await cartModel.removeFromCart(cartItemId, userId);

    logger.info('CART_ITEM_REMOVED', `Cart item ${cartItemId} removed`, {
      userId,
      cartItemId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    logger.error('REMOVE_FROM_CART_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
}

/**
 * Clear cart
 */
async function clearCart(req, res) {
  try {
    const userId = req.user.userId;

    const result = await cartModel.clearCart(userId);

    logger.info('CART_CLEARED', `Cart cleared for user`, {
      userId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Cart cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    logger.error('CLEAR_CART_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
}

/**
 * Get cart item count
 */
async function getCartCount(req, res) {
  try {
    const userId = req.user.userId;

    const count = await cartModel.getCartItemCount(userId);

    res.json({
      success: true,
      count
    });
  } catch (error) {
    logger.error('GET_CART_COUNT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count'
    });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};

const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const dll = require('../../libs');
const logger = require('../utils/logger');
const { isValidExpiryDate, isValidCVV, isValidCardNumberFormat } = require('../utils/validator');

/**
 * Order Controller
 * Handles order creation and management
 */

/**
 * Checkout - Create order from cart
 */
async function checkout(req, res) {
  const client = require('../config/database');

  try {
    const userId = req.user.userId;
    const { shipping_address, payment_method, card_number, card_expiry, card_cvv, card_name } = req.body;

    // Get cart items
    const cartItems = await cartModel.getCartByUserId(userId);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate payment details (simulation only)
    if (payment_method === 'credit_card') {
      if (!isValidCardNumberFormat(card_number)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card number format'
        });
      }

      if (!isValidExpiryDate(card_expiry)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired card'
        });
      }

      if (!isValidCVV(card_cvv)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid CVV'
        });
      }
    }

    // Prepare cart items for DLL calculation
    const dllCartItems = cartItems.map(item => ({
      productId: item.product_id,
      quantity: item.quantity
    }));

    // Calculate order total using DLL
    const DLL_PASSWORD = process.env.DLL_PASSWORD;
    const userToken = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    const orderCalculation = await dll.CalculateOrderTotal(dllCartItems, DLL_PASSWORD, userToken);

    if (!orderCalculation.success) {
      return res.status(400).json({
        success: false,
        message: orderCalculation.message
      });
    }

    // Create order
    const order = await orderModel.createOrder(
      userId,
      parseFloat(orderCalculation.total),
      shipping_address,
      payment_method
    );

    // Add order items
    const orderItems = orderCalculation.items.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    await orderModel.addOrderItems(order.id, orderItems);

    // Reduce stock for each product
    for (const item of orderItems) {
      await productModel.reduceStock(item.product_id, item.quantity);
    }

    // Clear cart
    await cartModel.clearCart(userId);

    // Log transaction (NEVER log card details)
    logger.info('ORDER_PLACED', `Order placed: ID ${order.id}`, {
      userId,
      orderId: order.id,
      total: orderCalculation.total,
      itemCount: orderItems.length,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        order_total: order.order_total,
        status: order.status,
        created_at: order.created_at,
        orderDetails: orderCalculation
      }
    });
  } catch (error) {
    logger.error('CHECKOUT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Checkout failed. Please try again.'
    });
  }
}

/**
 * Get user's orders
 */
async function getUserOrders(req, res) {
  try {
    const userId = req.user.userId;

    const orders = await orderModel.getOrdersByUserId(userId);

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    logger.error('GET_USER_ORDERS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
}

/**
 * Get single order details
 */
async function getOrderById(req, res) {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;

    const order = await orderModel.getOrderById(orderId, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('GET_ORDER_ERROR', error.message, {
      userId: req.user?.userId,
      orderId: req.params.id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
}

module.exports = {
  checkout,
  getUserOrders,
  getOrderById
};

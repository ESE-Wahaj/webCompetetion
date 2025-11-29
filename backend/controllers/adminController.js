const dll = require('../../libs');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const logger = require('../utils/logger');

/**
 * Admin Controller
 * Handles admin-only operations using DLL for product CRUD
 */

/**
 * Create product (via DLL)
 */
async function createProduct(req, res) {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      sku: req.body.sku,
      image_url: req.body.image_url,
      category_id: req.body.category_id
    };

    const DLL_PASSWORD = process.env.DLL_PASSWORD;
    const userToken = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    const result = await dll.InsertProduct(productData, DLL_PASSWORD, userToken);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('PRODUCT_CREATED', `Product created via DLL: ID ${result.productId}`, {
      userId: req.user.userId,
      productId: result.productId,
      ip: req.ip
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error('CREATE_PRODUCT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
}

/**
 * Update product (via DLL)
 */
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      sku: req.body.sku,
      image_url: req.body.image_url,
      category_id: req.body.category_id,
      is_active: req.body.is_active
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const DLL_PASSWORD = process.env.DLL_PASSWORD;
    const userToken = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    const result = await dll.UpdateProduct(productId, updateData, DLL_PASSWORD, userToken);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('PRODUCT_UPDATED', `Product updated via DLL: ID ${productId}`, {
      userId: req.user.userId,
      productId,
      ip: req.ip
    });

    res.json(result);
  } catch (error) {
    logger.error('UPDATE_PRODUCT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
}

/**
 * Delete product (via DLL)
 */
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    const DLL_PASSWORD = process.env.DLL_PASSWORD;
    const userToken = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    const result = await dll.DeleteProduct(productId, DLL_PASSWORD, userToken);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('PRODUCT_DELETED', `Product deleted via DLL: ID ${productId}`, {
      userId: req.user.userId,
      productId,
      ip: req.ip
    });

    res.json(result);
  } catch (error) {
    logger.error('DELETE_PRODUCT_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
}

/**
 * Get all users (admin only)
 */
async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();

    logger.info('ADMIN_VIEW_USERS', 'Admin viewed all users', {
      userId: req.user.userId,
      ip: req.ip
    });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    logger.error('GET_ALL_USERS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}

/**
 * Update user role (admin only)
 */
async function updateUserRole(req, res) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (parseInt(userId) === req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const updatedUser = await userModel.updateUserRole(userId, role);

    logger.info('USER_ROLE_UPDATED', `User role updated: ID ${userId} to ${role}`, {
      userId: req.user.userId,
      targetUserId: userId,
      newRole: role,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'User role updated',
      user: updatedUser
    });
  } catch (error) {
    logger.error('UPDATE_USER_ROLE_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role'
    });
  }
}

/**
 * Get all orders (admin only)
 */
async function getAllOrders(req, res) {
  try {
    const filters = {
      status: req.query.status,
      userId: req.query.user_id,
      startDate: req.query.start_date,
      endDate: req.query.end_date
    };

    const orders = await orderModel.getAllOrders(filters);

    logger.info('ADMIN_VIEW_ORDERS', 'Admin viewed all orders', {
      userId: req.user.userId,
      ip: req.ip
    });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    logger.error('GET_ALL_ORDERS_ERROR', error.message, {
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
 * Update order status (admin only)
 */
async function updateOrderStatus(req, res) {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await orderModel.updateOrderStatus(orderId, status);

    logger.info('ORDER_STATUS_UPDATED', `Order status updated: ID ${orderId} to ${status}`, {
      userId: req.user.userId,
      orderId,
      newStatus: status,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error) {
    logger.error('UPDATE_ORDER_STATUS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
}

/**
 * Add tracking number to order (admin only)
 */
async function addTrackingNumber(req, res) {
  try {
    const orderId = req.params.id;
    const { tracking_number } = req.body;

    if (!tracking_number) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number is required'
      });
    }

    const updatedOrder = await orderModel.addTrackingNumber(orderId, tracking_number);

    logger.info('TRACKING_ADDED', `Tracking number added to order: ID ${orderId}`, {
      userId: req.user.userId,
      orderId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Tracking number added',
      order: updatedOrder
    });
  } catch (error) {
    logger.error('ADD_TRACKING_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add tracking number'
    });
  }
}

/**
 * Get order statistics (admin only)
 */
async function getOrderStatistics(req, res) {
  try {
    const stats = await orderModel.getOrderStatistics();

    logger.info('ADMIN_VIEW_STATS', 'Admin viewed order statistics', {
      userId: req.user.userId,
      ip: req.ip
    });

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    logger.error('GET_STATISTICS_ERROR', error.message, {
      userId: req.user?.userId,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUserRole,
  getAllOrders,
  updateOrderStatus,
  addTrackingNumber,
  getOrderStatistics
};

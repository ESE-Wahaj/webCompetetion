import api from './api';

/**
 * Order Service
 * API calls for orders
 */

export const orderService = {
  /**
   * Checkout - Place order
   */
  checkout: async (orderData) => {
    return await api.post('/orders/checkout', orderData);
  },

  /**
   * Get user's orders
   */
  getUserOrders: async () => {
    return await api.get('/orders');
  },

  /**
   * Get single order details
   */
  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  // Admin functions
  /**
   * Get all orders (admin only)
   */
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = queryString ? `/admin/orders?${queryString}` : '/admin/orders';

    return await api.get(url);
  },

  /**
   * Update order status (admin only)
   */
  updateOrderStatus: async (id, status) => {
    return await api.put(`/admin/orders/${id}/status`, { status });
  },

  /**
   * Add tracking number (admin only)
   */
  addTrackingNumber: async (id, trackingNumber) => {
    return await api.put(`/admin/orders/${id}/tracking`, {
      tracking_number: trackingNumber
    });
  },

  /**
   * Get order statistics (admin only)
   */
  getStatistics: async () => {
    return await api.get('/admin/statistics');
  }
};

export default orderService;

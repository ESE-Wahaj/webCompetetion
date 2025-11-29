import api from './api';

/**
 * Product Service
 * API calls for products
 */

export const productService = {
  /**
   * Get all products with optional filters
   */
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.search) params.append('search', filters.search);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    return await api.get(url);
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  /**
   * Search products
   */
  searchProducts: async (query) => {
    return await api.get(`/products/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryId) => {
    return await api.get(`/products/category/${categoryId}`);
  },

  /**
   * Get all categories
   */
  getAllCategories: async () => {
    return await api.get('/categories');
  },

  // Admin functions
  /**
   * Create product (admin only)
   */
  createProduct: async (productData) => {
    return await api.post('/admin/products', productData);
  },

  /**
   * Update product (admin only)
   */
  updateProduct: async (id, productData) => {
    return await api.put(`/admin/products/${id}`, productData);
  },

  /**
   * Delete product (admin only)
   */
  deleteProduct: async (id) => {
    return await api.delete(`/admin/products/${id}`);
  }
};

export default productService;

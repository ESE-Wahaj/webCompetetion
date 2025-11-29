import api from './api';

/**
 * Authentication Service
 * API calls for user authentication
 */

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get stored token
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;

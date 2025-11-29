import axios from 'axios';

/**
 * Axios API Configuration
 * Centralized API client with interceptors
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add JWT token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common errors
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          console.error('Access denied:', data.message);
          break;

        case 404:
          console.error('Resource not found:', data.message);
          break;

        case 500:
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API Error:', data.message);
      }

      return Promise.reject(data);
    } else if (error.request) {
      console.error('Network error: No response from server');
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;

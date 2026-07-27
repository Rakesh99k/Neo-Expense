/**
 * Axios instance configured for the backend API.
 * - Sets baseURL and sends credentials for cookie-based flows.
 * - Attaches Authorization header if a token exists in localStorage.
 */
import axios from 'axios';
import { logout } from './auth.js';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('et_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses globally
api.interceptors.response.use(
    // If response is OK (2xx), just return it normally
    response => response,

    // If response is an error, check if it is 401
    error => {
      if (error.response?.status === 401) {
        // Token is expired or invalid
        logout();                          // clear token from localStorage
        window.location.href = '/login';   // force redirect to login page
      }
      // For all other errors (400, 404, 500), reject normally
      // so individual catch blocks in hooks still work
      return Promise.reject(error);
    }
);

export default api;
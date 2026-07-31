import axios from 'axios';
import { logout } from './auth.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('et_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Do NOT auto-redirect for login/register
      // Those pages handle 401 themselves (show toast, shake, etc)
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/api/auth/login')
                          || url.includes('/api/auth/register');

      if (!isAuthEndpoint) {
        // For all other endpoints, token is invalid — logout + redirect
        logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
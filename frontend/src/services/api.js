/**
 * Axios instance configured for the backend API.
 * - Sets baseURL and sends credentials for cookie-based flows.
 * - Attaches Authorization header if a token exists in localStorage.
 */
import axios from 'axios';
import { logout } from './auth.js';

const api = axios.create({
    // Uses env variable in production, localhost in dev
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
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
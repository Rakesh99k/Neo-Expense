/**
 * Axios instance configured for the backend API.
 * - Sets baseURL and sends credentials for cookie-based flows.
 * - Attaches Authorization header if a token exists in localStorage.
 */
import axios from 'axios'; // HTTP client

const api = axios.create({ // preconfigured Axios instance
  baseURL: 'http://localhost:8080', // backend base URL
  withCredentials: true // include credentials for cookie-based auth if used
});

api.interceptors.request.use((config) => { // attach bearer token if present
  const token = localStorage.getItem('et_token'); // read token
  if (token) config.headers.Authorization = `Bearer ${token}`; // set header
  return config; // continue request
});

export default api; // export singleton

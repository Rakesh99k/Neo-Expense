/**
 * Authentication helper functions.
 * - register: creates account but does NOT store token (user must login)
 * - login: creates account and stores token
 * - logout: clears local state
 */
import api from './api.js';

export function isAuthenticated() {
  return Boolean(localStorage.getItem('et_token'));
}

/**
 * Register a new account.
 * Does NOT store the token — user is redirected to login after this.
 * Returns the response so caller can display user info if needed.
 */
export async function register(firstName, lastName, email, password) {
  const { data } = await api.post('/api/auth/register', {
    firstName,
    lastName,
    email,
    password
  });
  return data;
}

/**
 * Login existing user and persist token.
 */
export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  localStorage.setItem('et_token', data.token);
  localStorage.setItem('et_email', data.email);
  return data;
}

export function logout() {
  localStorage.removeItem('et_token');
  localStorage.removeItem('et_email');
  localStorage.removeItem('et_pending_email');
}
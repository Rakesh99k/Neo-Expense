/**
 * Authentication helper functions.
 * - register/login call backend endpoints and persist JWT + email locally.
 * - logout clears local auth state.
 */
import api from './api.js'; // Axios client

/** Register a new user and persist token/email */
export async function register(email, password) { // register user and persist token
  const { data } = await api.post('/api/auth/register', { email, password }); // POST credentials
  localStorage.setItem('et_token', data.token); // save JWT
  localStorage.setItem('et_email', data.email); // save email for convenience
  return data; // return payload
}

/** Login an existing user and persist token/email */
export async function login(email, password) { // login and persist token
  const { data } = await api.post('/api/auth/login', { email, password }); // POST credentials
  localStorage.setItem('et_token', data.token); // save JWT
  localStorage.setItem('et_email', data.email); // save email
  return data; // return payload
}

/** Clear any locally stored auth state */
export function logout() { // clear auth-related storage
  localStorage.removeItem('et_token'); // remove token
  localStorage.removeItem('et_email'); // remove email
}

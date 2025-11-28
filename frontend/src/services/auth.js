import api from './api.js';

export async function register(email, password) {
  const { data } = await api.post('/api/auth/register', { email, password });
  localStorage.setItem('et_token', data.token);
  localStorage.setItem('et_email', data.email);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  localStorage.setItem('et_token', data.token);
  localStorage.setItem('et_email', data.email);
  return data;
}

export function logout() {
  localStorage.removeItem('et_token');
  localStorage.removeItem('et_email');
}

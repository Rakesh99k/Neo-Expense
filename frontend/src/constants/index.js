/**
 * Centralized constants for the entire app.
 */

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' }
];

export const THEMES = [
  {
    id: 'neon-noir',
    label: 'Neon Noir',
    description: 'Netflix-style dark purple & gold',
    icon: '🌌',
    preview: { bg: '#0a0a0f', accent: '#a855f6', text: '#e4e4f0' }
  },
  {
    id: 'western-comic',
    label: 'Western Comic',
    description: 'Bold pop-art with halftone dots',
    icon: '💥',
    preview: { bg: '#fff8e1', accent: '#d32f2f', text: '#1a1a1a' }
  },
  {
    id: 'manga',
    label: 'Manga',
    description: 'Clean minimal Japanese style',
    icon: '🎌',
    preview: { bg: '#fafafa', accent: '#c62828', text: '#1a1a1a' }
  },
  {
    id: 'cartoon-flat',
    label: 'Cartoon Flat',
    description: 'Bright, rounded, playful',
    icon: '🎨',
    preview: { bg: '#f0fdf4', accent: '#f97316', text: '#1e293b' }
  },
  {
    id: 'graphic-novel',
    label: 'Graphic Novel',
    description: 'Dark moody dramatic panels',
    icon: '📖',
    preview: { bg: '#0f0f0f', accent: '#8b2252', text: '#d4c5a9' }
  }
];

export const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Travel',
  'Other'
];

// ── NEW in v3 ─────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { id: 'CASH',          label: 'Cash',           icon: '💵', color: '#22c55e' },
  { id: 'DEBIT_UPI',     label: 'Debit / UPI',    icon: '📱', color: '#3b82f6' },
  { id: 'CREDIT_CARD',   label: 'Credit Card',    icon: '💳', color: '#ef4444' },
  { id: 'WALLET',        label: 'Wallet',         icon: '👛', color: '#a855f6' },
  { id: 'BANK_TRANSFER', label: 'Bank Transfer',  icon: '🏦', color: '#06b6d4' },
  { id: 'OTHER',         label: 'Other',          icon: '💰', color: '#8888a4' }
];

export const RECURRING_FREQUENCIES = [
  { id: 'WEEKLY',  label: 'Weekly',  description: 'Every week on chosen day' },
  { id: 'MONTHLY', label: 'Monthly', description: 'Every month on chosen date' },
  { id: 'YEARLY',  label: 'Yearly',  description: 'Every year on chosen date' }
];

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
];

export const MONTHS_OF_YEAR = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

/**
 * Helper: get payment method details by ID.
 */
export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find(pm => pm.id === id) || PAYMENT_METHODS[0];
}

/**
 * Helper: get last used payment method from localStorage.
 */
export function getLastPaymentMethod() {
  try {
    const stored = localStorage.getItem('et_last_payment_method');
    if (stored && PAYMENT_METHODS.some(pm => pm.id === stored)) {
      return stored;
    }
  } catch {}
  return 'CASH';
}

/**
 * Helper: remember last used payment method.
 */
export function saveLastPaymentMethod(method) {
  try {
    localStorage.setItem('et_last_payment_method', method);
  } catch {}
}
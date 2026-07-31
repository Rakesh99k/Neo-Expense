/**
 * Currency formatting utilities.
 */

const SUPPORTED_CURRENCIES = new Set(['INR', 'USD', 'EUR', 'GBP']);

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

/**
 * Get just the symbol (no formatting).
 * Useful for icons in inputs.
 */
export function getCurrencySymbol(currency = 'INR') {
  return CURRENCY_SYMBOLS[currency] || '₹';
}

/**
 * Format a number as localized currency.
 */
export function formatCurrency(value, currency = 'INR') {
  const safeCurrency = SUPPORTED_CURRENCIES.has(currency) ? currency : 'INR';
  const numericValue = Number(value);

  return new Intl.NumberFormat(
    safeCurrency === 'INR' ? 'en-IN' : undefined,
    {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 2
    }
  ).format(Number.isFinite(numericValue) ? numericValue : 0);
}

/**
 * Format ISO date string.
 */
export function formatDate(iso) {
  if (!iso) return '-';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
}
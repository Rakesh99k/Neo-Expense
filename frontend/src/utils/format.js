/**
 * formatCurrency
 * Formats a number as currency.
 * IMPORTANT: Always pass currency explicitly from React state.
 * Do NOT read from localStorage — prefs live on backend now.
 *
 * Usage:
 *   formatCurrency(amount, prefs.currency)
 *   formatCurrency(amount, 'USD')
 *   formatCurrency(amount)  ← falls back to USD
 */
export function formatCurrency(value, currency = 'INR') {
  // Validate currency code — fallback to USD if invalid
  const safeCurrency = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].includes(currency)
      ? currency
      : 'INR';

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: safeCurrency
  }).format(value || 0);
}

/**
 * formatDate
 * Formats ISO date string to locale-friendly display.
 */
export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString();
}
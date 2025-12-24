/**
 * formatCurrency
 * Safe currency formatter; prefers user prefs from localStorage.
 * - value: number to format
 * - currencyOverride?: ISO currency code; falls back to prefs or USD
 */
export function formatCurrency(value, currencyOverride) { // format value as localized currency
  let currency = currencyOverride; // prefer explicit override
  if (!currency) { // otherwise check stored prefs
    try {
      const prefsRaw = localStorage.getItem('et_prefs'); // read prefs JSON
      if (prefsRaw) {
        const prefs = JSON.parse(prefsRaw); // parse
        currency = prefs.currency || 'USD'; // currency from prefs or default
      } else {
        currency = 'USD'; // fallback default
      }
    } catch {
      currency = 'USD'; // if parsing fails, default
    }
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value || 0); // format number
}

/** Format ISO date string in a locale-friendly way */
export function formatDate(iso) { // human-friendly date from ISO string
  if (!iso) return '-'; // handle missing values
  return new Date(iso).toLocaleDateString(); // locale date
}

export function formatCurrency(value, currencyOverride) {
  let currency = currencyOverride;
  if (!currency) {
    try {
      const prefsRaw = localStorage.getItem('et_prefs');
      if (prefsRaw) {
        const prefs = JSON.parse(prefsRaw);
        currency = prefs.currency || 'USD';
      } else {
        currency = 'USD';
      }
    } catch {
      currency = 'USD';
    }
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value || 0);
}

export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString();
}

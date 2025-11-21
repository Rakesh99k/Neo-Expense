export function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value || 0);
}

export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString();
}

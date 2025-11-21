// Simple abstraction over localStorage for app data
const KEYS = {
  expenses: 'et_expenses',
  prefs: 'et_prefs'
};

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Storage read error', e);
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function getExpenses() {
  return read(KEYS.expenses) || [];
}

export function saveExpenses(expenses) {
  write(KEYS.expenses, expenses);
}

export function getPrefs() {
  const defaults = { currency: 'USD', theme: 'neon' };
  return { ...defaults, ...(read(KEYS.prefs) || {}) };
}

export function savePrefs(prefs) {
  write(KEYS.prefs, prefs);
}

// Simple abstraction over localStorage for app data
// - Encapsulates keys, read/write with JSON parsing and error guards.
const KEYS = { // centralize storage keys
  expenses: 'et_expenses', // expenses list
  prefs: 'et_prefs' // user preferences
};

function read(key) { // read and parse JSON by key
  try {
    const raw = localStorage.getItem(key); // string or null
    return raw ? JSON.parse(raw) : null; // parse if present
  } catch (e) {
    console.error('Storage read error', e); // log parse/access errors
    return null; // fallback
  }
}

function write(key, value) { // stringify and write JSON
  try {
    localStorage.setItem(key, JSON.stringify(value)); // persist
  } catch (e) {
    console.error('Storage write error', e); // log quota/access errors
  }
}

export function getExpenses() { // read expenses list
  return read(KEYS.expenses) || []; // default to empty array
}

export function saveExpenses(expenses) { // write expenses list
  write(KEYS.expenses, expenses);
}

export function getPrefs() { // read preferences with defaults
  const defaults = { currency: 'USD', theme: 'neon' }; // base defaults
  return { ...defaults, ...(read(KEYS.prefs) || {}) }; // merge stored over defaults
}

export function savePrefs(prefs) { // write preferences
  write(KEYS.prefs, prefs);
}

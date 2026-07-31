/**
 * ThemeManager
 * Manages theme application for public pages (login/register)
 * where we don't have PrefsProvider yet.
 *
 * Stores theme in localStorage so it persists across sessions
 * and syncs with backend once user logs in.
 */

const VALID_THEMES = [
  'neon-noir',
  'western-comic',
  'manga',
  'cartoon-flat',
  'graphic-novel'
];

const STORAGE_KEY = 'et_theme';
const DEFAULT_THEME = 'neon-noir';

/**
 * Get current theme from localStorage or default.
 */
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_THEMES.includes(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * Save theme to localStorage and apply to body.
 */
export function setStoredTheme(theme) {
  const safeTheme = VALID_THEMES.includes(theme) ? theme : DEFAULT_THEME;
  try {
    localStorage.setItem(STORAGE_KEY, safeTheme);
  } catch {}
  document.body.setAttribute('data-theme', safeTheme);
}

/**
 * Apply theme immediately without saving.
 */
export function applyTheme(theme) {
  const safeTheme = VALID_THEMES.includes(theme) ? theme : DEFAULT_THEME;
  document.body.setAttribute('data-theme', safeTheme);
}

export { VALID_THEMES, DEFAULT_THEME };
/**
 * usePrefs
 * Re-exports usePrefs from PrefsContext.
 * This file exists so existing imports still work without changes.
 * All components that import from hooks/usePrefs.js
 * now automatically use the shared context.
 */
export { usePrefs } from '../context/PrefsContext.jsx';
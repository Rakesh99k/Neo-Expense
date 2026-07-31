import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const PrefsContext = createContext({
  prefs: { currency: 'INR', theme: 'neon-noir' },
  updatePref: async () => {},
  prefsLoading: true
});

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState({
    currency: 'INR',
    theme: 'neon-noir'
  });
  const [prefsLoading, setPrefsLoading] = useState(true);

  // Fetch prefs on mount
  useEffect(() => {
    let mounted = true;

    api.get('/api/prefs')
      .then(res => {
        if (mounted) {
          setPrefs(res.data);
          applyTheme(res.data.theme);
        }
      })
      .catch(err => {
        console.error('Failed to load preferences:', err);
        applyTheme('neon-noir');
      })
      .finally(() => {
        if (mounted) setPrefsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(prefs.theme);
  }, [prefs.theme]);

  async function updatePref(key, value) {
    // Optimistic update — apply theme immediately for instant feedback
    if (key === 'theme') {
      applyTheme(value);
    }

    const next = { ...prefs, [key]: value };
    const { data } = await api.put('/api/prefs', next);
    setPrefs(data);

    // Reapply from server response (in case server modified value)
    applyTheme(data.theme);
  }

  return (
    <PrefsContext.Provider value={{ prefs, updatePref, prefsLoading }}>
      {children}
    </PrefsContext.Provider>
  );
}

/**
 * Apply theme to <body> element.
 * Uses data-theme attribute which CSS variables listen to.
 */
function applyTheme(theme) {
  const validThemes = [
    'neon-noir',
    'western-comic',
    'manga',
    'cartoon-flat',
    'graphic-novel'
  ];
  const safeTheme = validThemes.includes(theme) ? theme : 'neon-noir';
  document.body.setAttribute('data-theme', safeTheme);
}

export function usePrefs() {
  return useContext(PrefsContext);
}
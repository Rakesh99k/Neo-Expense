import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';
import { setStoredTheme, getStoredTheme } from './ThemeManager.js';

const PrefsContext = createContext({
  prefs: { currency: 'INR', theme: 'neon-noir' },
  updatePref: async () => {},
  prefsLoading: true
});

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState({
    currency: 'INR',
    theme: getStoredTheme() // start with whatever was in localStorage
  });
  const [prefsLoading, setPrefsLoading] = useState(true);

  // Fetch prefs from backend on mount
  useEffect(() => {
    let mounted = true;

    api.get('/api/prefs')
      .then(res => {
        if (mounted) {
          setPrefs(res.data);
          // Sync theme from backend to localStorage
          setStoredTheme(res.data.theme);
        }
      })
      .catch(err => {
        console.error('Failed to load preferences:', err);
      })
      .finally(() => {
        if (mounted) setPrefsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    setStoredTheme(prefs.theme);
  }, [prefs.theme]);

  async function updatePref(key, value) {
    // Apply theme immediately for instant feedback
    if (key === 'theme') {
      setStoredTheme(value);
    }

    const next = { ...prefs, [key]: value };
    const { data } = await api.put('/api/prefs', next);
    setPrefs(data);

    // Sync with server response
    if (key === 'theme') {
      setStoredTheme(data.theme);
    }
  }

  return (
    <PrefsContext.Provider value={{ prefs, updatePref, prefsLoading }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  return useContext(PrefsContext);
}
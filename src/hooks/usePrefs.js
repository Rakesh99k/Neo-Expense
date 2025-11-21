import { useLocalStorage } from './useLocalStorage.js';

const DEFAULT_PREFS = {
  currency: 'USD',
  theme: 'neon' // neon | light
};

export function usePrefs() {
  const [prefs, setPrefs] = useLocalStorage('et_prefs', DEFAULT_PREFS);

  function updatePref(key, value) {
    setPrefs(p => ({ ...p, [key]: value }));
  }

  return { prefs, updatePref };
}

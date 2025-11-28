import { useEffect, useState } from 'react';
import api from '../services/api.js';

export function usePrefs() {
  const [prefs, setPrefs] = useState({ currency: 'USD', theme: 'neon' });

  useEffect(() => {
    let mounted = true;
    api.get('/api/prefs')
      .then(res => { if (mounted) setPrefs(res.data); })
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  async function updatePref(key, value) {
    const next = { ...prefs, [key]: value };
    const { data } = await api.put('/api/prefs', next);
    setPrefs(data);
  }

  return { prefs, updatePref };
}

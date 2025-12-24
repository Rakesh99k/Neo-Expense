/**
 * usePrefs
 * Loads and updates user preferences (currency, theme) via backend API.
 * Returns:
 * - prefs: { currency: string, theme: string }
 * - updatePref(key, value): Promise<void>
 */
import { useEffect, useState } from 'react'; // React hooks
import api from '../services/api.js'; // Axios client configured for backend

export function usePrefs() { // loads and updates user preferences
  const [prefs, setPrefs] = useState({ currency: 'USD', theme: 'neon' }); // local state with defaults

  useEffect(() => { // fetch prefs on mount
    let mounted = true; // prevent state update after unmount
    api.get('/api/prefs') // GET preferences
      .then(res => { if (mounted) setPrefs(res.data); }) // set state if mounted
      .catch(console.error); // log error
    return () => { mounted = false; }; // cleanup flag
  }, []); // run once

  async function updatePref(key, value) { // update a single preference
    const next = { ...prefs, [key]: value }; // create next prefs object
    const { data } = await api.put('/api/prefs', next); // persist to backend
    setPrefs(data); // sync local state with server response
  }

  return { prefs, updatePref }; // exposed API for consumers
}

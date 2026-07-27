/**
 * PrefsContext
 * Single shared state for user preferences (currency, theme).
 * Wraps the authenticated part of the app only.
 * Fetches from backend once on login, updates on any preference change.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

// Default context value — replaced immediately after backend fetch
const PrefsContext = createContext({
    prefs: { currency: 'INR', theme: 'neon-noir' },
    updatePref: async () => {},
    prefsLoading: true
});

/**
 * PrefsProvider
 * Place this around ProtectedApp only (inside App.jsx after auth check).
 * All children share the same prefs state — no duplicate API calls.
 */
export function PrefsProvider({ children }) {
    const [prefs, setPrefs] = useState({
        currency: 'INR',   // shown before backend responds
        theme: 'neon-noir'
    });
    const [prefsLoading, setPrefsLoading] = useState(true);

    // Fetch preferences from backend on mount
    useEffect(() => {
        let mounted = true;

        api.get('/api/prefs')
            .then(res => {
                if (mounted) {
                    setPrefs(res.data);
                    // Apply theme immediately so no flash of wrong theme
                    document.body.dataset.theme = res.data.theme || 'neon-noir';
                }
            })
            .catch(err => {
                // 401 is handled by api.js interceptor (redirects to login)
                // Other errors keep the default INR/neon values
                console.error('Failed to load preferences:', err);
                document.body.dataset.theme = 'neon-noir';
            })
            .finally(() => {
                if (mounted) setPrefsLoading(false);
            });

        return () => { mounted = false; };
    }, []);

    // Apply theme to body whenever prefs.theme changes
    useEffect(() => {
        document.body.dataset.theme = prefs.theme || 'neon-noir';
    }, [prefs.theme]);

    /**
     * updatePref
     * Updates one preference key and persists to backend.
     * All consumers re-render immediately with the new value.
     * Throws on error so callers can show feedback.
     */
    async function updatePref(key, value) {
        const next = { ...prefs, [key]: value };

        const { data } = await api.put('/api/prefs', next);

        // Update shared state — every component using usePrefs() re-renders
        setPrefs(data);
    }

    return (
        <PrefsContext.Provider value={{ prefs, updatePref, prefsLoading }}>
            {children}
        </PrefsContext.Provider>
    );
}

/**
 * usePrefs
 * Consume shared prefs context in any component.
 * Import from hooks/usePrefs.js (which re-exports this)
 * so existing imports do not need to change.
 */
export function usePrefs() {
    return useContext(PrefsContext);
}
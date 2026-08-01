/**
 * useSavings
 * Fetches savings history and projected savings.
 * Returns:
 *   savings: { totalSaved, currentMonthProjected, history[] }
 *   loading, error
 *   refresh()
 */
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

const DEFAULT_SAVINGS = {
    totalSaved: 0,
    currentMonthProjected: 0,
    history: []
};

export function useSavings() {
    const [savings, setSavings] = useState(DEFAULT_SAVINGS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavings = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/savings');
            setSavings({
                totalSaved: Number(data.totalSaved) || 0,
                currentMonthProjected: Number(data.currentMonthProjected) || 0,
                history: (data.history || []).map(h => ({
                    ...h,
                    budgetAmount: Number(h.budgetAmount),
                    spentAmount: Number(h.spentAmount),
                    savedAmount: Number(h.savedAmount)
                }))
            });
            setError(null);
        } catch (err) {
            console.error('Failed to load savings', err);
            setError('Failed to load savings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSavings();
    }, [fetchSavings]);

    return {
        savings,
        loading,
        error,
        refresh: fetchSavings
    };
}
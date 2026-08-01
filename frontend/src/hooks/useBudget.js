/**
 * useBudget
 * Fetches and updates monthly budget from backend.
 * Returns:
 *   budget: { enabled, monthlyAmount, currentMonthSpent, currentMonthRemaining, daysLeftInMonth, status }
 *   loading, error
 *   updateBudget(enabled, monthlyAmount)
 *   refresh()
 */
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

const DEFAULT_BUDGET = {
    enabled: false,
    monthlyAmount: 0,
    currentMonthSpent: 0,
    currentMonthRemaining: 0,
    daysLeftInMonth: 30,
    status: 'disabled'
};

export function useBudget() {
    const [budget, setBudget] = useState(DEFAULT_BUDGET);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBudget = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/budget');
            setBudget(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load budget', err);
            setError('Failed to load budget');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);

    const updateBudget = useCallback(async (enabled, monthlyAmount) => {
        const { data } = await api.put('/api/budget', {
            enabled,
            monthlyAmount: Number(monthlyAmount) || 0
        });
        setBudget(data);
        return data;
    }, []);

    return {
        budget,
        loading,
        error,
        updateBudget,
        refresh: fetchBudget
    };
}
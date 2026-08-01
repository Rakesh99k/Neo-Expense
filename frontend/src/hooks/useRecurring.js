import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

export function useRecurring() {
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecurring = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/recurring');
            setRecurring(
                (data || []).map(r => ({
                    ...r,
                    amount: parseFloat(r.amount)
                }))
            );
            setError(null);
        } catch (err) {
            console.error('Failed to load recurring', err);
            setError('Failed to load recurring expenses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecurring();
    }, [fetchRecurring]);

    const addRecurring = useCallback(async (payload) => {
        const { data } = await api.post('/api/recurring', payload);
        const parsed = { ...data, amount: parseFloat(data.amount) };
        setRecurring(prev => [parsed, ...prev]);
        return parsed;
    }, []);

    const updateRecurring = useCallback(async (id, payload) => {
        const { data } = await api.put(`/api/recurring/${id}`, payload);
        const parsed = { ...data, amount: parseFloat(data.amount) };
        setRecurring(prev => prev.map(r => (r.id === id ? parsed : r)));
        return parsed;
    }, []);

    const deleteRecurring = useCallback(async (id) => {
        await api.delete(`/api/recurring/${id}`);
        setRecurring(prev => prev.filter(r => r.id !== id));
    }, []);

    const pauseRecurring = useCallback(async (id) => {
        const { data } = await api.post(`/api/recurring/${id}/pause`);
        const parsed = { ...data, amount: parseFloat(data.amount) };
        setRecurring(prev => prev.map(r => (r.id === id ? parsed : r)));
        return parsed;
    }, []);

    const resumeRecurring = useCallback(async (id) => {
        const { data } = await api.post(`/api/recurring/${id}/resume`);
        const parsed = { ...data, amount: parseFloat(data.amount) };
        setRecurring(prev => prev.map(r => (r.id === id ? parsed : r)));
        return parsed;
    }, []);

    // NEW: Manually generate an expense from a template right now
    const generateNow = useCallback(async (id) => {
        await api.post(`/api/recurring/${id}/generate-now`);
        // Refresh to pick up updated lastGeneratedAt
        await fetchRecurring();
    }, [fetchRecurring]);

    return {
        recurring,
        loading,
        error,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        pauseRecurring,
        resumeRecurring,
        generateNow,
        refresh: fetchRecurring
    };
}
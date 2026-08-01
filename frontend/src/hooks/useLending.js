/**
 * useLending
 * Fetches and manages lending records + summary.
 * Returns:
 *   lendings[]                 — all lending records
 *   summary                    — totals, net position, known persons
 *   loading, error
 *   addLending(data)
 *   updateLending(id, data)
 *   deleteLending(id)
 *   recordPayment(id, payment) — record partial/full return
 *   refresh()
 */
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

const DEFAULT_SUMMARY = {
    totalLent: 0,
    totalBorrowed: 0,
    owedToYou: 0,
    youOwe: 0,
    netPosition: 0,
    activeLentCount: 0,
    activeBorrowedCount: 0,
    knownPersons: []
};

export function useLending() {
    const [lendings, setLendings] = useState([]);
    const [summary, setSummary] = useState(DEFAULT_SUMMARY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [listRes, summaryRes] = await Promise.all([
                api.get('/api/lending'),
                api.get('/api/lending/summary')
            ]);

            setLendings(
                (listRes.data || []).map(l => ({
                    ...l,
                    originalAmount: parseFloat(l.originalAmount),
                    returnedAmount: parseFloat(l.returnedAmount),
                    remainingAmount: parseFloat(l.remainingAmount)
                }))
            );

            setSummary({
                totalLent: parseFloat(summaryRes.data.totalLent),
                totalBorrowed: parseFloat(summaryRes.data.totalBorrowed),
                owedToYou: parseFloat(summaryRes.data.owedToYou),
                youOwe: parseFloat(summaryRes.data.youOwe),
                netPosition: parseFloat(summaryRes.data.netPosition),
                activeLentCount: summaryRes.data.activeLentCount,
                activeBorrowedCount: summaryRes.data.activeBorrowedCount,
                knownPersons: summaryRes.data.knownPersons || []
            });

            setError(null);
        } catch (err) {
            console.error('Failed to load lending', err);
            setError('Failed to load lending data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const addLending = useCallback(async (payload) => {
        await api.post('/api/lending', payload);
        await fetchAll();
    }, [fetchAll]);

    const updateLending = useCallback(async (id, payload) => {
        await api.put(`/api/lending/${id}`, payload);
        await fetchAll();
    }, [fetchAll]);

    const deleteLending = useCallback(async (id) => {
        await api.delete(`/api/lending/${id}`);
        await fetchAll();
    }, [fetchAll]);

    const recordPayment = useCallback(async (id, payment) => {
        await api.post(`/api/lending/${id}/payment`, payment);
        await fetchAll();
    }, [fetchAll]);

    return {
        lendings,
        summary,
        loading,
        error,
        addLending,
        updateLending,
        deleteLending,
        recordPayment,
        refresh: fetchAll
    };
}
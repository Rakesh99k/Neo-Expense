/**
 * useExpenses
 * Fetches and manages expenses from backend.
 * Now includes paymentMethod and recurringId fields.
 */
import { useCallback, useMemo, useEffect, useState } from 'react';
import api from '../services/api.js';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api.get('/api/expenses')
        .then(res => {
          if (mounted) {
            setExpenses(
                (res.data || []).map(e => ({
                  ...e,
                  amount: parseFloat(e.amount),
                  paymentMethod: e.paymentMethod || 'CASH'
                }))
            );
            setError(null);
          }
        })
        .catch(err => {
          if (mounted) setError('Failed to load expenses');
          console.error('Expenses fetch failed', err);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });

    return () => { mounted = false; };
  }, []);

  const addExpense = useCallback(async (data) => {
    const { data: created } = await api.post('/api/expenses', data);
    const parsed = {
      ...created,
      amount: parseFloat(created.amount),
      paymentMethod: created.paymentMethod || 'CASH'
    };
    setExpenses(prev => [parsed, ...prev]);
    return parsed;
  }, []);

  const updateExpense = useCallback(async (id, patch) => {
    const { data: updated } = await api.put(`/api/expenses/${id}`, patch);
    const parsed = {
      ...updated,
      amount: parseFloat(updated.amount),
      paymentMethod: updated.paymentMethod || 'CASH'
    };
    setExpenses(prev => prev.map(e => (e.id === id ? parsed : e)));
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await api.delete(`/api/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const stats = useMemo(() => {
    if (!expenses.length) return { monthTotal: 0, yearTotal: 0, count: 0 };
    const now = new Date();
    const monthRange = { start: startOfMonth(now), end: endOfMonth(now) };
    let monthTotal = 0, yearTotal = 0;
    expenses.forEach(e => {
      const d = parseISO(e.date);
      if (d.getFullYear() === now.getFullYear()) yearTotal += e.amount;
      if (isWithinInterval(d, monthRange)) monthTotal += e.amount;
    });
    return { monthTotal, yearTotal, count: expenses.length };
  }, [expenses]);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    stats,
    loading,
    error
  };
}
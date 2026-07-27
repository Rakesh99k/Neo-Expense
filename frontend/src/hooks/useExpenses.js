/**
 * useExpenses
 * Centralized expense state and CRUD operations backed by the backend API.
 * Returns:
 * - expenses: Expense[]
 * - addExpense(data): Promise<Expense>
 * - updateExpense(id, patch): Promise<void>
 * - deleteExpense(id): Promise<void>
 * - stats: { monthTotal, yearTotal, count }
 */
import { useCallback, useMemo, useEffect, useState } from 'react';
import api from '../services/api.js';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);   // NEW: tracks if fetch is in progress
  const [error, setError] = useState(null);        // NEW: holds error message if fetch fails

  useEffect(() => {
    let mounted = true;
    setLoading(true);   // start loading

    api.get('/api/expenses')
        .then(res => {
          if (mounted) {
            // Parse amount to number because backend BigDecimal
            // can come as string "3.50" instead of number 3.50
            const parsed = (res.data || []).map(e => ({
              ...e,
              amount: parseFloat(e.amount)  // ensure it is always a number
            }));
            setExpenses(parsed);
            setError(null);   // clear any previous error
          }
        })
        .catch(err => {
          // Note: 401 errors are already handled by api.js interceptor
          // This catch only runs for other errors (500, network issues, etc.)
          if (mounted) {
            setError('Failed to load expenses. Please try again.');
          }
          console.error('Expenses fetch failed', err);
        })
        .finally(() => {
          if (mounted) setLoading(false);  // always stop loading
        });

    return () => { mounted = false; };
  }, []);

  const addExpense = useCallback(async (data) => {
    const { data: created } = await api.post('/api/expenses', data);
    // Parse amount for consistency
    const parsed = { ...created, amount: parseFloat(created.amount) };
    setExpenses(prev => [parsed, ...prev]);
    return parsed;
  }, []);

  const updateExpense = useCallback(async (id, patch) => {
    const { data: updated } = await api.put(`/api/expenses/${id}`, patch);
    const parsed = { ...updated, amount: parseFloat(updated.amount) };
    setExpenses(prev => prev.map(e => e.id === id ? parsed : e));
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

  // NEW: loading and error are now returned so pages can use them
  return { expenses, addExpense, updateExpense, deleteExpense, stats, loading, error };
}
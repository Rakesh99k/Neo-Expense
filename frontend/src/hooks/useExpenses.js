import { useCallback, useMemo, useEffect, useState } from 'react';
import api from '../services/api.js';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

// Expense shape: { id, title, amount, category, date (ISO), notes }

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/api/expenses')
      .then(res => { if (mounted) setExpenses(res.data || []); })
      .catch(err => console.error('Expenses fetch failed', err));
    return () => { mounted = false; };
  }, []);

  const addExpense = useCallback(async (data) => {
    const { data: created } = await api.post('/api/expenses', data);
    setExpenses(prev => [created, ...prev]);
    return created;
  }, []);

  const updateExpense = useCallback(async (id, patch) => {
    const { data: updated } = await api.put(`/api/expenses/${id}`, patch);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
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

  return { expenses, addExpense, updateExpense, deleteExpense, stats };
}

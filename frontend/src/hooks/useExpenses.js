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

// Expense shape: { id, title, amount, category, date (ISO), notes }

export function useExpenses() {
  const [expenses, setExpenses] = useState([]); // holds the list of expenses fetched/modified in-app

  useEffect(() => { // on mount, fetch expenses from backend
    let mounted = true; // flag to avoid setting state if component unmounts
    api.get('/api/expenses') // GET list of expenses
      .then(res => { if (mounted) setExpenses(res.data || []); }) // store data if still mounted
      .catch(err => console.error('Expenses fetch failed', err)); // log any network/API error
    return () => { mounted = false; }; // cleanup toggles mounted flag off
  }, []); // run once on first render

  const addExpense = useCallback(async (data) => { // create a new expense
    const { data: created } = await api.post('/api/expenses', data); // POST payload to backend
    setExpenses(prev => [created, ...prev]); // prepend new expense optimistically
    return created; // return created entity to caller
  }, []); // stable reference for consumers

  const updateExpense = useCallback(async (id, patch) => { // update an existing expense
    const { data: updated } = await api.put(`/api/expenses/${id}`, patch); // PUT patch to backend
    setExpenses(prev => prev.map(e => e.id === id ? updated : e)); // replace matching item in state
  }, []); // stable reference

  const deleteExpense = useCallback(async (id) => { // delete an expense by id
    await api.delete(`/api/expenses/${id}`); // DELETE on backend
    setExpenses(prev => prev.filter(e => e.id !== id)); // remove from state
  }, []); // stable reference

  const stats = useMemo(() => { // derive summary stats from current expenses
    if (!expenses.length) return { monthTotal: 0, yearTotal: 0, count: 0 }; // empty defaults
    const now = new Date(); // current point in time
    const monthRange = { start: startOfMonth(now), end: endOfMonth(now) }; // current month interval
    let monthTotal = 0, yearTotal = 0; // accumulators
    expenses.forEach(e => { // iterate each expense once
      const d = parseISO(e.date); // parse ISO date string
      if (d.getFullYear() === now.getFullYear()) yearTotal += e.amount; // sum this year's spend
      if (isWithinInterval(d, monthRange)) monthTotal += e.amount; // sum current month's spend
    });
    return { monthTotal, yearTotal, count: expenses.length }; // expose computed metrics
  }, [expenses]); // recompute when expenses change

  return { expenses, addExpense, updateExpense, deleteExpense, stats }; // public API of the hook
}

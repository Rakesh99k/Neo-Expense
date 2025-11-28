import { useCallback, useMemo } from 'react';
import { getExpenses, saveExpenses } from '../services/storage.js';
import { v4 as uuid } from 'uuid';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

// Expense shape: { id, title, amount, category, date (ISO), notes }
import { useLocalStorage } from './useLocalStorage.js';

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage('et_expenses', getExpenses());

  const persist = useCallback((next) => {
    setExpenses(next);
    saveExpenses(next);
  }, [setExpenses]);

  const addExpense = useCallback((data) => {
    const expense = { id: uuid(), ...data };
    persist([expense, ...expenses]);
    return expense;
  }, [expenses, persist]);

  const updateExpense = useCallback((id, patch) => {
    persist(expenses.map(e => e.id === id ? { ...e, ...patch } : e));
  }, [expenses, persist]);

  const deleteExpense = useCallback((id) => {
    persist(expenses.filter(e => e.id !== id));
  }, [expenses, persist]);

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

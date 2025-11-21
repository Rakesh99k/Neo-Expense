import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseList from '../components/expenses/ExpenseList.jsx';
import ExpenseModal from '../components/expenses/ExpenseModal.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const categories = ['Food','Transport','Utilities','Entertainment','Health','Shopping','Travel','Other'];

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (categoryFilter && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, query, categoryFilter]);

  function handleAdd(data) {
    addExpense(data);
    setModalOpen(false);
  }

  function handleUpdate(id, data) {
    updateExpense(id, data);
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="subtitle">Manage and analyze your spending.</p>
        </div>
        <div className="expenses-actions">
          <button className="btn-accent" onClick={() => { setEditing(null); setModalOpen(true); }}>+ Add Expense</button>
        </div>
      </div>

      <div className="filters-row">
        <input
          className="filter-input"
            placeholder="Search title..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
        <select
          className="filter-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <ExpenseList
        items={filtered}
        onEdit={item => { setEditing(item); setModalOpen(true); }}
        onDelete={id => deleteExpense(id)}
      />

      <AnimatePresence>
        {modalOpen && (
          <ExpenseModal
            key="modal"
            categories={categories}
            initialData={editing}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSubmit={data => editing ? handleUpdate(editing.id, data) : handleAdd(data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

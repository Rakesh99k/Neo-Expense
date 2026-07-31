import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import { useExpenses } from '../hooks/useExpenses.js';
import { CATEGORIES } from '../constants/index.js';

import ExpenseList from '../components/expenses/ExpenseList.jsx';
import ExpenseModal from '../components/expenses/ExpenseModal.jsx';
import Pagination from '../components/expenses/Pagination.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import SearchInput from '../components/ui/SearchInput.jsx';
import FilterSelect from '../components/ui/FilterSelect.jsx';
import FAB from '../components/ui/FAB.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Expenses() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    loading,
    error
  } = useExpenses();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (categoryFilter && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, query, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, pageSize, expenses.length]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function fireConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f6', '#3b82f6', '#ec4899', '#f97316']
    });
  }

  async function handleAdd(data) {
    try {
      const isFirstExpense = expenses.length === 0;
      await addExpense(data);
      toast.success('Expense added successfully');
      setModalOpen(false);
      if (isFirstExpense) {
        fireConfetti();
      }
    } catch (err) {
      console.error('Add failed', err);
      toast.error('Failed to add expense. Please try again.');
    }
  }

  async function handleUpdate(id, data) {
    try {
      await updateExpense(id, data);
      toast.success('Expense updated');
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Failed to update expense');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id);
      toast.success('Expense deleted');
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete expense');
    }
  }

  function requestDelete(id) {
    setConfirmDelete(id);
  }

  if (loading) {
    return (
      <div className="expenses-page">
        <LoadingSpinner fullPage message="Loading expenses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="expenses-page">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Something went wrong</div>
          <div className="empty-state-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses-page">
      {/* Header */}
      <motion.div
        className="expenses-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Manage and analyze your spending</p>
        </div>
        <div className="expenses-page-action-desktop">
          <GradientButton
            onClick={() => { setEditing(null); setModalOpen(true); }}
            icon={<IconPlus />}
          >
            Add Expense
          </GradientButton>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="expenses-filters"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search title..."
          onClear={() => setQuery('')}
        />
        <FilterSelect
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          options={CATEGORIES}
          placeholder="All Categories"
        />
        {(query || categoryFilter) && (
          <button
            className="btn-clear-filters"
            onClick={() => { setQuery(''); setCategoryFilter(''); }}
          >
            Clear all
          </button>
        )}
      </motion.div>

      {/* Result count */}
      {(query || categoryFilter) && (
        <div className="expenses-count">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* List */}
      <ExpenseList
        items={paginated}
        onEdit={item => { setEditing(item); setModalOpen(true); }}
        onDelete={requestDelete}
      />

      {/* Pagination */}
      {filtered.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ExpenseModal
            key="expense-modal"
            categories={CATEGORIES}
            initialData={editing}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSubmit={data =>
              editing ? handleUpdate(editing.id, data) : handleAdd(data)
            }
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        icon={<IconTrash />}
      />

      {/* Floating action button for mobile */}
      <FAB
        onClick={() => { setEditing(null); setModalOpen(true); }}
        label="Add expense"
      />
    </div>
  );
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}
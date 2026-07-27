/**
 * Expenses
 * CRUD-focused page to browse, filter, paginate, add, edit, and delete expenses.
 * - Uses useExpenses() for data and mutations.
 * - Provides client-side filters and pagination for usability.
 * - Shows loading and error states.
 */
import { useState, useMemo, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseList from '../components/expenses/ExpenseList.jsx';
import ExpenseModal from '../components/expenses/ExpenseModal.jsx';
import Pagination from '../components/expenses/Pagination.jsx';
import { AnimatePresence } from 'framer-motion';

const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Travel',
  'Other'
];

export default function Expenses() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    loading,   // true while fetching from backend
    error      // error message string if fetch failed
  } = useExpenses();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Apply text + category filters to full expense list
  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) {
        return false; // title does not match search
      }
      if (categoryFilter && e.category !== categoryFilter) {
        return false; // category does not match filter
      }
      return true;
    });
  }, [expenses, query, categoryFilter]);

  // Reset to page 1 whenever filters or data length changes
  useEffect(() => {
    setPage(1);
  }, [query, categoryFilter, pageSize, expenses.length]);

  // Slice filtered list for current page
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Add new expense then close modal
  async function handleAdd(data) {
    try {
      await addExpense(data);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to add expense', err);
      // Error is visible in console; could add toast here
    }
  }

  // Update existing expense then close modal
  async function handleUpdate(id, data) {
    try {
      await updateExpense(id, data);
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Failed to update expense', err);
    }
  }

  // Delete expense with confirmation
  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  }

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
        <div className="expenses-page">
          <div className="expenses-header">
            <div>
              <h1 className="page-title">Expenses</h1>
              <p className="subtitle">Manage and analyze your spending.</p>
            </div>
          </div>
          <div className="loading">Loading expenses...</div>
        </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────
  if (error) {
    return (
        <div className="expenses-page">
          <div className="expenses-header">
            <div>
              <h1 className="page-title">Expenses</h1>
              <p className="subtitle">Manage and analyze your spending.</p>
            </div>
          </div>
          <div className="empty-state">{error}</div>
        </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────
  return (
      <div className="expenses-page">

        {/* Page header with title and Add button */}
        <div className="expenses-header">
          <div>
            <h1 className="page-title">Expenses</h1>
            <p className="subtitle">Manage and analyze your spending.</p>
          </div>
          <div className="expenses-actions">
            <button
                className="btn-accent"
                onClick={() => {
                  setEditing(null);    // clear any editing state
                  setModalOpen(true);  // open blank modal
                }}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Filter controls: search by title and filter by category */}
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
            {categories.map(c => (
                <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Show count of filtered results */}
          {(query || categoryFilter) && (
              <span style={{ color: 'var(--muted)', fontSize: '13px', alignSelf: 'center' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
          )}

          {/* Clear filters button — only shown when filters are active */}
          {(query || categoryFilter) && (
              <button
                  className="btn-inline"
                  onClick={() => {
                    setQuery('');
                    setCategoryFilter('');
                  }}
              >
                Clear Filters
              </button>
          )}
        </div>

        {/* Expense list for current page */}
        <ExpenseList
            items={paginated}
            onEdit={item => {
              setEditing(item);    // set item to edit
              setModalOpen(true);  // open modal with data
            }}
            onDelete={handleDelete}
        />

        {/* Pagination controls */}
        <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
        />

        {/* Add / Edit modal — animated mount and unmount */}
        <AnimatePresence>
          {modalOpen && (
              <ExpenseModal
                  key="expense-modal"
                  categories={categories}
                  initialData={editing}
                  onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                  onSubmit={data =>
                      editing
                          ? handleUpdate(editing.id, data)
                          : handleAdd(data)
                  }
              />
          )}
        </AnimatePresence>

      </div>
  );
}
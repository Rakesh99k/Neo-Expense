/**
 * Expenses
 * CRUD-focused page to browse, filter, paginate, add, edit, and delete expenses.
 * - Uses useExpenses() for data and mutations.
 * - Provides client-side filters and pagination for usability.
 */
import { useState, useMemo, useEffect } from 'react'; // local state and memoization
import { useExpenses } from '../hooks/useExpenses.js'; // CRUD and data for expenses
import ExpenseList from '../components/expenses/ExpenseList.jsx'; // list component
import ExpenseModal from '../components/expenses/ExpenseModal.jsx'; // add/edit modal
import Pagination from '../components/expenses/Pagination.jsx'; // pagination bar
import { AnimatePresence, motion } from 'framer-motion'; // modal animation

const categories = ['Food','Transport','Utilities','Entertainment','Health','Shopping','Travel','Other']; // available categories

export default function Expenses() { // main expenses CRUD page
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(); // data and mutations
  const [modalOpen, setModalOpen] = useState(false); // controls modal visibility
  const [editing, setEditing] = useState(null); // holds item being edited or null
  const [query, setQuery] = useState(''); // text search on title
  const [categoryFilter, setCategoryFilter] = useState(''); // category filter value
  const [page, setPage] = useState(1); // current page (1-based)
  const [pageSize, setPageSize] = useState(25); // rows per page

  const filtered = useMemo(() => { // apply text + category filters
    return expenses.filter(e => {
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false; // title match
      if (categoryFilter && e.category !== categoryFilter) return false; // category match
      return true; // include otherwise
    });
  }, [expenses, query, categoryFilter]); // recompute when inputs change

  // Reset page when filters or underlying data change
  useEffect(() => { setPage(1); }, [query, categoryFilter, pageSize, expenses.length]); // go back to first page

  const paginated = useMemo(() => { // slice results for current page
    const start = (page - 1) * pageSize; // start index
    return filtered.slice(start, start + pageSize); // window for current page
  }, [filtered, page, pageSize]); // dependencies

  function handleAdd(data) { // create new expense then close modal
    addExpense(data); // mutate via hook
    setModalOpen(false); // close
  }

  function handleUpdate(id, data) { // update existing expense then close
    updateExpense(id, data); // mutate via hook
    setModalOpen(false); // close
    setEditing(null); // clear edit state
  }

  return (
    <div className="expenses-page"> {/* page container */}
      <div className="expenses-header"> {/* header and action */}
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="subtitle">Manage and analyze your spending.</p>
        </div>
        <div className="expenses-actions"> {/* add button */}
          <button className="btn-accent" onClick={() => { setEditing(null); setModalOpen(true); }}>+ Add Expense</button>
        </div>
      </div>

      <div className="filters-row"> {/* filter controls */}
        <input
          className="filter-input" // style class
            placeholder="Search title..." // placeholder text
            value={query} // controlled value
            onChange={e => setQuery(e.target.value)} // update query
        />
        <select
          className="filter-select" // style class
            value={categoryFilter} // current filter value
            onChange={e => setCategoryFilter(e.target.value)} // update filter
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)} {/* category options */}
        </select>
      </div>

      <ExpenseList
        items={paginated} // current page items
        onEdit={item => { setEditing(item); setModalOpen(true); }} // open modal for edit
        onDelete={id => deleteExpense(id)} // delete handler
      />

      <Pagination
        page={page} // current page
        pageSize={pageSize} // rows per page
        total={filtered.length} // total rows after filters
        onPageChange={setPage} // update page
        onPageSizeChange={setPageSize} // update page size
      />

      <AnimatePresence> {/* animate modal mount/unmount */}
        {modalOpen && (
          <ExpenseModal
            key="modal" // animation key
            categories={categories} // category list
            initialData={editing} // null for add, object for edit
            onClose={() => { setModalOpen(false); setEditing(null); }} // close handler
            onSubmit={data => editing ? handleUpdate(editing.id, data) : handleAdd(data)} // add/update
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Reports
 * Advanced filtering and export page.
 * - Filters by category, amount range, and date range.
 * - Exports filtered results to PDF or CSV using helpers in utils.
 */
import { useState, useMemo } from 'react'; // local filter state and memoization
import { useExpenses } from '../hooks/useExpenses.js'; // data source
import ReportTable from '../components/expenses/ReportTable.jsx'; // tabular results
import ReportSummary from '../components/expenses/ReportSummary.jsx'; // summary cards
import { AnimatePresence, motion } from 'framer-motion'; // enter animation for preview
import { exportToPDF, exportToCSV } from '../utils/reportExport.js'; // export helpers
import { format } from 'date-fns'; // timestamp for filenames

const categories = ['Food','Transport','Utilities','Entertainment','Health','Shopping','Travel','Other']; // category options

export default function Reports() { // reporting and export page
  const { expenses } = useExpenses(); // full dataset
  const [filters, setFilters] = useState({ // filter controls object
    category: '', // selected category value (empty = all)
    min: '', // minimum amount filter input
    max: '', // maximum amount filter input
    from: '', // start date ISO (yyyy-mm-dd)
    to: '' // end date ISO (yyyy-mm-dd)
  }); // end filters state initialization
  const [exporting, setExporting] = useState(false); // export in progress flag
  const [exportType, setExportType] = useState(''); // 'pdf' or 'csv' for UI

  const filtered = useMemo(() => { // compute filtered dataset
    return expenses.filter(e => { // iterate all expenses
      if (filters.category && e.category !== filters.category) return false; // category filter check
      if (filters.min && e.amount < parseFloat(filters.min)) return false; // min amount check
      if (filters.max && e.amount > parseFloat(filters.max)) return false; // max amount check
      if (filters.from && new Date(e.date) < new Date(filters.from)) return false; // start date check
      if (filters.to && new Date(e.date) > new Date(filters.to)) return false; // end date check
      return true; // include if all checks pass
    }); // end filter predicate
  }, [expenses, filters]); // recompute on changes

  async function handleExport(type) { // export filtered results
    setExporting(true); // lock UI
    setExportType(type); // track for button label
    try { // attempt export
      if (!filtered.length) return; // no-op if nothing to export
      const timestamp = format(new Date(), 'yyyyMMdd-HHmm'); // timestamp suffix
      if (type === 'pdf') { // PDF path
        const blob = await exportToPDF(filtered); // build PDF blob
        triggerDownload(blob, `expenses-report-${timestamp}.pdf`); // trigger PDF download
      } else if (type === 'csv') { // CSV path
        const blob = exportToCSV(filtered); // build CSV blob
        triggerDownload(blob, `expenses-report-${timestamp}.csv`); // trigger CSV download
      } // end type branch
    } finally { // always run cleanup
      setExporting(false); // unlock UI
      setExportType(''); // reset state
    }
  } // end handleExport

  function triggerDownload(blob, filename) { // helper to trigger file save
    const url = URL.createObjectURL(blob); // create temp URL
    const a = document.createElement('a'); // anchor element
    a.href = url; // link to blob
    a.download = filename; // filename hint
    document.body.appendChild(a); // append to DOM
    a.click(); // simulate click
    a.remove(); // cleanup element
    setTimeout(() => URL.revokeObjectURL(url), 2000); // release URL later
  } // end triggerDownload

  function setFilter(field, value) { // update a single filter field
    setFilters(f => ({ ...f, [field]: value })); // merge update
  } // end setFilter

  return ( // render UI
    <div className="reports-page"> {/* page container */}
      <div className="reports-header"> {/* title + subtitle container */}
        <div> {/* left header block */}
          <h1 className="page-title">Reports & Export</h1> {/* page title */}
          <p className="subtitle">Filter, preview, and export your expenses.</p> {/* subtitle */}
        </div> {/* end left header block */}
      </div> {/* end header */}
      <div className="filters-row"> {/* filter controls row */}
        <select className="filter-select" value={filters.category} onChange={e => setFilter('category', e.target.value)}> {/* category select */}
          <option value="">All Categories</option> {/* default any category */}
          {categories.map(c => <option key={c}>{c}</option>)} {/* category options */}
        </select> {/* end select */}
        <input className="filter-input" type="number" placeholder="Min Amount" value={filters.min} onChange={e => setFilter('min', e.target.value)} /> {/* min amount input */}
        <input className="filter-input" type="number" placeholder="Max Amount" value={filters.max} onChange={e => setFilter('max', e.target.value)} /> {/* max amount input */}
        <input className="filter-input" type="date" value={filters.from} onChange={e => setFilter('from', e.target.value)} /> {/* start date input */}
        <input className="filter-input" type="date" value={filters.to} onChange={e => setFilter('to', e.target.value)} /> {/* end date input */}
      </div> {/* end filters */}
      <div className="reports-actions"> {/* export buttons group */}
        <button className="btn-accent" disabled={exporting} onClick={() => handleExport('pdf')}> {/* export pdf button */}
          {exporting && exportType === 'pdf' ? 'Exporting PDF...' : 'Export PDF'} {/* label toggles */}
        </button> {/* end pdf button */}
        <button className="btn-accent" disabled={exporting} onClick={() => handleExport('csv')}> {/* export csv button */}
          {exporting && exportType === 'csv' ? 'Exporting CSV...' : 'Export CSV'} {/* label toggles */}
        </button> {/* end csv button */}
      </div> {/* end actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}> {/* animated preview section */}
        <ReportSummary items={filtered} /> {/* stats summary cards */}
        <ReportTable items={filtered} /> {/* detailed table */}
      </motion.div> {/* end animated section */}
    </div> /* end page container */
  ); // end render
} // end Reports component

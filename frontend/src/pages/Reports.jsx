import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { useExpenses } from '../hooks/useExpenses.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { CATEGORIES } from '../constants/index.js';
import { exportToPDF, exportToCSV } from '../utils/reportExport.js';
import { getCurrencySymbol } from '../utils/format.js';

import ReportSummary from '../components/expenses/ReportSummary.jsx';
import ReportTable from '../components/expenses/ReportTable.jsx';
import FilterSelect from '../components/ui/FilterSelect.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Reports() {
  const { expenses, loading } = useExpenses();
  const { prefs } = usePrefs();
  const currencySymbol = getCurrencySymbol(prefs.currency);

  const [filters, setFilters] = useState({
    category: '',
    min: '',
    max: '',
    from: '',
    to: ''
  });

  const [exporting, setExporting] = useState('');

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (filters.category && e.category !== filters.category) return false;
      if (filters.min && e.amount < parseFloat(filters.min)) return false;
      if (filters.max && e.amount > parseFloat(filters.max)) return false;
      if (filters.from && new Date(e.date) < new Date(filters.from)) return false;
      if (filters.to && new Date(e.date) > new Date(filters.to)) return false;
      return true;
    });
  }, [expenses, filters]);

  async function handleExport(type) {
    if (!filtered.length) {
      toast.error('No data to export. Adjust your filters.');
      return;
    }

    setExporting(type);
    try {
      const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
      const filename = `expenses-report-${timestamp}.${type}`;
      const blob = type === 'pdf'
        ? await exportToPDF(filtered)
        : exportToCSV(filtered);

      triggerDownload(blob, filename);
      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (err) {
      console.error('Export failed', err);
      toast.error(`Failed to export ${type.toUpperCase()}`);
    } finally {
      setExporting('');
    }
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function setFilter(field, value) {
    setFilters(f => ({ ...f, [field]: value }));
  }

  function clearFilters() {
    setFilters({ category: '', min: '', max: '', from: '', to: '' });
  }

  const hasActiveFilters =
    filters.category || filters.min || filters.max || filters.from || filters.to;

  if (loading) {
    return (
      <div className="reports-page">
        <LoadingSpinner fullPage message="Loading report data..." />
      </div>
    );
  }

  return (
    <div className="reports-page">
      <motion.div
        className="reports-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Reports &amp; Export</h1>
          <p className="page-subtitle">Filter, preview, and export your expenses</p>
        </div>
      </motion.div>

      <motion.div
        className="reports-filters-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="reports-filters-header">
          <h3>Filters</h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              Clear all
            </button>
          )}
        </div>

        <div className="reports-filters-grid">
          <FilterSelect
            value={filters.category}
            onChange={e => setFilter('category', e.target.value)}
            options={CATEGORIES}
            placeholder="All Categories"
          />

          {/* Min Amount */}
          <div className="input-wrapper">
            <span className="input-icon">
              <CurrencyIcon symbol={currencySymbol} />
            </span>
            <input
              className="input-field"
              type="number"
              placeholder="Min Amount"
              value={filters.min}
              onChange={e => setFilter('min', e.target.value)}
            />
          </div>

          {/* Max Amount */}
          <div className="input-wrapper">
            <span className="input-icon">
              <CurrencyIcon symbol={currencySymbol} />
            </span>
            <input
              className="input-field"
              type="number"
              placeholder="Max Amount"
              value={filters.max}
              onChange={e => setFilter('max', e.target.value)}
            />
          </div>

          {/* From Date */}
          <div className="input-wrapper">
            <span className="input-icon">
              <IconCalendar />
            </span>
            <input
              className="input-field"
              type="date"
              value={filters.from}
              onChange={e => setFilter('from', e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="input-wrapper">
            <span className="input-icon">
              <IconCalendar />
            </span>
            <input
              className="input-field"
              type="date"
              value={filters.to}
              onChange={e => setFilter('to', e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="reports-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GradientButton
          onClick={() => handleExport('pdf')}
          loading={exporting === 'pdf'}
          disabled={exporting !== ''}
          icon={<IconDownload />}
        >
          Export PDF
        </GradientButton>
        <GradientButton
          onClick={() => handleExport('csv')}
          loading={exporting === 'csv'}
          disabled={exporting !== ''}
          icon={<IconDownload />}
        >
          Export CSV
        </GradientButton>
      </motion.div>

      <ReportSummary items={filtered} />
      <ReportTable items={filtered} />
    </div>
  );
}

// Currency symbol as text icon
function CurrencyIcon({ symbol }) {
  return (
    <span style={{
      fontSize: '15px',
      fontWeight: 700,
      minWidth: '16px',
      textAlign: 'center',
      display: 'inline-block'
    }}>
      {symbol}
    </span>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}
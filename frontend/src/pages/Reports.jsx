import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import ReportTable from '../components/expenses/ReportTable.jsx';
import ReportSummary from '../components/expenses/ReportSummary.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { exportToPDF, exportToCSV } from '../utils/reportExport.js';
import { format } from 'date-fns';

const categories = ['Food','Transport','Utilities','Entertainment','Health','Shopping','Travel','Other'];

export default function Reports() {
  const { expenses } = useExpenses();
  const [filters, setFilters] = useState({
    category: '',
    min: '',
    max: '',
    from: '',
    to: ''
  });
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('');

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
    setExporting(true);
    setExportType(type);
    try {
      if (!filtered.length) return;
      const timestamp = format(new Date(), 'yyyyMMdd-HHmm');
      if (type === 'pdf') {
        const blob = await exportToPDF(filtered);
        triggerDownload(blob, `expenses-report-${timestamp}.pdf`);
      } else if (type === 'csv') {
        const blob = exportToCSV(filtered);
        triggerDownload(blob, `expenses-report-${timestamp}.csv`);
      }
    } finally {
      setExporting(false);
      setExportType('');
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

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1 className="page-title">Reports & Export</h1>
          <p className="subtitle">Filter, preview, and export your expenses.</p>
        </div>
      </div>
      <div className="filters-row">
        <select className="filter-select" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <input className="filter-input" type="number" placeholder="Min Amount" value={filters.min} onChange={e => setFilter('min', e.target.value)} />
        <input className="filter-input" type="number" placeholder="Max Amount" value={filters.max} onChange={e => setFilter('max', e.target.value)} />
        <input className="filter-input" type="date" value={filters.from} onChange={e => setFilter('from', e.target.value)} />
        <input className="filter-input" type="date" value={filters.to} onChange={e => setFilter('to', e.target.value)} />
      </div>
      <div className="reports-actions">
        <button className="btn-accent" disabled={exporting} onClick={() => handleExport('pdf')}>
          {exporting && exportType === 'pdf' ? 'Exporting PDF...' : 'Export PDF'}
        </button>
        <button className="btn-accent" disabled={exporting} onClick={() => handleExport('csv')}>
          {exporting && exportType === 'csv' ? 'Exporting CSV...' : 'Export CSV'}
        </button>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}>
        <ReportSummary items={filtered} />
        <ReportTable items={filtered} />
      </motion.div>
    </div>
  );
}

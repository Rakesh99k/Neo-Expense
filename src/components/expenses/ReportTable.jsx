import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/format.js';

export default function ReportTable({ items }) {
  return (
    <div className="report-table-wrapper">
      <div className="report-table-head">
        <span>Title</span>
        <span>Amount</span>
        <span>Category</span>
        <span>Date</span>
        <span>Notes</span>
      </div>
      {items.length === 0 && <div className="empty-state">No results for current filters.</div>}
      <div className="report-table-body">
        <AnimatePresence initial={false}>
          {items.map(row => (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: .25 }}
              className="report-row"
            >
              <span className="truncate" title={row.title}>{row.title}</span>
              <span>{formatCurrency(row.amount)}</span>
              <span>{row.category}</span>
              <span>{formatDate(row.date)}</span>
              <span className="truncate" title={row.notes}>{row.notes || '-'}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * ReportTable
 * Read-only tabular view of expenses for reporting/export previews.
 * Props:
 * - items: Array<Expense>
 */
import { motion, AnimatePresence } from 'framer-motion'; // row animations
import { formatCurrency, formatDate } from '../../utils/format.js'; // formatting helpers

export default function ReportTable({ items }) { // read-only table of filtered items
  return (
    <div className="report-table-wrapper"> {/* table container */}
      <div className="report-table-head"> {/* header row */}
        <span>Title</span> {/* title col */}
        <span>Amount</span> {/* amount col */}
        <span>Category</span> {/* category col */}
        <span>Date</span> {/* date col */}
        <span>Notes</span> {/* notes col */}
      </div>
      {items.length === 0 && <div className="empty-state">No results for current filters.</div>} {/* empty state */}
      <div className="report-table-body"> {/* body */}
        <AnimatePresence initial={false}> {/* animate rows */}
          {items.map(row => (
            <motion.div
              key={row.id} // stable key
              layout // layout animation
              initial={{ opacity: 0, y: 10 }} // enter up
              animate={{ opacity: 1, y: 0 }} // visible
              exit={{ opacity: 0, y: -10 }} // exit up
              transition={{ duration: .25 }} // timing
              className="report-row" // row styles
            >
              <span className="truncate" title={row.title}>{row.title}</span> {/* title cell */}
              <span>{formatCurrency(row.amount)}</span> {/* formatted amount */}
              <span>{row.category}</span> {/* category */}
              <span>{formatDate(row.date)}</span> {/* formatted date */}
              <span className="truncate" title={row.notes}>{row.notes || '-'}</span> {/* notes */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

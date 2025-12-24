/**
 * ReportSummary
 * Displays aggregated summary cards for a given set of expenses.
 * Props:
 * - items: Array<Expense>
 */
import { motion } from 'framer-motion'; // animate summary cards
import { formatCurrency } from '../../utils/format.js'; // currency formatting

export default function ReportSummary({ items }) { // summary metrics over items
  const stats = computeStats(items); // compute count/total/min/max
  const cards = [ // map to UI-friendly cards
    { label: 'Records', value: stats.count },
    { label: 'Total', value: formatCurrency(stats.total) },
    { label: 'Average', value: stats.count ? formatCurrency(stats.total / stats.count) : formatCurrency(0) },
    { label: 'Minimum', value: stats.count ? formatCurrency(stats.min) : formatCurrency(0) },
    { label: 'Maximum', value: stats.count ? formatCurrency(stats.max) : formatCurrency(0) }
  ];

  return (
    <div className="report-summary-grid"> {/* grid of stat cards */}
      {cards.map((c,i) => (
        <motion.div
          key={c.label} // key per summary item
          initial={{ opacity: 0, y: 12 }} // enter from below
          animate={{ opacity: 1, y: 0 }} // animate to position
          transition={{ delay: i * 0.05, duration: .35 }} // staggered entrance
          className="summary-card report-summary-card" // style classes
        >
          <div className="summary-label">{c.label}</div> {/* label */}
          <div className="summary-value">{c.value}</div> {/* value */}
        </motion.div>
      ))}
    </div>
  );
}

function computeStats(items) { // single-pass stats over items
  // Computes total, count, min, and max in a single pass
  if (!items.length) return { count: 0, total: 0, min: 0, max: 0 }; // empty defaults
  let total = 0, min = Infinity, max = -Infinity; // init accumulators
  for (const e of items) { // iterate items
    total += e.amount; // add to total
    if (e.amount < min) min = e.amount; // track minimum
    if (e.amount > max) max = e.amount; // track maximum
  }
  return { count: items.length, total, min, max }; // results
}

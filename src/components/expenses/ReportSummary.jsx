import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/format.js';

export default function ReportSummary({ items }) {
  const stats = computeStats(items);
  const cards = [
    { label: 'Records', value: stats.count },
    { label: 'Total', value: formatCurrency(stats.total) },
    { label: 'Average', value: stats.count ? formatCurrency(stats.total / stats.count) : formatCurrency(0) },
    { label: 'Minimum', value: stats.count ? formatCurrency(stats.min) : formatCurrency(0) },
    { label: 'Maximum', value: stats.count ? formatCurrency(stats.max) : formatCurrency(0) }
  ];

  return (
    <div className="report-summary-grid">
      {cards.map((c,i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: .35 }}
          className="summary-card report-summary-card"
        >
          <div className="summary-label">{c.label}</div>
          <div className="summary-value">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

function computeStats(items) {
  if (!items.length) return { count: 0, total: 0, min: 0, max: 0 };
  let total = 0, min = Infinity, max = -Infinity;
  for (const e of items) {
    total += e.amount;
    if (e.amount < min) min = e.amount;
    if (e.amount > max) max = e.amount;
  }
  return { count: items.length, total, min, max };
}

import StatCard from '../reports/StatCard.jsx';
import { usePrefs } from '../../hooks/usePrefs.js';

/**
 * ReportSummary
 * Row of 5 stat cards summarizing filtered expenses.
 */
export default function ReportSummary({ items }) {
  const { prefs } = usePrefs();
  const stats = computeStats(items);
  const symbol = getSymbol(prefs.currency);

  return (
    <div className="report-summary-grid">
      <StatCard
        label="Records"
        value={stats.count}
        delay={0}
        accent="purple"
      />
      <StatCard
        label="Total"
        value={stats.total}
        prefix={symbol}
        delay={0.05}
        accent="blue"
      />
      <StatCard
        label="Average"
        value={stats.count ? stats.total / stats.count : 0}
        prefix={symbol}
        delay={0.1}
        accent="pink"
      />
      <StatCard
        label="Minimum"
        value={stats.min}
        prefix={symbol}
        delay={0.15}
        accent="green"
      />
      <StatCard
        label="Maximum"
        value={stats.max}
        prefix={symbol}
        delay={0.2}
        accent="orange"
      />
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

function getSymbol(currency) {
  const map = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return map[currency] || '';
}
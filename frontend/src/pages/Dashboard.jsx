import { useExpenses } from '../hooks/useExpenses.js';
import SummaryCard from '../components/SummaryCard.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart.jsx';
import TotalExpenditureChart from '../components/charts/TotalExpenditureChart.jsx';
import { formatCurrency } from '../utils/format.js';
import { parseISO } from 'date-fns';

export default function Dashboard() {
  const { expenses, stats } = useExpenses();
  const now = new Date();
  const currentYear = now.getFullYear();

  // Aggregate category for current month
  const month = now.getMonth();
  const categoryMap = new Map();
  const monthlyTotalsMap = new Map();
  const yearlyTotalsMap = new Map();

  expenses.forEach(e => {
    const d = parseISO(e.date);
    if (d.getFullYear() === currentYear) {
      const monthKey = d.toLocaleString('default', { month: 'short' });
      yearlyTotalsMap.set(monthKey, (yearlyTotalsMap.get(monthKey) || 0) + e.amount);
      if (d.getMonth() === month) {
        categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
      }
    }
  });

  // If no real data, create placeholder synthetic dataset (not persisted)
  let categoryData = [...categoryMap.entries()].map(([name, value]) => ({ name, value }));
  let monthlyTrendData = [...yearlyTotalsMap.entries()].map(([name, value]) => ({ name, value }));
  let totalExpenditureData = monthlyTrendData; // same for now, could be different metrics later

  if (!expenses.length) {
    const placeholderMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentYear, now.getMonth() - (5 - i), 1);
      return date.toLocaleString('default', { month: 'short' });
    });
    monthlyTrendData = placeholderMonths.map(m => ({ name: m, value: Math.round(200 + Math.random() * 800) }));
    categoryData = ['Food', 'Travel', 'Utilities', 'Shopping'].map(c => ({ name: c, value: Math.round(50 + Math.random() * 300) }));
    totalExpenditureData = monthlyTrendData;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Real-time overview of your spending patterns</p>
      </div>
      <div className="summary-grid">
        <SummaryCard label="This Month" value={formatCurrency(stats.monthTotal)} accent="#11ffee" />
        <SummaryCard label="This Year" value={formatCurrency(stats.yearTotal)} accent="#ff6ec7" />
        <SummaryCard label="Expenses" value={stats.count} accent="#8e2de2" />
      </div>
      <div className="charts-grid">
        <CategoryPieChart data={categoryData} />
        <MonthlyTrendChart data={monthlyTrendData} />
        <TotalExpenditureChart data={totalExpenditureData} />
      </div>
    </div>
  );
}

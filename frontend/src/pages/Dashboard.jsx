/**
 * Dashboard
 * Overview page: key metrics and charts derived from expenses.
 * - Shows current month/year totals and count via SummaryCards.
 * - Renders Category, Monthly Trend, and Total Expenditure charts.
 */
import { useExpenses } from '../hooks/useExpenses.js'; // access expenses and stats
import SummaryCard from '../components/SummaryCard.jsx'; // metric card
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx'; // category pie
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart.jsx'; // monthly line chart
import TotalExpenditureChart from '../components/charts/TotalExpenditureChart.jsx'; // totals bar chart
import { formatCurrency } from '../utils/format.js'; // currency formatter
import { parseISO } from 'date-fns'; // parse ISO dates

export default function Dashboard() { // overview page
  const { expenses, stats } = useExpenses(); // raw data and derived stats
  const now = new Date(); // current date
  const currentYear = now.getFullYear(); // year boundary for aggregations

  // Aggregate category for current month
  const month = now.getMonth(); // 0-based month index
  const categoryMap = new Map(); // category -> amount (current month)
  const monthlyTotalsMap = new Map(); // reserved (unused here)
  const yearlyTotalsMap = new Map(); // month(short) -> amount (current year)

  expenses.forEach(e => { // one pass to build aggregates
    const d = parseISO(e.date); // parse ISO date
    if (d.getFullYear() === currentYear) { // include current year items
      const monthKey = d.toLocaleString('default', { month: 'short' }); // e.g., Jan, Feb
      yearlyTotalsMap.set(monthKey, (yearlyTotalsMap.get(monthKey) || 0) + e.amount); // sum per month
      if (d.getMonth() === month) { // also sum current month by category
        categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
      }
    }
  });

  // If no real data, create placeholder synthetic dataset (not persisted)
  let categoryData = [...categoryMap.entries()].map(([name, value]) => ({ name, value })); // pie data
  let monthlyTrendData = [...yearlyTotalsMap.entries()].map(([name, value]) => ({ name, value })); // line data
  let totalExpenditureData = monthlyTrendData; // same for now, could be different metrics later

  if (!expenses.length) { // placeholder if no data yet
    const placeholderMonths = Array.from({ length: 6 }, (_, i) => { // last 6 months
      const date = new Date(currentYear, now.getMonth() - (5 - i), 1); // month offset
      return date.toLocaleString('default', { month: 'short' }); // short month name
    });
    monthlyTrendData = placeholderMonths.map(m => ({ name: m, value: Math.round(200 + Math.random() * 800) })); // random values
    categoryData = ['Food', 'Travel', 'Utilities', 'Shopping'].map(c => ({ name: c, value: Math.round(50 + Math.random() * 300) })); // random per category
    totalExpenditureData = monthlyTrendData; // reuse for totals chart
  }

  return (
    <div className="dashboard"> {/* page container */}
      <div className="dashboard-header"> {/* title and subtitle */}
        <h1>Dashboard</h1>
        <p className="subtitle">Real-time overview of your spending patterns</p>
      </div>
      <div className="summary-grid"> {/* top summary cards */}
        <SummaryCard label="This Month" value={formatCurrency(stats.monthTotal)} accent="#11ffee" />
        <SummaryCard label="This Year" value={formatCurrency(stats.yearTotal)} accent="#ff6ec7" />
        <SummaryCard label="Expenses" value={stats.count} accent="#8e2de2" />
      </div>
      <div className="charts-grid"> {/* charts section */}
        <CategoryPieChart data={categoryData} />
        <MonthlyTrendChart data={monthlyTrendData} />
        <TotalExpenditureChart data={totalExpenditureData} />
      </div>
    </div>
  );
}

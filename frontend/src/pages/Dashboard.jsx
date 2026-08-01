import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseISO } from 'date-fns';

import { useExpenses } from '../hooks/useExpenses.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { useBudget } from '../hooks/useBudget.js';
import { formatCurrency } from '../utils/format.js';

import Greeting from '../components/ui/Greeting.jsx';
import MetricCard from '../components/dashboard/MetricCard.jsx';
import RecentExpenses from '../components/dashboard/RecentExpenses.jsx';
import BudgetCard from '../components/budget/BudgetCard.jsx';
import BudgetOnboarding from '../components/budget/BudgetOnboarding.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart.jsx';
import TotalExpenditureChart from '../components/charts/TotalExpenditureChart.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { useLending } from '../hooks/useLending.js';
import LendingSummaryWidget from '../components/dashboard/LendingSummaryWidget.jsx';

const DISMISS_KEY = 'et_budget_onboarding_dismissed';

export default function Dashboard() {
  const { expenses, stats, loading } = useExpenses();
  const { prefs } = usePrefs();
  const { budget, loading: budgetLoading } = useBudget();
  const { summary: lendingSummary } = useLending();

  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });

  function dismissOnboarding() {
    setOnboardingDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {}
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { categoryData, monthlyTrendData, avgExpense } = useMemo(() => {
    const catMap = new Map();
    const yearMap = new Map();

    expenses.forEach(e => {
      const d = parseISO(e.date);
      if (d.getFullYear() === currentYear) {
        const monthKey = d.toLocaleString('default', { month: 'short' });
        yearMap.set(monthKey, (yearMap.get(monthKey) || 0) + e.amount);

        if (d.getMonth() === currentMonth) {
          catMap.set(e.category, (catMap.get(e.category) || 0) + e.amount);
        }
      }
    });

    const catData = [...catMap.entries()].map(([name, value]) => ({ name, value }));
    const monthData = [...yearMap.entries()].map(([name, value]) => ({ name, value }));
    const avg = expenses.length ? stats.yearTotal / expenses.length : 0;

    if (!expenses.length) {
      const monthsPlaceholder = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(currentYear, currentMonth - (5 - i), 1);
        return date.toLocaleString('default', { month: 'short' });
      });
      return {
        categoryData: [
          { name: 'Food', value: 300 },
          { name: 'Travel', value: 200 },
          { name: 'Utilities', value: 150 },
          { name: 'Shopping', value: 100 }
        ],
        monthlyTrendData: monthsPlaceholder.map(m => ({
          name: m,
          value: Math.round(200 + Math.random() * 800)
        })),
        avgExpense: 0
      };
    }

    return {
      categoryData: catData,
      monthlyTrendData: monthData,
      avgExpense: avg
    };
  }, [expenses, currentYear, currentMonth, stats.yearTotal]);

  if (loading) {
    return (
        <div className="dashboard">
          <LoadingSpinner fullPage message="Loading your dashboard..." />
        </div>
    );
  }

  const showOnboarding = !budgetLoading && !budget.enabled && !onboardingDismissed;

  return (
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <Greeting />
            <p className="dashboard-subtitle">
              Here is an overview of your spending
            </p>
          </div>
          <motion.div
              className="dashboard-date-badge"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
          >
            <IconCalendar />
            <span>{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </motion.div>
        </div>

        {/* Budget onboarding banner (only if not enabled and not dismissed) */}
        <AnimatePresence>
          {showOnboarding && (
              <BudgetOnboarding onDismiss={dismissOnboarding} />
          )}
        </AnimatePresence>

        {/* Budget card (only if enabled) */}
        {budget.enabled && <BudgetCard budget={budget} />}

          {/* Lending widget (auto-hides when no active records) */}
          <LendingSummaryWidget summary={lendingSummary} />

        {/* Metric cards */}
        <div className="metrics-grid">
          <MetricCard
              label="This Month"
              value={stats.monthTotal}
              prefix={getSymbol(prefs.currency)}
              subtitle="Total spending"
              subtitleColor="muted"
              accent="purple"
              delay={0.1}
              icon={<IconTrendUp />}
          />
          <MetricCard
              label="This Year"
              value={stats.yearTotal}
              prefix={getSymbol(prefs.currency)}
              subtitle="Year to date"
              subtitleColor="muted"
              accent="blue"
              delay={0.2}
              icon={<IconCalendar />}
          />
          <MetricCard
              label="Total Expenses"
              value={stats.count}
              subtitle="All time entries"
              subtitleColor="muted"
              accent="pink"
              delay={0.3}
              icon={<IconList />}
              isNumber={true}
          />
          <MetricCard
              label="Avg. Expense"
              value={avgExpense}
              prefix={getSymbol(prefs.currency)}
              subtitle="Per transaction"
              subtitleColor="muted"
              accent="green"
              delay={0.4}
              icon={<IconAverage />}
          />
        </div>

        {/* Charts */}
        <div className="dashboard-charts">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <CategoryPieChart data={categoryData} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <MonthlyTrendChart data={monthlyTrendData} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <TotalExpenditureChart data={monthlyTrendData} />
          </motion.div>
        </div>

        <RecentExpenses expenses={expenses} />
      </div>
  );
}

function getSymbol(currency) {
  const map = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return map[currency] || '';
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

function IconTrendUp() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
  );
}

function IconList() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
  );
}

function IconAverage() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
      </svg>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

import { useBudget } from '../hooks/useBudget.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { getCurrencySymbol } from '../utils/format.js';

import BudgetProgress from '../components/budget/BudgetProgress.jsx';
import BudgetEditModal from '../components/budget/BudgetEditModal.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Budget() {
    const { budget, loading, error, updateBudget } = useBudget();
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [modalOpen, setModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="budget-page">
                <LoadingSpinner fullPage message="Loading budget..." />
            </div>
        );
    }

    const dailyBudget = budget.daysLeftInMonth > 0 && budget.currentMonthRemaining > 0
        ? budget.currentMonthRemaining / budget.daysLeftInMonth
        : 0;

    return (
        <div className="budget-page">

            {/* Header */}
            <motion.div
                className="budget-page-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="page-title">Monthly Budget</h1>
                    <p className="page-subtitle">
                        Set spending limits and build savings
                    </p>
                </div>
                <div>
                    <GradientButton
                        onClick={() => setModalOpen(true)}
                        icon={<IconEdit />}
                    >
                        {budget.enabled ? 'Edit Budget' : 'Set Budget'}
                    </GradientButton>
                </div>
            </motion.div>

            {/* Not enabled state */}
            {!budget.enabled && (
                <motion.div
                    className="budget-empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="budget-empty-icon">
                        <IconTarget />
                    </div>
                    <h2 className="budget-empty-title">No budget set</h2>
                    <p className="budget-empty-desc">
                        Set a monthly budget to track your spending and automatically build savings.
                        Unused budget at the end of each month goes into your savings.
                    </p>
                    <GradientButton
                        onClick={() => setModalOpen(true)}
                        icon={<IconArrow />}
                    >
                        Get Started
                    </GradientButton>
                </motion.div>
            )}

            {/* Enabled state */}
            {budget.enabled && (
                <>
                    {/* Main summary card */}
                    <motion.div
                        className="budget-summary-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="budget-summary-header">
                            <div>
                                <div className="budget-summary-label">This Month's Budget</div>
                                <div className="budget-summary-amount">
                                    <span className="budget-summary-symbol">{symbol}</span>
                                    <CountUp
                                        end={budget.monthlyAmount}
                                        duration={1.2}
                                        separator=","
                                        decimals={0}
                                        preserveValue
                                    />
                                </div>
                            </div>
                            <div className={`budget-summary-badge budget-summary-badge-${budget.status}`}>
                                {getStatusLabel(budget.status)}
                            </div>
                        </div>

                        <BudgetProgress
                            spent={budget.currentMonthSpent}
                            total={budget.monthlyAmount}
                            status={budget.status}
                            showLabels={false}
                        />

                        <div className="budget-summary-stats">
                            <div className="budget-summary-stat">
                                <div className="budget-summary-stat-label">Spent</div>
                                <div className="budget-summary-stat-value">
                                    {symbol}
                                    <CountUp
                                        end={budget.currentMonthSpent}
                                        duration={1}
                                        separator=","
                                        decimals={0}
                                        preserveValue
                                    />
                                </div>
                            </div>

                            <div className="budget-summary-stat">
                                <div className="budget-summary-stat-label">Remaining</div>
                                <div className={`budget-summary-stat-value ${
                                    budget.currentMonthRemaining < 0 ? 'is-negative' : 'is-positive'
                                }`}>
                                    {symbol}
                                    <CountUp
                                        end={budget.currentMonthRemaining}
                                        duration={1}
                                        separator=","
                                        decimals={0}
                                        preserveValue
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Insight cards */}
                    <div className="budget-insights-grid">
                        <motion.div
                            className="budget-insight-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="budget-insight-icon">
                                <IconCalendar />
                            </div>
                            <div className="budget-insight-value">
                                {budget.daysLeftInMonth}
                            </div>
                            <div className="budget-insight-label">
                                Days left in month
                            </div>
                        </motion.div>

                        <motion.div
                            className="budget-insight-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <div className="budget-insight-icon">
                                <IconWallet />
                            </div>
                            <div className="budget-insight-value">
                                {symbol}{Math.round(dailyBudget).toLocaleString('en-IN')}
                            </div>
                            <div className="budget-insight-label">
                                Available per day
                            </div>
                        </motion.div>

                        <motion.div
                            className="budget-insight-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="budget-insight-icon">
                                <IconTrendUp />
                            </div>
                            <div className="budget-insight-value">
                                {budget.monthlyAmount > 0
                                    ? Math.round((budget.currentMonthSpent / budget.monthlyAmount) * 100)
                                    : 0}%
                            </div>
                            <div className="budget-insight-label">
                                Budget used
                            </div>
                        </motion.div>
                    </div>

                    {/* Tip */}
                    <motion.div
                        className="budget-tip"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="budget-tip-icon">💡</span>
                        <div>
                            <strong>Tip:</strong> Unused budget at month end automatically goes into your{' '}
                            <Link to="/savings" className="auth-link">Savings</Link>.
                            Track your progress there to see how much you've saved over time.
                        </div>
                    </motion.div>
                </>
            )}

            {/* Edit modal */}
            <AnimatePresence>
                {modalOpen && (
                    <BudgetEditModal
                        budget={budget}
                        onClose={() => setModalOpen(false)}
                        onSave={updateBudget}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function getStatusLabel(status) {
    const map = {
        ok: 'On track',
        warning: 'Watch out',
        danger: 'Almost there',
        exceeded: 'Over budget',
        disabled: 'Not set'
    };
    return map[status] || 'Unknown';
}

// ── Icons ──────────────────────────────────────────
function IconTarget() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    );
}

function IconEdit() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    );
}

function IconArrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}

function IconWallet() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
            <path d="M21 12h-4a2 2 0 0 0 0 4h4"></path>
        </svg>
    );
}

function IconTrendUp() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    );
}
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useSavings } from '../hooks/useSavings.js';
import { useBudget } from '../hooks/useBudget.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { getCurrencySymbol } from '../utils/format.js';

import SavingsCard from '../components/savings/SavingsCard.jsx';
import MonthlyHistoryList from '../components/savings/MonthlyHistoryList.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Savings() {
    const { savings, loading, error } = useSavings();
    const { budget } = useBudget();
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    if (loading) {
        return (
            <div className="savings-page">
                <LoadingSpinner fullPage message="Loading savings..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="savings-page">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <div className="empty-state-title">Something went wrong</div>
                    <div className="empty-state-message">{error}</div>
                </div>
            </div>
        );
    }

    const hasNoData = savings.totalSaved === 0 && savings.history.length === 0;

    return (
        <div className="savings-page">

            {/* Header */}
            <motion.div
                className="savings-page-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="page-title">Savings</h1>
                    <p className="page-subtitle">
                        Money you saved from unused budget
                    </p>
                </div>
            </motion.div>

            {/* No budget → onboarding */}
            {!budget.enabled && (
                <motion.div
                    className="savings-onboarding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="savings-onboarding-icon">
                        <IconPiggyBank />
                    </div>
                    <h2 className="savings-onboarding-title">Start saving automatically</h2>
                    <p className="savings-onboarding-desc">
                        Enable your monthly budget to automatically build savings.
                        Whatever you don't spend from your budget becomes your savings.
                    </p>
                    <Link to="/budget">
                        <GradientButton icon={<IconArrow />}>
                            Set Up Budget
                        </GradientButton>
                    </Link>
                </motion.div>
            )}

            {/* Has budget → show savings */}
            {budget.enabled && (
                <>
                    <SavingsCard
                        totalSaved={savings.totalSaved}
                        projected={savings.currentMonthProjected}
                    />

                    {/* Explanation card */}
                    {hasNoData && (
                        <motion.div
                            className="savings-info"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="savings-info-icon">💡</span>
                            <div>
                                <strong>How savings work:</strong> On the 1st of every month,
                                any unused portion of your monthly budget is added to your total
                                savings. Your first snapshot will appear after your current month ends.
                            </div>
                        </motion.div>
                    )}

                    <MonthlyHistoryList history={savings.history} />

                    {/* Tips card */}
                    {savings.history.length > 0 && (
                        <motion.div
                            className="savings-tips-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="savings-tips-header">
                                <span className="savings-tips-icon">🎯</span>
                                <h3>Keep Saving More</h3>
                            </div>
                            <ul className="savings-tips-list">
                                <li>Review your <Link to="/reports" className="auth-link">Reports</Link> to spot spending patterns</li>
                                <li>Set up <Link to="/recurring" className="auth-link">Recurring</Link> expenses so nothing surprises you</li>
                                <li>Adjust your <Link to="/budget" className="auth-link">Budget</Link> if you're consistently saving more or less</li>
                            </ul>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}

function IconPiggyBank() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2 0-.4-.2-2-.2-2C15 3 12.5 2 10 2S5 3 5 5c0 1 .2 1.5 1 2v3l-2 1v3l2 1c-.7.5-1 1-1 2v2c0 1 1 2 2 2h1l1 2h4l1-2h4c1 0 2-1 2-2v-2c0-.5-.3-1-1-1.5.5-.4 1-1 1-1.5V8c0-2-2-3-2-3z"></path>
            <path d="M2 9v1"></path>
            <path d="M9 3h2"></path>
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
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

import BudgetProgress from './BudgetProgress.jsx';
import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';

/**
 * BudgetCard
 * Prominent card on Dashboard showing budget health.
 * Only rendered when budget is enabled.
 */
export default function BudgetCard({ budget }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const remaining = budget.currentMonthRemaining || 0;
    const dailyBudget = budget.daysLeftInMonth > 0
        ? remaining / budget.daysLeftInMonth
        : 0;

    return (
        <motion.div
            className="budget-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="budget-card-header">
                <div>
                    <div className="budget-card-label">Monthly Budget</div>
                    <div className="budget-card-amount">
                        <span className="budget-card-symbol">{symbol}</span>
                        <CountUp
                            end={budget.monthlyAmount || 0}
                            duration={1.2}
                            separator=","
                            decimals={0}
                            preserveValue
                        />
                    </div>
                </div>

                <Link to="/budget" className="budget-card-manage">
                    Manage
                    <IconArrow />
                </Link>
            </div>

            <BudgetProgress
                spent={budget.currentMonthSpent}
                total={budget.monthlyAmount}
                status={budget.status}
                showLabels={true}
            />

            <div className="budget-card-footer">
                <div className="budget-card-stat">
                    <div className="budget-card-stat-label">Spent</div>
                    <div className="budget-card-stat-value">
                        {symbol}
                        <CountUp
                            end={budget.currentMonthSpent || 0}
                            duration={1}
                            separator=","
                            decimals={0}
                            preserveValue
                        />
                    </div>
                </div>

                <div className="budget-card-stat">
                    <div className="budget-card-stat-label">Remaining</div>
                    <div className={`budget-card-stat-value ${remaining < 0 ? 'is-negative' : ''}`}>
                        {symbol}
                        <CountUp
                            end={remaining}
                            duration={1}
                            separator=","
                            decimals={0}
                            preserveValue
                        />
                    </div>
                </div>

                <div className="budget-card-stat">
                    <div className="budget-card-stat-label">
                        {budget.daysLeftInMonth} days left
                    </div>
                    <div className="budget-card-stat-value budget-card-stat-daily">
                        {symbol}
                        {dailyBudget > 0 ? Math.round(dailyBudget).toLocaleString('en-IN') : 0}
                        <span className="budget-card-stat-suffix">/day</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function IconArrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';

/**
 * MonthlyHistoryList
 * List of past monthly snapshots showing budget vs spent vs saved.
 * Props:
 *   history[] — array of { year, month, monthLabel, budgetAmount, spentAmount, savedAmount }
 */
export default function MonthlyHistoryList({ history = [] }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    if (!history.length) {
        return (
            <div className="savings-history-empty">
                <div className="savings-history-empty-icon">📅</div>
                <div className="savings-history-empty-title">No history yet</div>
                <div className="savings-history-empty-desc">
                    Your monthly savings will appear here on the 1st of each new month.
                    Keep tracking your expenses to build your first snapshot.
                </div>
            </div>
        );
    }

    return (
        <div className="savings-history">
            <div className="savings-history-header">
                <h3>Monthly History</h3>
                <span className="savings-history-count">
          {history.length} month{history.length !== 1 ? 's' : ''}
        </span>
            </div>

            <div className="savings-history-list">
                {history.map((item, i) => {
                    const percentUsed = item.budgetAmount > 0
                        ? Math.round((item.spentAmount / item.budgetAmount) * 100)
                        : 0;

                    return (
                        <motion.div
                            key={`${item.year}-${item.month}`}
                            className="savings-history-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="savings-history-month">
                                <div className="savings-history-month-label">
                                    {item.monthLabel}
                                </div>
                                <div className="savings-history-month-percent">
                                    {percentUsed}% of budget used
                                </div>
                            </div>

                            <div className="savings-history-stats">
                                <div className="savings-history-stat">
                                    <div className="savings-history-stat-label">Budget</div>
                                    <div className="savings-history-stat-value">
                                        {symbol}{item.budgetAmount.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                <div className="savings-history-stat">
                                    <div className="savings-history-stat-label">Spent</div>
                                    <div className="savings-history-stat-value">
                                        {symbol}{item.spentAmount.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                <div className="savings-history-stat savings-history-stat-highlight">
                                    <div className="savings-history-stat-label">Saved</div>
                                    <div className="savings-history-stat-value savings-history-stat-saved">
                                        +{symbol}
                                        <CountUp
                                            end={item.savedAmount}
                                            duration={1}
                                            separator=","
                                            decimals={0}
                                            preserveValue
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';

/**
 * LendingSummaryWidget
 * Compact widget shown on Dashboard when user has active lending records.
 * Auto-hides when there's nothing to show.
 */
export default function LendingSummaryWidget({ summary }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    // Auto-hide if no active records
    const hasActive = summary.activeLentCount > 0 || summary.activeBorrowedCount > 0;
    if (!hasActive) return null;

    const isPositive = summary.netPosition >= 0;

    return (
        <motion.div
            className="lending-widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="lending-widget-header">
                <div>
                    <div className="lending-widget-label">Lending Overview</div>
                    <div className="lending-widget-subtitle">
                        {summary.activeLentCount + summary.activeBorrowedCount} active record
                        {(summary.activeLentCount + summary.activeBorrowedCount) !== 1 ? 's' : ''}
                    </div>
                </div>
                <Link to="/lending" className="lending-widget-view">
                    View all
                    <IconArrow />
                </Link>
            </div>

            <div className="lending-widget-grid">
                {/* Owed to you */}
                {summary.activeLentCount > 0 && (
                    <div className="lending-widget-stat lending-widget-stat-lent">
                        <div className="lending-widget-stat-icon">
                            <IconArrowUp />
                        </div>
                        <div>
                            <div className="lending-widget-stat-label">Owed to you</div>
                            <div className="lending-widget-stat-value">
                                {symbol}
                                <CountUp
                                    end={summary.owedToYou}
                                    duration={1}
                                    separator=","
                                    decimals={0}
                                    preserveValue
                                />
                            </div>
                            <div className="lending-widget-stat-count">
                                {summary.activeLentCount} record{summary.activeLentCount !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                )}

                {/* You owe */}
                {summary.activeBorrowedCount > 0 && (
                    <div className="lending-widget-stat lending-widget-stat-borrowed">
                        <div className="lending-widget-stat-icon">
                            <IconArrowDown />
                        </div>
                        <div>
                            <div className="lending-widget-stat-label">You owe</div>
                            <div className="lending-widget-stat-value">
                                {symbol}
                                <CountUp
                                    end={summary.youOwe}
                                    duration={1}
                                    separator=","
                                    decimals={0}
                                    preserveValue
                                />
                            </div>
                            <div className="lending-widget-stat-count">
                                {summary.activeBorrowedCount} record{summary.activeBorrowedCount !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                )}

                {/* Net position */}
                <div className={`lending-widget-stat lending-widget-stat-net ${
                    isPositive ? 'net-positive' : 'net-negative'
                }`}>
                    <div className="lending-widget-stat-icon">
                        {isPositive ? <IconTrendUp /> : <IconTrendDown />}
                    </div>
                    <div>
                        <div className="lending-widget-stat-label">Net position</div>
                        <div className="lending-widget-stat-value">
                            {isPositive ? '+' : '-'}
                            {symbol}
                            <CountUp
                                end={Math.abs(summary.netPosition)}
                                duration={1}
                                separator=","
                                decimals={0}
                                preserveValue
                            />
                        </div>
                        <div className="lending-widget-stat-count">
                            {isPositive ? 'in your favor' : 'you owe more'}
                        </div>
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

function IconArrowUp() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    );
}

function IconArrowDown() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    );
}

function IconTrendUp() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    );
}

function IconTrendDown() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
    );
}
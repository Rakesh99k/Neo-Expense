import { motion } from 'framer-motion';
import CountUp from 'react-countup';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';

/**
 * SavingsCard
 * Displays total saved amount with big impressive display.
 * Props:
 *   totalSaved — number
 *   projected — current month projected savings
 */
export default function SavingsCard({ totalSaved, projected }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    return (
        <motion.div
            className="savings-hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="savings-hero-content">
                <div className="savings-hero-label">Total Saved</div>
                <div className="savings-hero-amount">
                    <span className="savings-hero-symbol">{symbol}</span>
                    <CountUp
                        end={totalSaved}
                        duration={1.5}
                        separator=","
                        decimals={0}
                        preserveValue
                    />
                </div>
                <div className="savings-hero-sub">
                    Accumulated from unused budget
                </div>
            </div>

            {projected > 0 && (
                <motion.div
                    className="savings-projected-card"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="savings-projected-icon">
                        <IconTrendUp />
                    </div>
                    <div>
                        <div className="savings-projected-label">This Month Projected</div>
                        <div className="savings-projected-amount">
                            <span>+{symbol}</span>
                            <CountUp
                                end={projected}
                                duration={1}
                                separator=","
                                decimals={0}
                                preserveValue
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Decorative background */}
            <div className="savings-hero-glow" />
        </motion.div>
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
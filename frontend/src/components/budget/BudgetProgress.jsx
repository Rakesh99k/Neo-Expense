import { motion } from 'framer-motion';

/**
 * BudgetProgress
 * Visual progress bar showing spent vs budget.
 * Props:
 *   spent — number
 *   total — number (budget amount)
 *   status — 'ok' | 'warning' | 'danger' | 'exceeded' | 'disabled'
 *   showLabels — whether to show ₹ labels above bar
 */
export default function BudgetProgress({
                                           spent = 0,
                                           total = 0,
                                           status = 'ok',
                                           showLabels = true
                                       }) {
    const percent = total > 0
        ? Math.min(100, Math.max(0, (spent / total) * 100))
        : 0;

    const overPercent = total > 0 && spent > total
        ? Math.min(100, ((spent - total) / total) * 100)
        : 0;

    return (
        <div className="budget-progress">
            {showLabels && (
                <div className="budget-progress-labels">
          <span className="budget-progress-percent">
            {Math.round((spent / total) * 100) || 0}% used
          </span>
                    <span className={`budget-progress-status budget-progress-status-${status}`}>
            {getStatusLabel(status, spent, total)}
          </span>
                </div>
            )}

            <div className={`budget-progress-track budget-progress-track-${status}`}>
                {/* Main filled bar */}
                <motion.div
                    className={`budget-progress-fill budget-progress-fill-${status}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Overspending indicator (if over budget) */}
                {overPercent > 0 && (
                    <motion.div
                        className="budget-progress-over"
                        initial={{ width: 0 }}
                        animate={{ width: `${overPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    />
                )}
            </div>
        </div>
    );
}

function getStatusLabel(status, spent, total) {
    if (status === 'disabled') return 'Budget not set';
    if (status === 'exceeded') return `Over by ${((spent - total) / total * 100).toFixed(0)}%`;
    if (status === 'danger') return 'Almost at limit';
    if (status === 'warning') return 'Approaching limit';
    return 'On track';
}
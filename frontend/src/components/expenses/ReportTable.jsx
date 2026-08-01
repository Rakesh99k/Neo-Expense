import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { usePrefs } from '../../hooks/usePrefs.js';
import { getPaymentMethod } from '../../constants/index.js';

export default function ReportTable({ items }) {
    const { prefs } = usePrefs();

    if (items.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No results found</div>
                <div className="empty-state-message">
                    Try adjusting your filters to see more results
                </div>
            </div>
        );
    }

    return (
        <div className="report-table">
            <div className="report-table-header report-table-header-desktop">
                <div>Title</div>
                <div>Amount</div>
                <div>Category</div>
                <div>Payment</div>
                <div>Date</div>
            </div>

            <div className="report-table-body">
                <AnimatePresence initial={false}>
                    {items.map((row, i) => {
                        const payment = getPaymentMethod(row.paymentMethod);
                        return (
                            <motion.div
                                key={row.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: i * 0.02 }}
                            >
                                <div className="report-row report-row-desktop">
                                    <span className="truncate" title={row.title}>{row.title}</span>
                                    <span className="report-amount">
                    {formatCurrency(row.amount, prefs.currency)}
                  </span>
                                    <span className="expense-badge">{row.category}</span>
                                    <span className="report-payment" style={{ color: payment.color }}>
                    {payment.icon} {payment.label}
                  </span>
                                    <span className="report-date">{formatDate(row.date)}</span>
                                </div>

                                <div className="report-card-mobile">
                                    <div className="report-card-top">
                                        <div>
                                            <div className="report-card-title">{row.title}</div>
                                            <div className="report-card-meta">
                                                <span className="expense-badge">{row.category}</span>
                                                <span>{formatDate(row.date)}</span>
                                            </div>
                                            <div
                                                className="expense-payment-badge"
                                                style={{ color: payment.color, marginTop: '6px' }}
                                            >
                                                {payment.icon} {payment.label}
                                            </div>
                                        </div>
                                        <div className="report-card-amount">
                                            {formatCurrency(row.amount, prefs.currency)}
                                        </div>
                                    </div>
                                    {row.notes && (
                                        <div className="report-card-notes">{row.notes}</div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
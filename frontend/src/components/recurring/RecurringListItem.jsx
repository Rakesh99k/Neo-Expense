import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { usePrefs } from '../../hooks/usePrefs.js';
import {
    formatCurrency,
    getCurrencySymbol
} from '../../utils/format.js';
import {
    getPaymentMethod,
    DAYS_OF_WEEK,
    MONTHS_OF_YEAR
} from '../../constants/index.js';

export default function RecurringListItem({
                                              item,
                                              onEdit,
                                              onDelete,
                                              onTogglePause,
                                              onGenerateNow
                                          }) {
    const { prefs } = usePrefs();
    const payment = getPaymentMethod(item.paymentMethod);
    const scheduleText = getScheduleText(item);

    return (
        <motion.div
            className={`recurring-item ${!item.active ? 'recurring-item-paused' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
        >
            <div className="recurring-item-left">
                <div className="recurring-item-emoji">
                    {getCategoryEmoji(item.category)}
                </div>
                <div className="recurring-item-info">
                    <div className="recurring-item-title">
                        {item.title}
                        {!item.active && (
                            <span className="recurring-item-badge recurring-item-badge-paused">
                Paused
              </span>
                        )}
                    </div>
                    <div className="recurring-item-meta">
                        <span>{item.category}</span>
                        <span className="recurring-item-dot">·</span>
                        <span>{scheduleText}</span>
                    </div>
                    <div className="recurring-item-payment">
            <span className="payment-mini-badge" style={{ color: payment.color }}>
              {payment.icon} {payment.label}
            </span>
                    </div>
                </div>
            </div>

            <div className="recurring-item-amount">
                {formatCurrency(item.amount, prefs.currency)}
            </div>

            <div className="recurring-item-next">
                <div className="recurring-item-next-label">Next</div>
                <div className="recurring-item-next-date">
                    {format(new Date(item.nextDueAt), 'MMM d, yyyy')}
                </div>
            </div>

            <div className="recurring-item-actions">
                {item.active && (
                    <button
                        className="row-action-btn row-action-primary"
                        onClick={onGenerateNow}
                        aria-label="Add expense now"
                        title="Add expense now (don't wait for schedule)"
                    >
                        <IconZap />
                    </button>
                )}
                <button
                    className="row-action-btn"
                    onClick={onTogglePause}
                    aria-label={item.active ? 'Pause' : 'Resume'}
                    title={item.active ? 'Pause' : 'Resume'}
                >
                    {item.active ? <IconPause /> : <IconPlay />}
                </button>
                <button
                    className="row-action-btn"
                    onClick={onEdit}
                    aria-label="Edit"
                >
                    <IconEdit />
                </button>
                <button
                    className="row-action-btn row-action-danger"
                    onClick={onDelete}
                    aria-label="Delete"
                >
                    <IconTrash />
                </button>
            </div>
        </motion.div>
    );
}

function getScheduleText(item) {
    switch (item.frequency) {
        case 'WEEKLY': {
            const day = DAYS_OF_WEEK.find(d => d.value === item.dayOfWeek);
            return `Every ${day?.label || 'week'}`;
        }
        case 'MONTHLY':
            return `Every month on ${ordinal(item.dayOfMonth)}`;
        case 'YEARLY': {
            const month = MONTHS_OF_YEAR.find(m => m.value === item.monthOfYear);
            return `Every ${month?.label || 'year'} ${ordinal(item.dayOfMonth)}`;
        }
        default:
            return 'Recurring';
    }
}

function ordinal(n) {
    if (!n) return '';
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getCategoryEmoji(category) {
    const map = {
        Food: '🍔',
        Transport: '🚗',
        Utilities: '💡',
        Entertainment: '🎬',
        Health: '💊',
        Shopping: '🛍️',
        Travel: '✈️',
        Other: '📝'
    };
    return map[category] || '💰';
}

function IconEdit() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    );
}

function IconTrash() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    );
}

function IconPause() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
    );
}

function IconPlay() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    );
}

function IconZap() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    );
}
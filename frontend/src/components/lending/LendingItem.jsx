import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { usePrefs } from '../../hooks/usePrefs.js';
import { formatCurrency } from '../../utils/format.js';

/**
 * LendingItem
 * Single lending record with payment history, actions.
 * Props:
 *   lending — the lending record
 *   onEdit, onDelete, onRecordPayment
 */
export default function LendingItem({
                                        lending,
                                        onEdit,
                                        onDelete,
                                        onRecordPayment
                                    }) {
    const { prefs } = usePrefs();

    const isLent = lending.type === 'LENT';
    const isSettled = lending.status === 'SETTLED';
    const isPartial = lending.status === 'PARTIAL';

    const progress = lending.originalAmount > 0
        ? (lending.returnedAmount / lending.originalAmount) * 100
        : 0;

    return (
        <motion.div
            className={`lending-item ${isSettled ? 'lending-item-settled' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
        >
            {/* Header row */}
            <div className="lending-item-header">
                <div className="lending-item-person">
                    <div className={`lending-item-avatar ${isLent ? 'lending-avatar-lent' : 'lending-avatar-borrowed'}`}>
                        {getInitial(lending.personName)}
                    </div>
                    <div>
                        <div className="lending-item-name">
                            {lending.personName}
                        </div>
                        <div className="lending-item-meta">
              <span className={`lending-badge lending-badge-${isLent ? 'lent' : 'borrowed'}`}>
                {isLent ? '↑ Lent' : '↓ Borrowed'}
              </span>
                            <span>·</span>
                            <span>{format(new Date(lending.date), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>

                <div className="lending-item-status">
                    {isSettled && (
                        <span className="lending-status-badge lending-status-settled">
              ✓ Settled
            </span>
                    )}
                    {isPartial && (
                        <span className="lending-status-badge lending-status-partial">
              Partial
            </span>
                    )}
                    {!isSettled && !isPartial && (
                        <span className="lending-status-badge lending-status-active">
              Active
            </span>
                    )}
                </div>
            </div>

            {/* Amount + progress */}
            <div className="lending-item-body">
                <div className="lending-amounts-row">
                    <div className="lending-amount-block">
                        <div className="lending-amount-label">Original</div>
                        <div className="lending-amount-value">
                            {formatCurrency(lending.originalAmount, prefs.currency)}
                        </div>
                    </div>

                    <div className="lending-amount-block">
                        <div className="lending-amount-label">Returned</div>
                        <div className="lending-amount-value">
                            {formatCurrency(lending.returnedAmount, prefs.currency)}
                        </div>
                    </div>

                    <div className="lending-amount-block">
                        <div className="lending-amount-label">
                            {isSettled ? 'Done' : 'Remaining'}
                        </div>
                        <div className={`lending-amount-value lending-amount-remaining ${
                            isSettled ? 'is-settled' : ''
                        }`}>
                            {formatCurrency(lending.remainingAmount, prefs.currency)}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="lending-progress-track">
                    <motion.div
                        className={`lending-progress-fill ${
                            isSettled ? 'lending-progress-fill-settled' : ''
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>

                {/* Notes if present */}
                {lending.notes && (
                    <div className="lending-item-notes">
                        <IconNote /> {lending.notes}
                    </div>
                )}

                {/* Payment history (collapsible) */}
                {lending.payments && lending.payments.length > 0 && (
                    <details className="lending-payments-history">
                        <summary>
                            {lending.payments.length} payment{lending.payments.length !== 1 ? 's' : ''} recorded
                        </summary>
                        <div className="lending-payments-list">
                            {lending.payments.map((p, i) => (
                                <div key={p.id} className="lending-payment-row">
                  <span className="lending-payment-date">
                    {format(new Date(p.date), 'MMM d')}
                  </span>
                                    <span className="lending-payment-amount">
                    +{formatCurrency(p.amount, prefs.currency)}
                  </span>
                                    {p.notes && (
                                        <span className="lending-payment-notes">{p.notes}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>

            {/* Actions */}
            <div className="lending-item-actions">
                {!isSettled && (
                    <button
                        className="lending-action-btn lending-action-primary"
                        onClick={onRecordPayment}
                    >
                        <IconCheck />
                        Record Payment
                    </button>
                )}

                <button
                    className="lending-action-btn"
                    onClick={onEdit}
                    disabled={isSettled}
                    title={isSettled ? "Can't edit settled record" : "Edit"}
                >
                    <IconEdit />
                </button>

                <button
                    className="lending-action-btn lending-action-danger"
                    onClick={onDelete}
                    title="Delete"
                >
                    <IconTrash />
                </button>
            </div>
        </motion.div>
    );
}

function getInitial(name) {
    return (name || '?').trim().charAt(0).toUpperCase();
}

function IconCheck() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
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

function IconNote() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
    );
}
import { useState } from 'react';
import { motion } from 'framer-motion';

import { usePrefs } from '../../hooks/usePrefs.js';
import { formatCurrency, getCurrencySymbol } from '../../utils/format.js';
import InputWithIcon from '../ui/InputWithIcon.jsx';
import GradientButton from '../ui/GradientButton.jsx';

/**
 * PaymentModal
 * Record a partial or full return payment for a lending record.
 * Props:
 *   lending — the lending record (with remainingAmount)
 *   onSubmit — called with payment payload
 *   onClose
 */
export default function PaymentModal({ lending, onSubmit, onClose }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [form, setForm] = useState({
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const isLent = lending.type === 'LENT';
    const actionLabel = isLent ? 'Received from' : 'Paid to';

    function validate() {
        const e = {};
        const amt = parseFloat(form.amount);
        if (isNaN(amt) || amt <= 0) e.amount = 'Amount must be greater than 0';
        if (amt > lending.remainingAmount) {
            e.amount = `Max ${symbol}${lending.remainingAmount}`;
        }
        if (!form.date) e.date = 'Date is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                amount: parseFloat(form.amount),
                date: new Date(form.date).toISOString(),
                notes: form.notes.trim()
            });
        } finally {
            setSubmitting(false);
        }
    }

    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    function useFullAmount() {
        setField('amount', lending.remainingAmount);
    }

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <motion.div
                className="expense-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onMouseDown={e => e.stopPropagation()}
            >
                <div className="expense-modal-header">
                    <div className="expense-modal-icon expense-modal-icon-payment">
                        <IconCheck />
                    </div>
                    <div>
                        <h2>Record Payment</h2>
                        <p className="expense-modal-sub">
                            {actionLabel} {lending.personName}
                        </p>
                    </div>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                        type="button"
                    >
                        <IconX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="expense-modal-form">

                    {/* Balance info */}
                    <div className="payment-balance-card">
                        <div className="payment-balance-row">
                            <span className="payment-balance-label">Original amount</span>
                            <span className="payment-balance-value">
                {formatCurrency(lending.originalAmount, prefs.currency)}
              </span>
                        </div>
                        <div className="payment-balance-row">
                            <span className="payment-balance-label">Already returned</span>
                            <span className="payment-balance-value">
                {formatCurrency(lending.returnedAmount, prefs.currency)}
              </span>
                        </div>
                        <div className="payment-balance-row payment-balance-row-highlight">
                            <span className="payment-balance-label">Remaining</span>
                            <span className="payment-balance-value payment-balance-remaining">
                {formatCurrency(lending.remainingAmount, prefs.currency)}
              </span>
                        </div>
                    </div>

                    {/* Amount + quick full */}
                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="input-label">Payment Amount</label>
                            <button
                                type="button"
                                className="payment-full-btn"
                                onClick={useFullAmount}
                            >
                                Use full amount
                            </button>
                        </div>
                        <div className={`input-wrapper ${errors.amount ? 'has-error' : ''}`}>
              <span className="input-icon">
                <CurrencyIcon symbol={symbol} />
              </span>
                            <input
                                type="number"
                                className="input-field"
                                value={form.amount}
                                onChange={e => setField('amount', e.target.value)}
                                placeholder="0.00"
                                autoFocus
                                max={lending.remainingAmount}
                            />
                        </div>
                        {errors.amount && (
                            <span className="input-error">{errors.amount}</span>
                        )}
                    </div>

                    <InputWithIcon
                        label="Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={e => setField('date', e.target.value)}
                        icon={<IconCalendar />}
                        error={errors.date}
                    />

                    <div className="input-group">
                        <label className="input-label">Notes (optional)</label>
                        <textarea
                            rows="2"
                            value={form.notes}
                            onChange={e => setField('notes', e.target.value)}
                            placeholder="e.g., Paid via UPI"
                            className="input-field textarea-field"
                        />
                    </div>

                    <div className="expense-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <GradientButton type="submit" loading={submitting}>
                            Record Payment
                        </GradientButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function CurrencyIcon({ symbol }) {
    return (
        <span style={{
            fontSize: '16px',
            fontWeight: 700,
            minWidth: '18px',
            textAlign: 'center',
            display: 'inline-block'
        }}>
      {symbol}
    </span>
    );
}

function IconCheck() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}

function IconX() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}
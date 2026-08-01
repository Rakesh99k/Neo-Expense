import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
    CATEGORIES,
    PAYMENT_METHODS,
    RECURRING_FREQUENCIES,
    DAYS_OF_WEEK,
    MONTHS_OF_YEAR,
    getLastPaymentMethod,
    saveLastPaymentMethod
} from '../../constants/index.js';
import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';
import InputWithIcon from '../ui/InputWithIcon.jsx';
import GradientButton from '../ui/GradientButton.jsx';

/**
 * RecurringModal
 * Create or edit a recurring expense template.
 */
export default function RecurringModal({ initialData, onSubmit, onClose }) {
    const { prefs } = usePrefs();
    const currencySymbol = getCurrencySymbol(prefs.currency);

    const [form, setForm] = useState(() => initialData || {
        title: '',
        amount: '',
        category: CATEGORIES[0],
        paymentMethod: getLastPaymentMethod(),
        notes: '',
        frequency: 'MONTHLY',
        dayOfMonth: new Date().getDate(),
        dayOfWeek: 1,
        monthOfYear: 1
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title,
                amount: initialData.amount,
                category: initialData.category,
                paymentMethod: initialData.paymentMethod || 'CASH',
                notes: initialData.notes || '',
                frequency: initialData.frequency,
                dayOfMonth: initialData.dayOfMonth || new Date().getDate(),
                dayOfWeek: initialData.dayOfWeek || 1,
                monthOfYear: initialData.monthOfYear || 1
            });
        }
    }, [initialData]);

    function validate() {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        const amt = parseFloat(form.amount);
        if (isNaN(amt) || amt <= 0) e.amount = 'Amount must be greater than 0';
        if (!form.category) e.category = 'Category is required';
        if (!form.frequency) e.frequency = 'Frequency is required';

        if (form.frequency === 'MONTHLY' && !form.dayOfMonth) {
            e.dayOfMonth = 'Day of month required';
        }
        if (form.frequency === 'WEEKLY' && !form.dayOfWeek) {
            e.dayOfWeek = 'Day of week required';
        }
        if (form.frequency === 'YEARLY' && (!form.dayOfMonth || !form.monthOfYear)) {
            e.dayOfMonth = 'Day and month required';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                title: form.title.trim(),
                amount: parseFloat(form.amount),
                category: form.category,
                paymentMethod: form.paymentMethod,
                notes: form.notes.trim(),
                frequency: form.frequency,
                dayOfMonth: form.frequency === 'WEEKLY' ? null : form.dayOfMonth,
                dayOfWeek: form.frequency === 'WEEKLY' ? form.dayOfWeek : null,
                monthOfYear: form.frequency === 'YEARLY' ? form.monthOfYear : null
            };

            await onSubmit(payload);
            saveLastPaymentMethod(form.paymentMethod);
        } finally {
            setSubmitting(false);
        }
    }

    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    const isEdit = !!initialData;

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
                    <div className="expense-modal-icon">
                        <IconRefresh />
                    </div>
                    <div>
                        <h2>{isEdit ? 'Edit Recurring' : 'New Recurring Expense'}</h2>
                        <p className="expense-modal-sub">
                            {isEdit ? 'Update recurring template' : 'Auto-add this expense on schedule'}
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
                    <InputWithIcon
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={e => setField('title', e.target.value)}
                        placeholder="e.g., Netflix, Rent, Gym"
                        icon={<IconTag />}
                        error={errors.title}
                    />

                    <div className="expense-modal-row">
                        <InputWithIcon
                            label="Amount"
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={e => setField('amount', e.target.value)}
                            placeholder="0.00"
                            icon={<CurrencyIcon symbol={currencySymbol} />}
                            error={errors.amount}
                        />

                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><IconGrid /></span>
                                <select
                                    className="input-field"
                                    value={form.category}
                                    onChange={e => setField('category', e.target.value)}
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className="input-group">
                        <label className="input-label">Payment Method</label>
                        <div className="payment-method-grid">
                            {PAYMENT_METHODS.map(pm => (
                                <button
                                    key={pm.id}
                                    type="button"
                                    className={`payment-method-chip ${
                                        form.paymentMethod === pm.id ? 'active' : ''
                                    }`}
                                    onClick={() => setField('paymentMethod', pm.id)}
                                >
                                    <span className="payment-method-icon">{pm.icon}</span>
                                    <span className="payment-method-label">{pm.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="input-group">
                        <label className="input-label">Repeats</label>
                        <div className="frequency-picker">
                            {RECURRING_FREQUENCIES.map(f => (
                                <button
                                    key={f.id}
                                    type="button"
                                    className={`frequency-chip ${
                                        form.frequency === f.id ? 'active' : ''
                                    }`}
                                    onClick={() => setField('frequency', f.id)}
                                >
                                    <div className="frequency-chip-label">{f.label}</div>
                                    <div className="frequency-chip-desc">{f.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frequency-specific fields */}
                    {form.frequency === 'MONTHLY' && (
                        <div className="input-group">
                            <label className="input-label">Day of Month</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><IconCalendar /></span>
                                <select
                                    className="input-field"
                                    value={form.dayOfMonth}
                                    onChange={e => setField('dayOfMonth', Number(e.target.value))}
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{ordinal(d)}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="input-hint">
                Auto-add on the {ordinal(form.dayOfMonth)} of every month
              </span>
                        </div>
                    )}

                    {form.frequency === 'WEEKLY' && (
                        <div className="input-group">
                            <label className="input-label">Day of Week</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><IconCalendar /></span>
                                <select
                                    className="input-field"
                                    value={form.dayOfWeek}
                                    onChange={e => setField('dayOfWeek', Number(e.target.value))}
                                >
                                    {DAYS_OF_WEEK.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="input-hint">
                Auto-add every {DAYS_OF_WEEK.find(d => d.value === form.dayOfWeek)?.label}
              </span>
                        </div>
                    )}

                    {form.frequency === 'YEARLY' && (
                        <div className="expense-modal-row">
                            <div className="input-group">
                                <label className="input-label">Month</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><IconCalendar /></span>
                                    <select
                                        className="input-field"
                                        value={form.monthOfYear}
                                        onChange={e => setField('monthOfYear', Number(e.target.value))}
                                    >
                                        {MONTHS_OF_YEAR.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Day</label>
                                <div className="input-wrapper">
                                    <span className="input-icon"><IconCalendar /></span>
                                    <select
                                        className="input-field"
                                        value={form.dayOfMonth}
                                        onChange={e => setField('dayOfMonth', Number(e.target.value))}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                            <option key={d} value={d}>{ordinal(d)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Notes (optional)</label>
                        <textarea
                            rows="2"
                            value={form.notes}
                            onChange={e => setField('notes', e.target.value)}
                            placeholder="Add any additional details..."
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
                            {isEdit ? 'Save Changes' : 'Create Recurring'}
                        </GradientButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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

function IconRefresh() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
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

function IconTag() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
    );
}

function IconGrid() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
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
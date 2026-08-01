import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';
import InputWithIcon from '../ui/InputWithIcon.jsx';
import GradientButton from '../ui/GradientButton.jsx';

export default function LendingModal({
                                         initialData,
                                         knownPersons = [],
                                         onSubmit,
                                         onClose
                                     }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [form, setForm] = useState(() => initialData ? {
        type: initialData.type,
        personName: initialData.personName,
        originalAmount: initialData.originalAmount,
        notes: initialData.notes || '',
        date: initialData.date.slice(0, 10)
    } : {
        type: 'LENT',
        personName: '',
        originalAmount: '',
        notes: '',
        date: getLocalDateString()
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                type: initialData.type,
                personName: initialData.personName,
                originalAmount: initialData.originalAmount,
                notes: initialData.notes || '',
                date: initialData.date.slice(0, 10)
            });
        }
    }, [initialData]);

    const suggestions = knownPersons
        .filter(name =>
            form.personName &&
            name.toLowerCase().includes(form.personName.toLowerCase()) &&
            name.toLowerCase() !== form.personName.toLowerCase()
        )
        .slice(0, 5);

    function validate() {
        const e = {};
        if (!form.personName.trim()) e.personName = 'Person name is required';
        const amt = parseFloat(form.originalAmount);
        if (isNaN(amt) || amt <= 0) e.originalAmount = 'Amount must be greater than 0';
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
                type: form.type,
                personName: form.personName.trim(),
                originalAmount: parseFloat(form.originalAmount),
                notes: form.notes.trim(),
                date: new Date(form.date).toISOString()
            });
        } finally {
            setSubmitting(false);
        }
    }

    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    const isEdit = !!initialData;
    const isLent = form.type === 'LENT';

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
                    <div className={`expense-modal-icon ${isLent ? '' : 'expense-modal-icon-borrowed'}`}>
                        {isLent ? <IconArrowUp /> : <IconArrowDown />}
                    </div>
                    <div>
                        <h2>{isEdit ? 'Edit' : 'Record'} {isLent ? 'Lending' : 'Borrowing'}</h2>
                        <p className="expense-modal-sub">
                            {isLent
                                ? 'Money you gave to someone'
                                : 'Money you owe to someone'}
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

                    <div className="input-group">
                        <label className="input-label">Type</label>
                        <div className="lending-type-toggle">
                            <button
                                type="button"
                                className={`lending-type-btn ${isLent ? 'active lending-type-btn-lent' : ''}`}
                                onClick={() => setField('type', 'LENT')}
                            >
                                <IconArrowUp />
                                <div>
                                    <div className="lending-type-btn-title">Lent</div>
                                    <div className="lending-type-btn-desc">Money you gave</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`lending-type-btn ${!isLent ? 'active lending-type-btn-borrowed' : ''}`}
                                onClick={() => setField('type', 'BORROWED')}
                            >
                                <IconArrowDown />
                                <div>
                                    <div className="lending-type-btn-title">Borrowed</div>
                                    <div className="lending-type-btn-desc">Money you owe</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="input-group" style={{ position: 'relative' }}>
                        <label className="input-label">Person Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><IconUser /></span>
                            <input
                                type="text"
                                className="input-field"
                                value={form.personName}
                                onChange={e => {
                                    setField('personName', e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="e.g., John, Alice"
                                autoComplete="off"
                            />
                        </div>
                        {errors.personName && (
                            <span className="input-error">{errors.personName}</span>
                        )}

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="autocomplete-dropdown">
                                {suggestions.map(name => (
                                    <button
                                        key={name}
                                        type="button"
                                        className="autocomplete-item"
                                        onMouseDown={() => {
                                            setField('personName', name);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <IconUser />
                                        <span>{name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="expense-modal-row">
                        <InputWithIcon
                            label="Amount"
                            name="originalAmount"
                            type="number"
                            value={form.originalAmount}
                            onChange={e => setField('originalAmount', e.target.value)}
                            placeholder="0.00"
                            icon={<CurrencyIcon symbol={symbol} />}
                            error={errors.originalAmount}
                        />

                        <InputWithIcon
                            label="Date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={e => setField('date', e.target.value)}
                            icon={<IconCalendar />}
                            error={errors.date}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Notes (optional)</label>
                        <textarea
                            rows="2"
                            value={form.notes}
                            onChange={e => setField('notes', e.target.value)}
                            placeholder="What was it for?"
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
                            {isEdit ? 'Save Changes' : 'Save'}
                        </GradientButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

/**
 * Return today's date in YYYY-MM-DD format using LOCAL time zone.
 */
function getLocalDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

function IconArrowUp() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    );
}

function IconArrowDown() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
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
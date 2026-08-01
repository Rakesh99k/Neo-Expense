import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';
import GradientButton from '../ui/GradientButton.jsx';

/**
 * BudgetEditModal
 * Modal to set/update monthly budget amount and enable/disable it.
 */
export default function BudgetEditModal({
                                            budget,
                                            onClose,
                                            onSave
                                        }) {
    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [amount, setAmount] = useState(budget.monthlyAmount || '');
    const [enabled, setEnabled] = useState(budget.enabled);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        if (enabled && (isNaN(numAmount) || numAmount <= 0)) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await onSave(enabled, enabled ? numAmount : 0);
            toast.success(
                enabled
                    ? `Budget set to ${symbol}${Number(numAmount).toLocaleString('en-IN')}`
                    : 'Budget disabled'
            );
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to save budget');
            toast.error('Could not save budget');
        } finally {
            setSaving(false);
        }
    }

    const suggestions = [10000, 20000, 30000, 50000, 100000];

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <motion.div
                className="expense-modal budget-edit-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onMouseDown={e => e.stopPropagation()}
            >
                <div className="expense-modal-header">
                    <div className="expense-modal-icon">
                        <IconTarget />
                    </div>
                    <div>
                        <h2>Set Monthly Budget</h2>
                        <p className="expense-modal-sub">
                            Track spending against this limit
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
                    {/* Enable toggle */}
                    <div className="budget-toggle-row">
                        <div>
                            <div className="budget-toggle-label">Enable Budget</div>
                            <div className="budget-toggle-desc">
                                Turn off to hide budget tracking
                            </div>
                        </div>
                        <button
                            type="button"
                            className={`toggle-switch ${enabled ? 'toggle-switch-on' : ''}`}
                            onClick={() => setEnabled(!enabled)}
                            aria-label={enabled ? 'Disable budget' : 'Enable budget'}
                        >
                            <span className="toggle-switch-slider" />
                        </button>
                    </div>

                    {/* Amount input */}
                    {enabled && (
                        <>
                            <div className="input-group">
                                <label className="input-label">Monthly Amount</label>
                                <div className="input-wrapper">
                  <span className="input-icon">
                    <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        minWidth: '18px',
                        textAlign: 'center'
                    }}>
                      {symbol}
                    </span>
                  </span>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="e.g., 30000"
                                        autoFocus
                                        min="0"
                                        step="100"
                                    />
                                </div>
                                {error && <span className="input-error">{error}</span>}
                            </div>

                            {/* Quick preset chips */}
                            <div className="budget-suggestions">
                                <div className="budget-suggestions-label">Quick pick:</div>
                                <div className="budget-suggestions-chips">
                                    {suggestions.map(val => (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`budget-chip ${
                                                Number(amount) === val ? 'budget-chip-active' : ''
                                            }`}
                                            onClick={() => setAmount(val)}
                                        >
                                            {symbol}{val.toLocaleString('en-IN')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="expense-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <GradientButton
                            type="submit"
                            loading={saving}
                        >
                            Save Budget
                        </GradientButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function IconTarget() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
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
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { usePrefs } from '../../hooks/usePrefs.js';
import { getCurrencySymbol } from '../../utils/format.js';
import {
  PAYMENT_METHODS,
  getLastPaymentMethod,
  saveLastPaymentMethod
} from '../../constants/index.js';
import InputWithIcon from '../ui/InputWithIcon.jsx';
import GradientButton from '../ui/GradientButton.jsx';

export default function ExpenseModal({
                                       initialData,
                                       onSubmit,
                                       onClose,
                                       categories
                                     }) {
  const { prefs } = usePrefs();
  const currencySymbol = getCurrencySymbol(prefs.currency);

  const [form, setForm] = useState(() => initialData || {
    title: '',
    amount: '',
    category: categories[0],
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    paymentMethod: getLastPaymentMethod()
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        date: initialData.date.slice(0, 10),
        paymentMethod: initialData.paymentMethod || 'CASH'
      });
    }
  }, [initialData]);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) e.amount = 'Amount must be greater than 0';
    if (!form.category) e.category = 'Category is required';
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
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        date: new Date(form.date).toISOString(),
        notes: form.notes.trim(),
        paymentMethod: form.paymentMethod
      });
      // Remember payment method for next expense
      saveLastPaymentMethod(form.paymentMethod);
    } finally {
      setSubmitting(false);
    }
  }

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  const isEdit = !!initialData;
  const isCreditCard = form.paymentMethod === 'CREDIT_CARD';

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
              <IconWallet />
            </div>
            <div>
              <h2>{isEdit ? 'Edit Expense' : 'Add New Expense'}</h2>
              <p className="expense-modal-sub">
                {isEdit ? 'Update your expense details' : 'Track a new expense'}
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
                placeholder="e.g., Lunch, Movie, Grocery"
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
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                    <span className="input-error">{errors.category}</span>
                )}
              </div>
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

            {/* NEW: Payment method picker */}
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

              {/* Credit card warning */}
              {isCreditCard && (
                  <motion.div
                      className="payment-warning"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                  >
                    <span>💡</span>
                    <div>
                      <strong>Credit Card tip:</strong> Add individual purchases here.
                      Don't add the monthly bill payment separately — that would count twice.
                    </div>
                  </motion.div>
              )}
            </div>

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
                {isEdit ? 'Save Changes' : 'Add Expense'}
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

function IconWallet() {
  return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
        <path d="M21 12h-4a2 2 0 0 0 0 4h4"></path>
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
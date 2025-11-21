import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ExpenseModal({ initialData, onSubmit, onClose, categories }) {
  const [form, setForm] = useState(() => initialData || {
    title: '', amount: '', category: categories[0], date: new Date().toISOString().slice(0,10), notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setForm({ ...initialData, date: initialData.date.slice(0,10) });
  }, [initialData]);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) e.amount = 'Amount > 0 required';
    if (!form.category) e.category = 'Category required';
    if (!form.date) e.date = 'Date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: new Date(form.date).toISOString(),
      notes: form.notes.trim()
    });
  }

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <motion.div
        onMouseDown={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: .35 }}
        className="modal-card"
      >
        <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-row">
            <label>Title</label>
            <input value={form.title} onChange={e => setField('title', e.target.value)} />
            {errors.title && <span className="err">{errors.title}</span>}
          </div>
          <div className="form-row">
            <label>Amount</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setField('amount', e.target.value)} />
            {errors.amount && <span className="err">{errors.amount}</span>}
          </div>
          <div className="form-row">
            <label>Category</label>
            <select value={form.category} onChange={e => setField('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <span className="err">{errors.category}</span>}
          </div>
          <div className="form-row">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
            {errors.date && <span className="err">{errors.date}</span>}
          </div>
          <div className="form-row">
            <label>Notes</label>
            <textarea rows="3" value={form.notes} onChange={e => setField('notes', e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-inline">Cancel</button>
            <button type="submit" className="btn-accent">{initialData ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

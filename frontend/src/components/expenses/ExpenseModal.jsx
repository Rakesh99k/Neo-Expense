/**
 * ExpenseModal
 * Modal dialog for creating or editing an expense with client-side validation.
 * Props:
 * - initialData?: Expense (if provided, edits existing)
 * - categories: string[]
 * - onSubmit: (payload) => void
 * - onClose: () => void
 */
import { useState, useEffect } from 'react'; // local form state and lifecycle
import { motion } from 'framer-motion'; // modal entrance/exit animations

export default function ExpenseModal({ initialData, onSubmit, onClose, categories }) { // create/edit modal
  const [form, setForm] = useState(() => initialData || { // initialize from initialData or defaults
    title: '', amount: '', category: categories[0], date: new Date().toISOString().slice(0,10), notes: ''
  });
  const [errors, setErrors] = useState({}); // validation errors

  useEffect(() => { // when editing, seed form with incoming data
    if (initialData) setForm({ ...initialData, date: initialData.date.slice(0,10) }); // keep date input in yyyy-mm-dd
  }, [initialData]);

  function validate() {
    // Basic required-field validation and numeric checks
    const e = {};
    if (!form.title.trim()) e.title = 'Title required';
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) e.amount = 'Amount > 0 required';
    if (!form.category) e.category = 'Category required';
    if (!form.date) e.date = 'Date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) { // submit handler
    ev.preventDefault(); // prevent full page reload
    if (!validate()) return; // stop if invalid
    onSubmit({ // pass normalized payload to parent
      title: form.title.trim(), // trimmed title
      amount: parseFloat(form.amount), // numeric amount
      category: form.category, // category string
      date: new Date(form.date).toISOString(), // ISO date
      notes: form.notes.trim() // trimmed notes
    });
  }

  function setField(field, value) { // generic setter for form fields
    setForm(f => ({ ...f, [field]: value })); // copy and update key
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}> {/* backdrop closes on click */}
      <motion.div
        onMouseDown={e => e.stopPropagation()} // stop backdrop click from firing when clicking inside
        initial={{ opacity: 0, y: 30 }} // enter from below
        animate={{ opacity: 1, y: 0 }} // animate to center
        exit={{ opacity: 0, y: -20 }} // exit upward
        transition={{ duration: .35 }} // timing curve
        className="modal-card" // card styles
      >
        <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2> {/* dynamic title */}
        <form onSubmit={handleSubmit} className="expense-form"> {/* form element */}
          <div className="form-row"> {/* title field */}
            <label>Title</label>
            <input value={form.title} onChange={e => setField('title', e.target.value)} />
            {errors.title && <span className="err">{errors.title}</span>}
          </div>
          <div className="form-row"> {/* amount field */}
            <label>Amount</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setField('amount', e.target.value)} />
            {errors.amount && <span className="err">{errors.amount}</span>}
          </div>
          <div className="form-row"> {/* category field */}
            <label>Category</label>
            <select value={form.category} onChange={e => setField('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <span className="err">{errors.category}</span>}
          </div>
          <div className="form-row"> {/* date field */}
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
            {errors.date && <span className="err">{errors.date}</span>}
          </div>
          <div className="form-row"> {/* notes field */}
            <label>Notes</label>
            <textarea rows="3" value={form.notes} onChange={e => setField('notes', e.target.value)} />
          </div>
          <div className="form-actions"> {/* actions */}
            <button type="button" onClick={onClose} className="btn-inline">Cancel</button>
            <button type="submit" className="btn-accent">{initialData ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

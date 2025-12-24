/**
 * ExpenseItem
 * Renders a single expense row with formatted fields and actions.
 * Props:
 * - item: { id, title, amount, category, date, notes }
 * - onEdit: () => void
 * - onDelete: () => void
 */
import { formatCurrency, formatDate } from '../../utils/format.js'; // helpers for number/date formatting
import { motion } from 'framer-motion'; // hover animation for title

export default function ExpenseItem({ item, onEdit, onDelete }) { // single row of the expense list
  return (
    <div className="expense-row"> {/* grid row */}
      <div className="cell title-cell"> {/* title/notes column */}
        <motion.div whileHover={{ x: 4 }} className="expense-title">{item.title}</motion.div> {/* shift on hover */}
        {item.notes && <div className="expense-notes">{item.notes}</div>} {/* optional notes */}
      </div>
      <div className="cell col-amt">{formatCurrency(item.amount)}</div> {/* amount formatted */}
      <div className="cell col-cat">{item.category}</div> {/* category */}
      <div className="cell col-date">{formatDate(item.date)}</div> {/* date formatted */}
      <div className="cell col-actions"> {/* actions column */}
        <button className="btn-inline" onClick={onEdit}>Edit</button> {/* open edit modal */}
        <button className="btn-inline danger" onClick={onDelete}>Delete</button> {/* delete row */}
      </div>
    </div>
  );
}

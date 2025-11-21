import { formatCurrency, formatDate } from '../../utils/format.js';
import { motion } from 'framer-motion';

export default function ExpenseItem({ item, onEdit, onDelete }) {
  return (
    <div className="expense-row">
      <div className="cell title-cell">
        <motion.div whileHover={{ x: 4 }} className="expense-title">{item.title}</motion.div>
        {item.notes && <div className="expense-notes">{item.notes}</div>}
      </div>
      <div className="cell col-amt">{formatCurrency(item.amount)}</div>
      <div className="cell col-cat">{item.category}</div>
      <div className="cell col-date">{formatDate(item.date)}</div>
      <div className="cell col-actions">
        <button className="btn-inline" onClick={onEdit}>Edit</button>
        <button className="btn-inline danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

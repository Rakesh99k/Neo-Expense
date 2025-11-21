import { motion, AnimatePresence } from 'framer-motion';
import ExpenseItem from './ExpenseItem.jsx';

export default function ExpenseList({ items, onEdit, onDelete }) {
  if (!items.length) return <div className="empty-state">No expenses yet. Add your first!</div>;
  return (
    <div className="expense-list">
      <div className="expense-list-head">
        <span>Title</span>
        <span className="col-amt">Amount</span>
        <span className="col-cat">Category</span>
        <span className="col-date">Date</span>
        <span className="col-actions">Actions</span>
      </div>
      <AnimatePresence initial={false}>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: .96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .9 }}
            transition={{ duration: .25 }}
            className="expense-row-wrapper"
          >
            <ExpenseItem item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

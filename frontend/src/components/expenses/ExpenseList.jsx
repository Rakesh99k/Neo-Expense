import { motion, AnimatePresence } from 'framer-motion';
import ExpenseItem from './ExpenseItem.jsx';

/**
 * ExpenseList
 * Renders expenses as table (desktop) or cards (mobile).
 */
export default function ExpenseList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-state-icon">📭</div>
        <div className="empty-state-title">No expenses found</div>
        <div className="empty-state-message">
          Try adjusting your filters or add a new expense
        </div>
      </motion.div>
    );
  }

  return (
    <div className="expense-list">
      {/* Desktop table header */}
      <div className="expense-list-header expense-list-header-desktop">
        <div>Title</div>
        <div>Amount</div>
        <div>Category</div>
        <div>Date</div>
        <div>Actions</div>
      </div>

      {/* Rows */}
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
          >
            <ExpenseItem
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
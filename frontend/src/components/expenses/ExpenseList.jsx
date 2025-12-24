/**
 * ExpenseList
 * Virtual-ish list of expenses with animated insert/remove.
 * Props:
 * - items: Array<Expense>
 * - onEdit: (item) => void
 * - onDelete: (id) => void
 */
import { motion, AnimatePresence } from 'framer-motion'; // layout/entry/exit animations
import ExpenseItem from './ExpenseItem.jsx'; // row component

export default function ExpenseList({ items, onEdit, onDelete }) { // list of expense rows with header
  if (!items.length) return <div className="empty-state">No expenses match the current filters.</div>; // empty state
  return (
    <div className="expense-list"> {/* container */}
      <div className="expense-list-head"> {/* header grid */}
        <span>Title</span> {/* title col */}
        <span className="col-amt">Amount</span> {/* amount col */}
        <span className="col-cat">Category</span> {/* category col */}
        <span className="col-date">Date</span> {/* date col */}
        <span className="col-actions">Actions</span> {/* actions col */}
      </div>
      <AnimatePresence initial={false}> {/* animate add/remove */}
        {items.map(item => (
          <motion.div
            key={item.id} // key for animation and list rendering
            layout // enable FLIP layout animations
            initial={{ opacity: 0, scale: .96 }} // entering state
            animate={{ opacity: 1, scale: 1 }} // animate to visible
            exit={{ opacity: 0, scale: .9 }} // exiting state
            transition={{ duration: .25 }} // timing
            className="expense-row-wrapper" // wrapper around the row
          >
            <ExpenseItem item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} /> {/* row */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

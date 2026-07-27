/**
 * ExpenseItem
 * Renders a single expense row with formatted fields and actions.
 * Props:
 * - item: { id, title, amount, category, date, notes }
 * - onEdit: () => void
 * - onDelete: () => void
 */
import { formatCurrency, formatDate } from '../../utils/format.js';
import { usePrefs } from '../../hooks/usePrefs.js';
import { motion } from 'framer-motion';

export default function ExpenseItem({ item, onEdit, onDelete }) {
    const { prefs } = usePrefs(); // get shared currency

    return (
        <div className="expense-row">
            <div className="cell title-cell">
                <motion.div whileHover={{ x: 4 }} className="expense-title">
                    {item.title}
                </motion.div>
                {item.notes && (
                    <div className="expense-notes">{item.notes}</div>
                )}
            </div>
            {/* Pass prefs.currency so amount updates when currency changes */}
            <div className="cell col-amt">{formatCurrency(item.amount, prefs.currency)}</div>
            <div className="cell col-cat">{item.category}</div>
            <div className="cell col-date">{formatDate(item.date)}</div>
            <div className="cell col-actions">
                <button className="btn-inline" onClick={onEdit}>Edit</button>
                <button className="btn-inline danger" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}
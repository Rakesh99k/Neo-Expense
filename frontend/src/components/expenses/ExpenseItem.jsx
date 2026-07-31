import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { usePrefs } from '../../hooks/usePrefs.js';

/**
 * ExpenseItem
 * Single row in the expenses list.
 * Different layout on mobile (card) vs desktop (table row).
 */
export default function ExpenseItem({ item, onEdit, onDelete }) {
  const { prefs } = usePrefs();
  const emoji = getCategoryEmoji(item.category);

  return (
    <>
      {/* Desktop: table row */}
      <div className="expense-row expense-row-desktop">
        <div className="expense-cell expense-cell-title">
          <span className="expense-emoji">{emoji}</span>
          <div>
            <div className="expense-title">{item.title}</div>
            {item.notes && (
              <div className="expense-notes">{item.notes}</div>
            )}
          </div>
        </div>
        <div className="expense-cell expense-cell-amount">
          {formatCurrency(item.amount, prefs.currency)}
        </div>
        <div className="expense-cell">
          <span className="expense-badge">{item.category}</span>
        </div>
        <div className="expense-cell expense-cell-date">
          {formatDate(item.date)}
        </div>
        <div className="expense-cell expense-cell-actions">
          <button
            className="row-action-btn"
            onClick={onEdit}
            aria-label="Edit"
          >
            <IconEdit />
          </button>
          <button
            className="row-action-btn row-action-danger"
            onClick={onDelete}
            aria-label="Delete"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {/* Mobile: card */}
      <div className="expense-card expense-card-mobile">
        <div className="expense-card-top">
          <div className="expense-card-left">
            <span className="expense-emoji">{emoji}</span>
            <div>
              <div className="expense-title">{item.title}</div>
              <div className="expense-card-meta">
                {item.category} · {formatDate(item.date)}
              </div>
            </div>
          </div>
          <div className="expense-card-amount">
            {formatCurrency(item.amount, prefs.currency)}
          </div>
        </div>
        {item.notes && (
          <div className="expense-card-notes">{item.notes}</div>
        )}
        <div className="expense-card-actions">
          <button
            className="btn-inline"
            onClick={onEdit}
          >
            <IconEdit /> Edit
          </button>
          <button
            className="btn-inline btn-inline-danger"
            onClick={onDelete}
          >
            <IconTrash /> Delete
          </button>
        </div>
      </div>
    </>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Food: '🍔',
    Transport: '🚗',
    Utilities: '💡',
    Entertainment: '🎬',
    Health: '💊',
    Shopping: '🛍️',
    Travel: '✈️',
    Other: '📝'
  };
  return map[category] || '💰';
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}
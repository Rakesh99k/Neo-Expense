import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { usePrefs } from '../../hooks/usePrefs.js';
import { getPaymentMethod } from '../../constants/index.js';

export default function RecentExpenses({ expenses = [] }) {
  const { prefs } = usePrefs();
  const recent = expenses.slice(0, 5);

  return (
      <motion.div
          className="recent-expenses"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="recent-header">
          <h3>Recent Expenses</h3>
          <Link to="/expenses" className="view-all-link">View all →</Link>
        </div>

        {recent.length === 0 ? (
            <div className="recent-empty">
              <span className="recent-empty-icon">📭</span>
              <span>No expenses yet</span>
              <Link to="/expenses" className="auth-link">Add your first one</Link>
            </div>
        ) : (
            <div className="recent-list">
              {recent.map((exp, i) => {
                const payment = getPaymentMethod(exp.paymentMethod);
                return (
                    <motion.div
                        key={exp.id}
                        className="recent-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        whileHover={{ x: 4 }}
                    >
                      <div className="recent-icon">
                        {getCategoryEmoji(exp.category)}
                      </div>
                      <div className="recent-details">
                        <div className="recent-title">{exp.title}</div>
                        <div className="recent-meta">
                          {exp.category} · {formatDate(exp.date)}
                          <span
                              style={{
                                marginLeft: '8px',
                                color: payment.color,
                                fontSize: '11px'
                              }}
                          >
                      {payment.icon}
                    </span>
                        </div>
                      </div>
                      <div className="recent-amount">
                        {formatCurrency(exp.amount, prefs.currency)}
                      </div>
                    </motion.div>
                );
              })}
            </div>
        )}
      </motion.div>
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
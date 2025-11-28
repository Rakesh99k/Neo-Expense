import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/expenses', label: 'Expenses', icon: '💸' },
  { to: '/reports', label: 'Reports', icon: '📑' },
  { to: '/settings', label: 'Settings', icon: '⚙️' }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <motion.div className="brand" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="brand-accent">Neo</span>Expense
      </motion.div>
      <nav>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="nav-icon">{l.icon}</motion.span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

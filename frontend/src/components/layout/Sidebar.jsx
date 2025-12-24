/**
 * Sidebar navigation.
 * - Renders primary app routes with active state.
 * - Uses simple emoji icons and Framer Motion hover states.
 */
import { NavLink } from 'react-router-dom'; // nav link with active class management
import { motion } from 'framer-motion'; // used for small hover animations

// Define visible navigation links and their routes
const links = [
  { to: '/', label: 'Dashboard', icon: '📊' }, // main overview page
  { to: '/expenses', label: 'Expenses', icon: '💸' }, // list and manage expenses
  { to: '/reports', label: 'Reports', icon: '📑' }, // filter and export reports
  { to: '/settings', label: 'Settings', icon: '⚙️' } // preferences and backup/restore
];

export default function Sidebar() { // app sidebar with brand and nav
  return (
    <aside className="sidebar"> {/* container with fixed width and style */}
      <motion.div className="brand" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}> {/* brand animates in */}
        <span className="brand-accent">Neo</span>Expense {/* brand text with accent */}
      </motion.div>
      <nav> {/* nav list */}
        {links.map(l => (
          <NavLink
            key={l.to} // stable key per route
            to={l.to} // destination path
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} // active styling
          >
            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="nav-icon">{l.icon}</motion.span> {/* icon with hover/tap */}
            <span>{l.label}</span> {/* link label */}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

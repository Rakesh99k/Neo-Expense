import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../../services/auth.js';

const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/expenses', label: 'Expenses', icon: '💸' },
    { to: '/reports', label: 'Reports', icon: '📑' },
    { to: '/settings', label: 'Settings', icon: '⚙️' }
];

export default function Sidebar({ onLogout }) {
    const navigate = useNavigate();

    function handleLogout() {
        logout();        // Step 1: clears et_token from localStorage
        onLogout?.();    // Step 2: tells App.jsx to re-check auth → shows login page
        navigate('/login');
    }

    return (
        <aside className="sidebar">
            {/* Brand name at top */}
            <motion.div
                className="brand"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="brand-accent">Neo</span>Expense
            </motion.div>

            {/* Navigation links */}
            <nav>
                {links.map(l => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === '/'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <motion.span
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="nav-icon"
                        >
                            {l.icon}
                        </motion.span>
                        <span>{l.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout button pushed to bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button
                    onClick={handleLogout}
                    className="btn-inline danger"
                    style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
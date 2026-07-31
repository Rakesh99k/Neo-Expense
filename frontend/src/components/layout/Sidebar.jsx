import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { logout } from '../../services/auth.js';
import { useUser } from '../../context/UserContext.jsx';
import Logo from '../ui/Logo.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: <IconHome /> },
    { to: '/expenses', label: 'Expenses', icon: <IconWallet /> },
    { to: '/reports', label: 'Reports', icon: <IconChart /> },
    { to: '/settings', label: 'Settings', icon: <IconSettings /> }
  ];

  function handleLogout() {
    logout();
    toast.success('Logged out successfully');
    onLogout?.();
    navigate('/login');
  }

  return (
    <>
      <aside className="sidebar">
        {/* Logo top */}
        <motion.div
          className="sidebar-brand"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Logo size="md" showText={true} animated={true} />
        </motion.div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {links.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span className="sidebar-link-label">{link.label}</span>
                <span className="sidebar-link-indicator" />
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User section bottom */}
        <motion.div
          className="sidebar-user"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user && (
            <div className="sidebar-user-info">
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                size={40}
              />
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setLogoutOpen(true)}
            className="sidebar-logout"
            aria-label="Logout"
          >
            <IconLogout />
            <span>Logout</span>
          </button>
        </motion.div>
      </aside>

      <ConfirmModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from NeoExpense?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
        icon={<IconLogout />}
      />
    </>
  );
}

// ── Icons ────────────────────────────────────────────────
function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
      <path d="M21 12h-4a2 2 0 0 0 0 4h4"></path>
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { logout } from '../../services/auth.js';
import { useUser } from '../../context/UserContext.jsx';
import UserAvatar from '../ui/UserAvatar.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';

/**
 * BottomNav
 * Mobile-only fixed bottom navigation with 5 items:
 * Home, Expenses, Reports, Settings, More (user menu)
 */
export default function BottomNav({ onLogout }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

    const items = [
        { to: '/', label: 'Home', icon: <IconHome /> },
        { to: '/expenses', label: 'Expenses', icon: <IconWallet /> },
        { to: '/budget', label: 'Budget', icon: <IconTarget /> },
        { to: '/reports', label: 'Reports', icon: <IconChart /> }
    ];

  function handleLogout() {
    logout();
    toast.success('Logged out successfully');
    onLogout?.();
    navigate('/login');
  }

  return (
    <>
      <nav className="bottom-nav">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <motion.span className="bottom-nav-icon" whileTap={{ scale: 0.9 }}>
              {item.icon}
            </motion.span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}

        {/* More/User button */}
        <button
          className={`bottom-nav-item ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(true)}
          aria-label="More options"
        >
          <motion.span className="bottom-nav-icon" whileTap={{ scale: 0.9 }}>
            <IconMore />
          </motion.span>
          <span className="bottom-nav-label">More</span>
        </button>
      </nav>

      {/* Bottom sheet menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="bottom-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="bottom-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="bottom-sheet-handle" />

              {user && (
                <div className="bottom-sheet-profile">
                  <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size={56}
                  />
                  <div className="bottom-sheet-profile-info">
                    <div className="bottom-sheet-profile-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="bottom-sheet-profile-email">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

                <div className="bottom-sheet-nav-grid">
                    <button
                        className="bottom-sheet-nav-item"
                        onClick={() => {
                            setMenuOpen(false);
                            navigate('/recurring');
                        }}
                    >
                        <IconRefresh />
                        <span>Recurring</span>
                    </button>

                    <button
                        className="bottom-sheet-nav-item"
                        onClick={() => {
                            setMenuOpen(false);
                            navigate('/savings');
                        }}
                    >
                        <IconPiggyBank />
                        <span>Savings</span>
                    </button>

                    <button
                        className="bottom-sheet-nav-item"
                        onClick={() => {
                            setMenuOpen(false);
                            navigate('/settings');
                        }}
                    >
                        <IconSettings />
                        <span>Settings</span>
                    </button>
                </div>

                <div className="bottom-sheet-actions">
                    <button
                        className="bottom-sheet-btn bottom-sheet-btn-danger"
                        onClick={() => {
                            setMenuOpen(false);
                            setLogoutConfirm(true);
                        }}
                    >
                        <IconLogout />
                        <span>Logout</span>
                    </button>

                    <button
                        className="bottom-sheet-btn bottom-sheet-btn-secondary"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout confirmation */}
      <ConfirmModal
        isOpen={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
      <path d="M21 12h-4a2 2 0 0 0 0 4h4"></path>
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="19" cy="12" r="1"></circle>
      <circle cx="5" cy="12" r="1"></circle>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}

function IconTarget() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    );
}

function IconRefresh() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    );
}

function IconPiggyBank() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2 0-.4-.2-2-.2-2C15 3 12.5 2 10 2S5 3 5 5c0 1 .2 1.5 1 2v3l-2 1v3l2 1c-.7.5-1 1-1 2v2c0 1 1 2 2 2h1l1 2h4l1-2h4c1 0 2-1 2-2v-2c0-.5-.3-1-1-1.5.5-.4 1-1 1-1.5V8c0-2-2-3-2-3z"></path>
        </svg>
    );
}
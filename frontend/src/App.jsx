/**
 * Root application component.
 * - Verifies token on startup before rendering protected routes.
 * - Wraps protected app with PrefsProvider and UserProvider.
 * - Global toast notifications.
 */
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/layout/Sidebar.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import { PrefsProvider } from './context/PrefsContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { isAuthenticated } from './services/auth.js';

// Lazy-loaded page components
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));
const Recurring = lazy(() => import('./pages/Recurring.jsx'));
const Budget = lazy(() => import('./pages/Budget.jsx'));
const Savings = lazy(() => import('./pages/Savings.jsx'));
const Reports = lazy(() => import('./pages/Reports.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verify token is still valid on app load
  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem('et_token');
      if (!token) {
        setAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        // Try to fetch current user info to verify token
        const { default: api } = await import('./services/api.js');
        await api.get('/api/auth/me');
        setAuthenticated(true);
      } catch (err) {
        // Token invalid — clean up and show login
        localStorage.removeItem('et_token');
        localStorage.removeItem('et_email');
        setAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyToken();
  }, []);

  // Sync auth state on storage changes (e.g., logout in another tab)
  useEffect(() => {
    function syncAuth() {
      setAuthenticated(isAuthenticated());
    }
    window.addEventListener('storage', syncAuth);
    window.addEventListener('focus', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('focus', syncAuth);
    };
  }, []);

  // Show loading spinner while verifying token
  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg, #0a0a0f)'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(168, 85, 246, 0.2)',
          borderTopColor: '#a855f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Global toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(20, 20, 30, 0.95)',
            color: '#e4e4f0',
            border: '1px solid rgba(168, 85, 246, 0.2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#0a0a0f'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0a0a0f'
            }
          }
        }}
      />

      {authenticated ? (
        <PrefsProvider>
          <UserProvider>
            <ProtectedApp onLogout={() => setAuthenticated(false)} />
          </UserProvider>
        </PrefsProvider>
      ) : (
        <PublicApp onLogin={() => setAuthenticated(true)} />
      )}
    </>
  );
}

function PublicApp({ onLogin }) {
  return (
    <main className="public-main">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/login"
              element={<PageWrapper><Login onLogin={onLogin} /></PageWrapper>}
            />
            <Route
              path="/register"
              element={<PageWrapper><Register /></PageWrapper>}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </main>
  );
}

function ProtectedApp({ onLogout }) {
  return (
    <div className="app-root">
      <Sidebar onLogout={onLogout} />
      <main className="app-main">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/expenses" element={<PageWrapper><Expenses /></PageWrapper>} />
              <Route path="/recurring" element={<PageWrapper><Recurring /></PageWrapper>} />
              <Route path="/budget" element={<PageWrapper><Budget /></PageWrapper>} />
              <Route path="/savings" element={<PageWrapper><Savings /></PageWrapper>} />
              <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <BottomNav onLogout={onLogout} />
    </div>
  );
}

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
}
/**
 * Root application component.
 * - Separates public auth routes from protected app routes.
 * - Wraps protected app with PrefsProvider and UserProvider.
 * - Includes global Toaster for notifications.
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

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));
const Reports = lazy(() => import('./pages/Reports.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

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

  return (
    <>
      {/* Global toast notifications, works in both public and protected */}
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
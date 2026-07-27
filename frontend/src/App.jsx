import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefs } from './hooks/usePrefs.js';
import { PrefsProvider } from './context/PrefsContext.jsx';
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
    function syncAuthentication() {
      setAuthenticated(isAuthenticated());
    }

    window.addEventListener('storage', syncAuthentication);
    window.addEventListener('focus', syncAuthentication);

    return () => {
      window.removeEventListener('storage', syncAuthentication);
      window.removeEventListener('focus', syncAuthentication);
    };
  }, []);

  if (!authenticated) {
    return <PublicApp onLogin={() => setAuthenticated(true)} />;
  }

  return (
      <PrefsProvider>
        <ProtectedApp onLogout={() => setAuthenticated(false)} />
      </PrefsProvider>
  );
}

function PublicApp({ onLogin }) {
  return (
      <main className="app-main">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={
                <PageWrapper><Login onLogin={onLogin} /></PageWrapper>
              } />
              <Route path="/register" element={
                <PageWrapper><Register onLogin={onLogin} /></PageWrapper>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
  );
}

function ProtectedApp({ onLogout }) {
  const { prefs } = usePrefs();

  useEffect(() => {
    document.body.dataset.theme = prefs.theme;
  }, [prefs.theme]);

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
      </div>
  );
}

function PageWrapper({ children }) {
  const location = useLocation();
  return (
      <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="page-wrapper"
      >
        {children}
      </motion.div>
  );
}
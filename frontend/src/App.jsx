import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefs } from './hooks/usePrefs.js';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));
const Reports = lazy(() => import('./pages/Reports.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));

export default function App() {
  const location = useLocation();
  const { prefs } = usePrefs();

  // Apply theme globally so it initializes even if user never visits Settings page
  useEffect(() => {
    document.body.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  return (
    <div className="app-root">
      <Sidebar />
      <main className="app-main">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/expenses" element={<PageWrapper><Expenses /></PageWrapper>} />
              <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
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

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));

export default function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="app-main">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/expenses" element={<PageWrapper><Expenses /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}

function PageWrapper({ children }) {
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

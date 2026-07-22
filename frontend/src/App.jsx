/**
 * Root application component.
 * - Splits public auth routes from protected application routes.
 * - Animates route transitions via Framer Motion.
 * - Applies the selected theme to <body> for authenticated users.
 */
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'; // React Router APIs for routing
import { Suspense, lazy, useEffect } from 'react'; // Suspense for code-splitting, lazy for lazy routes, useEffect for side-effects
import Sidebar from './components/layout/Sidebar.jsx'; // Left sidebar navigation component
import { AnimatePresence, motion } from 'framer-motion'; // Animation primitives for page transitions
import { usePrefs } from './hooks/usePrefs.js'; // Custom hook to read user preferences
import { isAuthenticated } from './services/auth.js';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx')); // lazily load Dashboard route component
const Expenses = lazy(() => import('./pages/Expenses.jsx')); // lazily load Expenses route component
const Reports = lazy(() => import('./pages/Reports.jsx')); // lazily load Reports route component
const Settings = lazy(() => import('./pages/Settings.jsx')); // lazily load Settings route component
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));

export default function App() { // top-level app component
  const authenticated = isAuthenticated();

  return authenticated ? <ProtectedApp /> : <PublicApp />;
}

function PublicApp() {
  return (
    <main className="app-main">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </main>
  );
}

function ProtectedApp() {
  const { prefs } = usePrefs(); // user preferences (theme, currency)

  // Apply theme globally so it initializes even if user never visits Settings page
  useEffect(() => {
    document.body.dataset.theme = prefs.theme; // set data-theme attribute used by CSS
  }, [prefs.theme]); // re-run when theme changes

  return ( // JSX for layout and routes
    // App root: flex layout (sidebar + main)
    <div className="app-root">
      {/* Left navigation sidebar */}
      <Sidebar />
      {/* Main scrollable content area */}
      <main className="app-main">
        {/* Lazy-loaded routes display fallback while loading */}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {/* Animate route entries/exits */}
          <AnimatePresence mode="wait">
            {/* Route table maps path -> element */}
            <Routes>
              {/* Dashboard route */}
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              {/* Expenses route */}
              <Route path="/expenses" element={<PageWrapper><Expenses /></PageWrapper>} />
              {/* Reports route */}
              <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
              {/* Settings route */}
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

function PageWrapper({ children }) { // wrapper that animates page transitions
  const location = useLocation(); // include path in key for re-mount animation
  return (
    <motion.div
      key={location.pathname} // unique key forces exit/enter animations per route
      initial={{ opacity: 0, y: 16 }} // start slightly faded and below
      animate={{ opacity: 1, y: 0 }} // animate to visible and aligned
      exit={{ opacity: 0, y: -16 }} // exit fades and slides up
      transition={{ duration: 0.35, ease: 'easeOut' }} // timing and easing
      className="page-wrapper" // layout class
    >
      {children} {/* render the actual page component */}
    </motion.div>
  );
}

/**
 * PageWrapper
 * Small helper to animate page-level route transitions.
 * Props:
 * - children: ReactNode rendered as a page.
 */

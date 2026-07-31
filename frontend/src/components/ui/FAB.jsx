import { motion } from 'framer-motion';

/**
 * FAB (Floating Action Button)
 * Circular button that floats bottom-right on mobile.
 * Hidden on desktop via CSS.
 * Props:
 *   onClick — click handler
 *   icon — element inside button (default: plus)
 *   label — aria-label for accessibility
 */
export default function FAB({ onClick, icon, label = 'Add' }) {
  return (
    <motion.button
      className="fab"
      onClick={onClick}
      aria-label={label}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon || (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )}
    </motion.button>
  );
}
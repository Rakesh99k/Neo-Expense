import { motion } from 'framer-motion';

/**
 * LoadingSpinner
 * Reusable spinner for loading states.
 * Props:
 *   size — pixel size (default 24)
 *   fullPage — center in whole viewport with backdrop
 *   message — text to show below spinner
 */
export default function LoadingSpinner({ size = 24, fullPage = false, message }) {
  const spinner = (
    <div className="spinner-container">
      <motion.div
        className="spinner"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="spinner-fullpage">{spinner}</div>;
  }

  return spinner;
}
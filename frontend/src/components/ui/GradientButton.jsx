import { motion } from 'framer-motion';

/**
 * GradientButton
 * Main call-to-action button with gradient background.
 * Props:
 *   children — button text
 *   onClick — click handler
 *   loading — shows spinner and disables
 *   disabled — disables click
 *   icon — optional element shown on right (e.g., arrow)
 *   type — button type ('button' | 'submit')
 *   fullWidth — makes button 100% wide
 */
export default function GradientButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  icon,
  type = 'button',
  fullWidth = false
}) {
  const isDisabled = loading || disabled;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      className="gradient-btn"
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <span className="gradient-btn-content">
        {loading ? (
          <>
            <span className="btn-spinner" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {icon && <span className="gradient-btn-icon">{icon}</span>}
          </>
        )}
      </span>
      <span className="gradient-btn-shimmer" />
    </motion.button>
  );
}
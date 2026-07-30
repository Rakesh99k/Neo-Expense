import { motion } from 'framer-motion';

/**
 * GlassPanel
 * Translucent card with backdrop blur — the core visual element.
 * Props:
 *   children — content inside
 *   className — extra CSS classes
 *   delay — animation delay for stagger effect
 *   noHover — disable lift on hover
 */
export default function GlassPanel({
  children,
  className = '',
  delay = 0,
  noHover = false
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={noHover ? {} : { y: -2 }}
      className={`glass-panel ${className}`}
    >
      {children}
    </motion.div>
  );
}
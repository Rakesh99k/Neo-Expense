/**
 * SummaryCard
 * Small stat card for key metrics.
 * Props:
 * - label: string title
 * - value: string|number display value
 * - accent: CSS color used for subtle accent background
 */
import { motion } from 'framer-motion'; // animation for hover/tap feedback

export default function SummaryCard({ label, value, accent }) { // stat card with label/value
  return (
    <motion.div
      whileHover={{ scale: 1.03 }} // subtle grow on hover
      whileTap={{ scale: 0.98 }} // slight compress on tap/click
      className="summary-card" // card styles
      style={{ '--accent': accent }} // provide accent color variable
    >
      <div className="summary-label">{label}</div> {/* small label */}
      <div className="summary-value">{value}</div> {/* main value */}
    </motion.div>
  );
}

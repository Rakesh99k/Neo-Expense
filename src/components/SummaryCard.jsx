import { motion } from 'framer-motion';

export default function SummaryCard({ label, value, accent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="summary-card"
      style={{ '--accent': accent }}
    >
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
    </motion.div>
  );
}

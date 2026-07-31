import { motion } from 'framer-motion';
import CountUp from 'react-countup';

/**
 * StatCard
 * Compact stat card for Reports summary row.
 * Similar to MetricCard but simpler layout for 5-in-a-row display.
 * Props:
 *   label, value, prefix, delay, isNumber
 *   accent — 'purple' | 'blue' | 'pink' | 'green' | 'orange'
 */
export default function StatCard({
  label,
  value,
  prefix = '',
  delay = 0,
  isNumber = true,
  accent = 'purple'
}) {
  return (
    <motion.div
      className={`stat-card stat-card-${accent}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">
        {prefix && <span className="stat-card-prefix">{prefix}</span>}
        {isNumber && typeof value === 'number' ? (
          <CountUp
            end={value}
            duration={1}
            separator=","
            decimals={value % 1 !== 0 ? 2 : 0}
            preserveValue
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

/**
 * MetricCard
 * Dashboard summary card with animated count-up.
 * Props:
 *   label — card title
 *   value — number to display (or string like "2")
 *   prefix — currency symbol shown before value
 *   subtitle — small text below (e.g., "+12.5% vs last month")
 *   subtitleColor — 'positive' | 'negative' | 'muted'
 *   icon — element shown top right
 *   accent — gradient color for accent line
 *   delay — animation stagger delay
 *   isNumber — if true, animates with CountUp; if false, shows as text
 */
export default function MetricCard({
  label,
  value,
  prefix = '',
  subtitle,
  subtitleColor = 'muted',
  icon,
  accent = 'purple',
  delay = 0,
  isNumber = true
}) {
  return (
    <motion.div
      className={`metric-card metric-card-${accent}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="metric-header">
        <div className="metric-label">{label}</div>
        {icon && <div className="metric-icon">{icon}</div>}
      </div>

      <div className="metric-value">
        {prefix && <span className="metric-prefix">{prefix}</span>}
        {isNumber && typeof value === 'number' ? (
          <CountUp
            end={value}
            duration={1.2}
            separator=","
            decimals={value % 1 !== 0 ? 2 : 0}
            preserveValue
          />
        ) : (
          <span>{value}</span>
        )}
      </div>

      {subtitle && (
        <div className={`metric-subtitle metric-subtitle-${subtitleColor}`}>
          {subtitle}
        </div>
      )}

      <div className="metric-glow" />
    </motion.div>
  );
}
import { motion } from 'framer-motion';

/**
 * AnimatedChart
 * CSS-only animated chart mockup for the login/register hero panel.
 * Simulates the "Total Spending" card + bar chart + pie chart look.
 */
export default function AnimatedChart() {
  // Fake data for the bar chart
  const bars = [45, 78, 55, 90, 65, 82, 70];

  return (
    <div className="hero-chart">
      {/* Total Spending card */}
      <motion.div
        className="hero-chart-card hero-chart-total"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="hero-chart-label">Total Spending</div>
        <div className="hero-chart-amount">
          <span className="hero-chart-symbol">₹</span>
          <AnimatedCounter target={5243} />
        </div>
        <div className="hero-chart-trend">
          <span className="trend-up">↑ 12.5%</span>
          <span className="trend-label">vs last month</span>
        </div>

        {/* Bar chart */}
        <div className="hero-bars">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="hero-bar"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{
                delay: 0.8 + i * 0.08,
                duration: 0.6,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Food pie chart card */}
      <motion.div
        className="hero-chart-card hero-chart-pie"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="hero-pie-label">Food</div>
        <div className="hero-pie-ring">
          <svg viewBox="0 0 100 100" className="hero-pie-svg">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="rgba(168, 85, 246, 0.15)"
              strokeWidth="10"
            />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#pieGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="264"
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 200 }}
              transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="pieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="hero-pie-percent">24%</div>
        </div>
      </motion.div>

      {/* Trend icon card */}
      <motion.div
        className="hero-chart-card hero-chart-trend-icon"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      </motion.div>

      {/* Glow ring at bottom */}
      <motion.div
        className="hero-glow-ring"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      />
    </div>
  );
}

function AnimatedCounter({ target }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {target.toLocaleString('en-IN')}
    </motion.span>
  );
}
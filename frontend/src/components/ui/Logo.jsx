import { motion } from 'framer-motion';

/**
 * Logo
 * App logo with text. Uses the uploaded image from /public/logo.png.
 * Props:
 *   size — 'sm' | 'md' | 'lg'
 *   showText — whether to show "NeoExpense" text next to logo
 *   animated — enable hover animations
 */
export default function Logo({ size = 'md', showText = true, animated = true }) {
  const dimensions = {
    sm: { logo: 40, fontSize: '18px' },
    md: { logo: 56, fontSize: '24px' },
    lg: { logo: 80, fontSize: '32px' }
  };
  const dim = dimensions[size];

  return (
    <motion.div
      className="logo-container"
      whileHover={animated ? { scale: 1.05 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.img
        src="/logo.png"
        alt="NeoExpense"
        width={dim.logo}
        height={dim.logo}
        className="logo-image"
        animate={animated ? {
          filter: [
            'drop-shadow(0 0 10px rgba(168, 85, 246, 0.4))',
            'drop-shadow(0 0 20px rgba(168, 85, 246, 0.7))',
            'drop-shadow(0 0 10px rgba(168, 85, 246, 0.4))'
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={animated ? { rotate: [0, -5, 5, 0] } : {}}
      />
      {showText && (
        <span className="logo-text" style={{ fontSize: dim.fontSize }}>
          Neo<span className="logo-text-accent">Expense</span>
        </span>
      )}
    </motion.div>
  );
}
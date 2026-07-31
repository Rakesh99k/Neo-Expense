import { motion } from 'framer-motion';

export default function Logo({ size = 'md', showText = true, animated = true }) {
  const dimensions = {
    sm: { logo: 48, fontSize: '18px' },
    md: { logo: 72, fontSize: '26px' },
    lg: { logo: 96, fontSize: '34px' }
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
            'drop-shadow(0 0 12px rgba(168, 85, 246, 0.5))',
            'drop-shadow(0 0 24px rgba(168, 85, 246, 0.8))',
            'drop-shadow(0 0 12px rgba(168, 85, 246, 0.5))'
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
import { motion } from 'framer-motion';

/**
 * UserAvatar
 * Shows user's initials in a colored circle.
 * Color is derived from name for consistency.
 * Props:
 *   firstName, lastName — user's name
 *   size — pixel diameter (default 40)
 *   showTooltip — show name on hover
 */
export default function UserAvatar({ firstName = '', lastName = '', size = 40, showTooltip = false }) {
  const initials = getInitials(firstName, lastName);
  const bgColor = getColorFromName(firstName + lastName);

  return (
    <motion.div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        background: bgColor,
        fontSize: size * 0.4
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      title={showTooltip ? `${firstName} ${lastName}`.trim() : undefined}
    >
      {initials}
    </motion.div>
  );
}

function getInitials(first, last) {
  const f = (first || '').trim().charAt(0).toUpperCase();
  const l = (last || '').trim().charAt(0).toUpperCase();
  return (f + l) || '?';
}

function getColorFromName(name) {
  // Deterministic gradient based on name hash
  const gradients = [
    'linear-gradient(135deg, #a855f6 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #a855f6 100%)'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}
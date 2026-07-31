import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext.jsx';

/**
 * Greeting
 * Time-based welcome message using user's first name.
 * Example: "Good morning, John ☀️"
 */
export default function Greeting() {
  const { user, userLoading } = useUser();

  if (userLoading) {
    return <div className="greeting-skeleton" />;
  }

  const firstName = user?.firstName || 'there';
  const { message, emoji } = getGreeting();

  return (
    <motion.div
      className="greeting"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="greeting-emoji"
        animate={{ rotate: [0, 15, -10, 15, 0] }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {emoji}
      </motion.span>
      <span className="greeting-text">
        {message}, <span className="greeting-name">{firstName}</span>
      </span>
    </motion.div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) return { message: 'Still up', emoji: '🌙' };
  if (hour < 12) return { message: 'Good morning', emoji: '☀️' };
  if (hour < 17) return { message: 'Good afternoon', emoji: '🌤️' };
  if (hour < 21) return { message: 'Good evening', emoji: '🌆' };
  return { message: 'Working late', emoji: '🌙' };
}
import { motion } from 'framer-motion';
import Logo from '../ui/Logo.jsx';
import AnimatedChart from '../ui/AnimatedChart.jsx';

/**
 * AuthHero
 * Left panel shared by Login and Register.
 * Props:
 *   mode — 'login' | 'register'
 */
export default function AuthHero({ mode = 'login' }) {
  const content = {
    login: {
      words: [
        { text: 'Track.', color: 'text' },
        { text: 'Analyze.', color: 'purple' },
        { text: 'Save.', color: 'blue' }
      ],
      subtitle: 'Take control of your finances with beautiful insights and smart tracking.'
    },
    register: {
      words: [
        { text: 'Start', color: 'text' },
        { text: 'your', color: 'text' },
        { text: 'journey.', color: 'purple' }
      ],
      subtitle: 'Create your account and take control of your finances today.'
    }
  };

  const { words, subtitle } = content[mode];

  return (
    <div className="auth-hero">
      {/* Star/dot background pattern */}
      <div className="auth-hero-stars" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="md" showText={true} animated={true} />
      </motion.div>

      {/* Animated headline */}
      <div className="auth-hero-headline">
        {words.map((word, i) => (
          <motion.div
            key={i}
            className={`auth-hero-word auth-hero-word-${word.color}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
          >
            {word.text}
          </motion.div>
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        className="auth-hero-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>

      {/* Animated chart mockup */}
      <AnimatedChart />
    </div>
  );
}
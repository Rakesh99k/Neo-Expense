import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { login } from '../services/auth.js';
import AuthHero from '../components/auth/AuthHero.jsx';
import InputWithIcon from '../components/ui/InputWithIcon.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import ThemePicker from '../components/ui/ThemePicker.jsx';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Pre-fill email if user just registered
  useEffect(() => {
    const pendingEmail = localStorage.getItem('et_pending_email');
    if (pendingEmail) {
      setEmail(pendingEmail);
      localStorage.removeItem('et_pending_email');
    }
  }, []);

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      onLogin?.();
      navigate('/');
    } catch (err) {
      // Shake animation on error
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const status = err.response?.status;
      if (status === 401) {
        toast.error('Invalid email or password');
        setErrors({ password: 'Invalid credentials' });
      } else if (status === 429) {
        toast.error('Too many attempts. Please wait a moment.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left: Hero */}
        <AuthHero mode="login" />

        {/* Right: Form */}
        <motion.div
          className="auth-form-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          animate={{
            opacity: 1,
            x: shake ? [-10, 10, -10, 10, 0] : 0
          }}
        >
          {/* Theme picker top right */}
          <div className="auth-theme-picker">
            <ThemePicker />
          </div>

          {/* Form content */}
          <div className="auth-form-content">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="auth-title">Welcome back <span>👋</span></h1>
              <p className="auth-subtitle">Login to continue to NeoExpense</p>
            </motion.div>

            <form onSubmit={onSubmit} className="auth-form">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <InputWithIcon
                  label="Email address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email}
                  icon={<IconMail />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={errors.password}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GradientButton
                  type="submit"
                  loading={loading}
                  fullWidth
                  icon={<IconArrowRight />}
                >
                  Login
                </GradientButton>
              </motion.div>
            </form>

            <motion.p
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Register</Link>
            </motion.p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
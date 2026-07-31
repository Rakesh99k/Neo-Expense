import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { register } from '../services/auth.js';
import AuthHero from '../components/auth/AuthHero.jsx';
import InputWithIcon from '../components/ui/InputWithIcon.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import ThemePicker from '../components/ui/ThemePicker.jsx';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    const errs = {};

    if (!firstName.trim()) {
      errs.firstName = 'First name is required';
    } else if (firstName.length > 100) {
      errs.firstName = 'First name too long';
    }

    if (lastName.length > 100) {
      errs.lastName = 'Last name too long';
    }

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Invalid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      errs.password = 'Must contain an uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      errs.password = 'Must contain a number';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      await register(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password
      );

      // Store email so login page can pre-fill it
      localStorage.setItem('et_pending_email', email.trim());

      toast.success('Account created! Please login to continue.', {
        duration: 5000,
        icon: '🎉'
      });

      // Small delay so user sees the toast before redirect
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 400 && message?.includes('already registered')) {
        toast.error('This email is already registered');
        setErrors({ email: 'Email already registered' });
      } else if (status === 400) {
        toast.error(message || 'Invalid registration data');
      } else if (status === 429) {
        toast.error('Too many attempts. Please wait a moment.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left: Hero */}
        <AuthHero mode="register" />

        {/* Right: Form */}
        <motion.div
          className="auth-form-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: shake ? [-10, 10, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="auth-theme-picker">
            <ThemePicker />
          </div>

          <div className="auth-form-content">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="auth-title">Create Account <span>✨</span></h1>
              <p className="auth-subtitle">Join NeoExpense today</p>
            </motion.div>

            <form onSubmit={onSubmit} className="auth-form">
              {/* Name row: firstName + lastName side by side */}
              <motion.div
                className="auth-form-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <InputWithIcon
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                  error={errors.firstName}
                  icon={<IconUser />}
                />
                <InputWithIcon
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  error={errors.lastName}
                  icon={<IconUser />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
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
                transition={{ delay: 0.55 }}
              >
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  error={errors.password}
                  showStrength={true}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GradientButton
                  type="submit"
                  loading={loading}
                  fullWidth
                  icon={<IconArrowRight />}
                >
                  Create Account
                </GradientButton>
              </motion.div>
            </form>

            <motion.p
              className="auth-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Login</Link>
            </motion.p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
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
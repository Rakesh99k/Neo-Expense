import { useState } from 'react';

/**
 * PasswordInput
 * Password field with visibility toggle and optional strength meter.
 * Props:
 *   label, value, onChange, placeholder, error, autoComplete, name, id
 *   showStrength — show password strength meter below
 */
export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  autoComplete = 'current-password',
  name = 'password',
  id,
  showStrength = false
}) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const strength = calculateStrength(value);

  return (
    <div className="input-group">
      {label && <label htmlFor={id || name} className="input-label">{label}</label>}

      <div className={`input-wrapper ${focused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <span className="input-icon">
          <IconLock />
        </span>
        <input
          id={id || name}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input-field"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="input-toggle"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="password-strength">
          <div className="strength-bar">
            <div
              className={`strength-fill strength-${strength.level}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
          <span className={`strength-label strength-label-${strength.level}`}>
            {strength.label}
          </span>
        </div>
      )}

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

function calculateStrength(password) {
  if (!password) return { percent: 0, level: 'weak', label: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { percent: 33, level: 'weak', label: 'Weak' };
  if (score <= 3) return { percent: 66, level: 'medium', label: 'Medium' };
  return { percent: 100, level: 'strong', label: 'Strong' };
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}
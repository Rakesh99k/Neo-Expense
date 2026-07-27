import { useState } from 'react';
import { register } from '../services/auth.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ onLogin }) {  // ADDED: onLogin prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      onLogin?.();          // ADDED: notify App
      navigate('/');
    } catch (err) {
      setError('Register failed. Try a different email.');
      console.error(err);
    }
  }

  return (
      <div className="settings-page">
        <div className="settings-section">
          <h2>Register</h2>
          <form onSubmit={onSubmit} className="expense-form">
            <div className="form-row">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <div className="form-actions">
              <button className="btn-accent" type="submit">Register</button>
            </div>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
  );
}
import { useState } from 'react';
import { login } from '../services/auth.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {   // ADDED: onLogin prop
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('DemoPass123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onLogin?.();          // ADDED: notify App to re-check auth state
      navigate('/');
    } catch (err) {
      setError('Login failed. Check credentials.');
      console.error(err);
    }
  }

  return (
      <div className="settings-page">
        <div className="settings-section">
          <h2>Login</h2>
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
              <button className="btn-accent" type="submit">Login</button>
            </div>
            <p>Need an account? <Link to="/register">Register</Link></p>
          </form>
        </div>
      </div>
  );
}
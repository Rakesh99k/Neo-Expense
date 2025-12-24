/**
 * Login
 * Simple form that calls backend auth and stores token on success.
 */
import { useState } from 'react'; // form state
import { login } from '../services/auth.js'; // backend auth
import { useNavigate } from 'react-router-dom'; // navigation after login

export default function Login() { // login form page
  const [email, setEmail] = useState('demo@example.com'); // email input
  const [password, setPassword] = useState('DemoPass123'); // password input
  const [error, setError] = useState(''); // error message state
  const navigate = useNavigate(); // router navigation helper

  async function onSubmit(e) { // submit handler
    e.preventDefault(); // prevent navigation
    setError(''); // clear prior error
    try {
      await login(email, password); // call backend
      navigate('/'); // redirect to dashboard
    } catch (err) {
      setError('Login failed. Check credentials.'); // show error
      console.error(err); // log for debugging
    }
  }

  return (
    <div className="settings-page"> {/* reuse settings layout styles */}
      <div className="settings-section"> {/* card */}
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="expense-form"> {/* form */}
          <div className="form-row"> {/* email */}
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row"> {/* password */}
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="error-msg">{error}</div>} {/* show login error */}
          <div className="form-actions"> {/* submit */}
            <button className="btn-accent" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

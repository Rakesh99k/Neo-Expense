/**
 * Register
 * Basic registration form against the backend; stores token on success.
 */
import { useState } from 'react'; // form state
import { register } from '../services/auth.js'; // backend registration
import { useNavigate } from 'react-router-dom'; // navigation

export default function Register() { // register form page
  const [email, setEmail] = useState(''); // email input
  const [password, setPassword] = useState(''); // password input
  const [error, setError] = useState(''); // error message state
  const navigate = useNavigate(); // router navigation

  async function onSubmit(e) { // submit handler
    e.preventDefault(); // stop form navigation
    setError(''); // clear error
    try {
      await register(email, password); // call backend
      navigate('/'); // redirect to dashboard
    } catch (err) {
      setError('Register failed. Try a different email.'); // show error
      console.error(err); // log for debugging
    }
  }

  return (
    <div className="settings-page"> {/* reuse layout */}
      <div className="settings-section"> {/* card */}
        <h2>Register</h2>
        <form onSubmit={onSubmit} className="expense-form"> {/* form */}
          <div className="form-row"> {/* email */}
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row"> {/* password */}
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="error-msg">{error}</div>} {/* show error */}
          <div className="form-actions"> {/* submit */}
            <button className="btn-accent" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

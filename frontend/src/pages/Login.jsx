import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/styles.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    remember: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.email || !formData.password || !formData.role) {
      setError('Please complete all fields.');
      return;
    }
    // Here you would make an API call
    console.log('Login attempt:', formData);
    // Navigate to home or dashboard on success
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Placeholder for Google OAuth integration
  };

  return (
    <>
      <Navigation publicOnly />
      <main className="auth-wrap">
        <div className="container auth-grid">
          <section className="side side--login">
            <h1 className="h1">
              Welcome back.
              <br />
              <span style={{ color: '#8ef7b4' }}>Join the effort to reduce food waste on campus.</span>
            </h1>
            <p className="muted">
              The ReServe dashboard keeps tracking, claiming, and confirming surplus food donations simple for both dining halls and local non-profits with
              campus-wide transparency at every step. Sign in to turn today’s extra meals into community impact.
            </p>
            <ul className="benefits">
              <li className="benefit-item">
                <span className="benefit-icon">⏱️</span>
                <div>
                  <p className="benefit-title">Instant coordination</p>
                  <p className="muted small-text">
                    Quickly see and share surplus food listings across dining locations.
                  </p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">📋</span>
                <div>
                  <p className="benefit-title">Seamless pickup workflows</p>
                  <p className="muted small-text">
                    Claim and confirm pickups with clear records, all from one dashboard.
                  </p>
                </div>
              </li>
              <li className="benefit-item">
                <span className="benefit-icon">📈</span>
                <div>
                  <p className="benefit-title">Impact at a glance</p>
                  <p className="muted small-text">
                    Track donations, monitor campus contributions, and celebrate meals saved together.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="card pad auth-card" aria-labelledby="login-title">
            <h2 id="login-title" className="h2">Sign in</h2>
            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  className="input" 
                  type="email" 
                  required
                  placeholder="you@organization.org" 
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-describedby="email-hint"
                />
                <div id="email-hint" className="hint">Use your organization email (e.g., .edu or .org).</div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  className="input" 
                  type="password" 
                  minLength="8" 
                  required
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="hint">Minimum 8 characters. Never share your password.</div>
              </div>

              <div className="field">
                <label htmlFor="role">Role</label>
                <select 
                  id="role" 
                  name="role" 
                  required 
                  aria-label="Select role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="dining_hall_staff">Dining Hall Staff</option>
                  <option value="nonprofit_coordinator">Nonprofit Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="kv">
                <label style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                  <input 
                    type="checkbox" 
                    name="remember" 
                    aria-label="Remember this device"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span className="muted">Remember me</span>
                </label>
                <a className="muted forgot-pill" href="/forgot-password">Forgot password?</a>
              </div>

              <button className="btn" type="submit">Sign in</button>
              <button
                className="btn google-btn"
                type="button"
                onClick={handleGoogleLogin}
                aria-label="Sign in with Google"
              >
                <svg
                  className="google-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.83-.07-1.63-.2-2.4H12v4.55h6.48c-.28 1.45-1.13 2.68-2.4 3.5v2.9h3.88c2.27-2.09 3.58-5.17 3.58-8.55z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.08 7.95-2.95l-3.88-2.9c-1.08.73-2.46 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11C3.24 21.53 7.3 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.36c-.24-.73-.38-1.51-.38-2.36s.14-1.63.38-2.36V6.53H1.26A11.99 11.99 0 0 0 0 12c0 1.92.46 3.72 1.26 5.47l4.01-3.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.74c1.76 0 3.33.61 4.57 1.81l3.42-3.42C17.94 1.2 15.22 0 12 0 7.3 0 3.24 2.47 1.26 6.53l4.01 3.11c.95-2.84 3.6-4.9 6.73-4.9z"
                  />
                </svg>
                Sign in with Google
              </button>
              <button 
                className="btn ghost" 
                type="button" 
                onClick={() => navigate('/signup')}
              >
                Create an account
              </button>

              {error && (
                <div className="error" id="auth-error" role="alert" aria-live="polite">
                  {error}
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;


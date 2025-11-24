import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.accountType) {
      setError('Please complete all fields and select an account type.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Email validation (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid university email address.');
      return;
    }

    // Success
    console.log('Form Submitted', {
      fullName: formData.fullName,
      email: formData.email,
      accountType: formData.accountType
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: ''
      });
      // Optionally navigate to login
      // navigate('/login');
    }, 2500);
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // Placeholder for Google OAuth integration
  };

  return (
    <>
      <Navigation wrapped={true} publicOnly />

      <main className="main">
        <section className="signup-card" aria-labelledby="signup-title">
          <h1 id="signup-title">Join the ReServe Community</h1>
          <p className="tagline">Reduce food waste and feed our campus.</p>

          {error && (
            <p id="form-error" className="form-error" role="alert" aria-live="polite">
              {error}
            </p>
          )}
          {success && (
            <p id="form-error" className="form-error" style={{color: '#2e7d32'}} role="alert" aria-live="polite">
              Success! Your account has been created (demo).
            </p>
          )}

          <form id="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="fullName">Full Name</label>
              <input 
                id="fullName" 
                name="fullName" 
                type="text" 
                placeholder="e.g., Alex Johnson" 
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">University Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@university.edu" 
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">Create Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                minLength="8" 
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                minLength="8" 
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <fieldset className="form-row">
              <legend>Account Type</legend>
              <div className="radio-group">
                <label className="radio">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="student" 
                    required
                    checked={formData.accountType === 'student'}
                    onChange={handleChange}
                  />
                  <span>Student</span>
                </label>
                <label className="radio">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="dining"
                    checked={formData.accountType === 'dining'}
                    onChange={handleChange}
                  />
                  <span>Dining Hall Staff</span>
                </label>
                <label className="radio">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="nonprofit"
                    checked={formData.accountType === 'nonprofit'}
                    onChange={handleChange}
                  />
                  <span>Nonprofit Partner</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" className="btn btn-primary">Create Account</button>
            <button
              type="button"
              className="btn google-btn"
              onClick={handleGoogleSignup}
              aria-label="Sign up with Google"
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
              Sign up with Google
            </button>

            <p className="login-hint">
              Already have an account?
              <a className="login-link" href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Log In
              </a>
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a href="#">About Us</a>
          <span aria-hidden="true">•</span>
          <a href="#">Contact</a>
        </div>
      </footer>
    </>
  );
}

export default Signup;


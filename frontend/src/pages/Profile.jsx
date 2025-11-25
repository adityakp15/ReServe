import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getUserData, clearAuthData, authAPI } from '../utils/api';
import '../styles/profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to get user from localStorage first
    const localUser = getUserData();
    if (localUser) {
      setUser(localUser);
      setLoading(false);
    } else {
      // If not in localStorage, fetch from API
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load profile. Please try logging in again.');
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'student': 'Student',
      'dining_hall_staff': 'Dining Hall Staff',
      'nonprofit_coordinator': 'Nonprofit Coordinator'
    };
    // Convert any legacy admin roles to dining_hall_staff
    if (role === 'admin') {
      return 'Dining Hall Staff';
    }
    return roleMap[role] || role;
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete your account?\n\nThis will permanently delete:\n- Your profile information\n- All your donation history\n- All associated data\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    const confirmAgain = window.confirm(
      'This is your last chance. Are you absolutely sure you want to delete your account? Type YES in the next prompt to confirm.'
    );

    if (!confirmAgain) return;

    const finalConfirm = window.prompt(
      'Type "DELETE" (all caps) to permanently delete your account:'
    );

    if (finalConfirm !== 'DELETE') {
      alert('Account deletion cancelled. The text did not match.');
      return;
    }

    try {
      setLoading(true);
      await authAPI.deleteAccount();
      alert('Your account has been permanently deleted.');
      clearAuthData();
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      alert(error.message || 'Failed to delete account. Please try again or contact support.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="main">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navigation />
        <main className="main">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--danger)' }}>{error || 'No user data found'}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      <main className="main">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '2px solid var(--primary)'
                }}
              />
            )}
            <div>
              <h1 style={{ margin: 0 }}>{user.name}</h1>
              <p className="page-subtitle" style={{ margin: '0.25rem 0 0' }}>
                {getRoleDisplay(user.role)}
              </p>
            </div>
          </div>
        </header>

        <section className="cards-grid">
          <article className="card">
            <header className="card-header">
              <h2>Account Information</h2>
            </header>
            <div className="card-body info-grid">
              <div>
                <span className="label">Full Name:</span>
                <span className="value">{user.name}</span>
              </div>
              <div>
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div>
                <span className="label">Role:</span>
                <span className="value">{getRoleDisplay(user.role)}</span>
              </div>
              <div>
                <span className="label">Account ID:</span>
                <span className="value">{user.id}</span>
              </div>
              <div>
                <span className="label">Sign-in Method:</span>
                <span className="value">{user.picture ? 'Google OAuth' : 'Email/Password'}</span>
              </div>
            </div>
          </article>

          <article className="card">
            <header className="card-header">
              <h2>Your Impact</h2>
            </header>
            <div className="card-body">
              <div className="stats">
                <div className="stat-card">
                  <span className="stat-label">Total Donations</span>
                  <span className="stat-value">0</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Meals Provided</span>
                  <span className="stat-value">0</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Pounds Diverted</span>
                  <span className="stat-value">0 lbs</span>
                </div>
              </div>

              <div className="activity">
                <h3 className="activity-title">Recent Activity</h3>
                <p className="muted" style={{ marginTop: '0.5rem' }}>
                  No recent activity. Start by creating or claiming donations!
                </p>
              </div>
            </div>
          </article>

          <article className="card">
            <header className="card-header">
              <h2>Account Settings</h2>
            </header>
            <div className="card-body action-list">
              <button className="btn btn-primary" onClick={handleLogout}>
                Sign Out
              </button>
              <button className="deactivate-link" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Profile;


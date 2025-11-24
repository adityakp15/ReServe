import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/profile.css';

function Profile() {
  const handleEdit = (section) => {
    console.log('Edit clicked for:', section);
    // Handle edit functionality
  };

  return (
    <>
      <Navigation wrapped={true} />

      <main className="main">
        <header className="page-header">
          <h1>Dining Hall Profile: <span className="hall-name">Main Campus Commons</span></h1>
          <p className="page-subtitle">Manage your information and track your impact.</p>
        </header>

        <section className="cards-grid">
          <article className="card">
            <header className="card-header">
              <h2>Organization Information</h2>
              <button 
                className="btn btn-text" 
                aria-label="Edit Organization Information"
                onClick={() => handleEdit('Organization Information')}
              >
                Edit
              </button>
            </header>
            <div className="card-body info-grid">
              <div>
                <span className="label">Dining Hall Name:</span>
                <span className="value">Main Campus Commons</span>
              </div>
              <div>
                <span className="label">University Affiliation:</span>
                <span className="value">State University</span>
              </div>
              <div>
                <span className="label">Campus Location:</span>
                <span className="value">123 University Dr.</span>
              </div>
              <div>
                <span className="label">Key Management Contact:</span>
                <span className="value">Jane Doe (Manager)</span>
              </div>
            </div>
          </article>

          <article className="card">
            <header className="card-header">
              <h2>Contact & Operations</h2>
              <button 
                className="btn btn-text" 
                aria-label="Edit Contact & Operations"
                onClick={() => handleEdit('Contact & Operations')}
              >
                Edit
              </button>
            </header>
            <div className="card-body info-grid">
              <div>
                <span className="label">Email:</span>
                <span className="value">dining-main@stateu.edu</span>
              </div>
              <div>
                <span className="label">Phone:</span>
                <span className="value">(555) 123-4567</span>
              </div>
              <div>
                <span className="label">Operating Hours:</span>
                <span className="value">Mon–Fri, 7 AM – 9 PM</span>
              </div>
            </div>
          </article>

          <article className="card">
            <header className="card-header">
              <h2>Donation Preferences</h2>
              <button 
                className="btn btn-text" 
                aria-label="Edit Donation Preferences"
                onClick={() => handleEdit('Donation Preferences')}
              >
                Edit
              </button>
            </header>
            <div className="card-body info-grid">
              <div>
                <span className="label">Preferred Food Categories:</span>
                <span className="value">Entrees, Produce, Baked Goods</span>
              </div>
              <div>
                <span className="label">Typical Donation Times:</span>
                <span className="value">4 PM – 6 PM Daily</span>
              </div>
              <div>
                <span className="label">Food Safety Guidelines:</span>
                <span className="value">"All hot food must be held above 140°F…"</span>
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
                  <span className="stat-value">1,200</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Meals Provided</span>
                  <span className="stat-value">2,500</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Pounds Diverted</span>
                  <span className="stat-value">800 lbs</span>
                </div>
              </div>

              <div className="activity">
                <h3 className="activity-title">Recent Donation Activity</h3>
                <ul className="activity-list">
                  <li>50 lbs of produce — Nov 8</li>
                  <li>25 hot entrees — Nov 7</li>
                  <li>30 baked goods — Nov 6</li>
                </ul>
              </div>
            </div>
          </article>

          <article className="card">
            <header className="card-header">
              <h2>Account & Compliance</h2>
            </header>
            <div className="card-body action-list">
              <a href="#" className="btn btn-secondary">Manage Team Members</a>
              <a href="#" className="btn btn-secondary">Update Password</a>
              <a href="#" className="btn btn-secondary">Manage Notifications</a>
              <a href="#" className="btn btn-secondary">View Food Safety Certifications</a>
              <a href="#" className="btn btn-secondary">View Partnership Agreements</a>
              <a href="#" className="deactivate-link">Deactivate Account</a>
            </div>
          </article>
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

export default Profile;


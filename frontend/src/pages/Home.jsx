import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/styles.css';

function Home() {
  const [filters, setFilters] = useState({
    foodType: '',
    distance: '',
    pickup_window: ''
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFilters({
      foodType: '',
      distance: '',
      pickup_window: ''
    });
  };

  const donations = [
    {
      id: 1,
      name: 'Dining Hall A',
      title: 'Prepared meals • 35 servings',
      description: 'Allergens: contains soy, gluten',
      location: 'East Campus',
      window: '2:30–3:30 PM',
      distance: '~1.2 miles',
      tags: ['Veg', 'Low sodium', 'Hot-held'],
      status: 'Pickup by 3:30 PM',
      statusType: 'warn'
    },
    {
      id: 2,
      name: 'Dining Hall B',
      title: 'Produce • 60 lbs mixed greens',
      description: 'Allergens: none reported',
      location: 'South Dock',
      window: '1:15–4:00 PM',
      distance: '~3.4 miles',
      tags: ['Refrigerated', 'Boxes'],
      status: 'Ready now',
      statusType: ''
    },
    {
      id: 3,
      name: 'Campus Bakery',
      title: 'Baked goods • 48 items',
      description: 'Allergens: contains gluten',
      location: 'North Gate',
      window: '12:00–5:00 PM',
      distance: '~0.8 miles',
      tags: ['Room temp', 'Assorted'],
      status: 'Ready now',
      statusType: ''
    }
  ];

  return (
    <>
      <Navigation />
      <main>
        <section className="container hero">
          <h1 className="h1">Available Donations Nearby</h1>
          <p className="muted">Filter by food type, pickup window, or distance. Listings update in real-time.</p>

          <form 
            className="card pad filters" 
            role="search" 
            aria-label="Donation filters"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle filter submission
            }}
          >
            <div className="row">
              <div className="field">
                <label htmlFor="foodType">Food type</label>
                <select 
                  id="foodType" 
                  name="foodType"
                  value={filters.foodType}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option>Prepared meals</option>
                  <option>Produce</option>
                  <option>Baked goods</option>
                  <option>Dairy</option>
                  <option>Mixed</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="distance">Distance</label>
                <select 
                  id="distance" 
                  name="distance"
                  value={filters.distance}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="3">≤ 3 miles</option>
                  <option value="5">≤ 5 miles</option>
                  <option value="10">≤ 10 miles</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="window">Pickup window</label>
                <select 
                  id="window" 
                  name="pickup_window"
                  value={filters.pickup_window}
                  onChange={handleFilterChange}
                >
                  <option value="">Any time</option>
                  <option value="now">Ready now</option>
                  <option value="1h">Within 1 hour</option>
                  <option value="today">By end of day</option>
                </select>
              </div>
            </div>

            <div className="kv">
              <button type="submit" className="btn">Apply filters</button>
              <button type="button" className="btn ghost" onClick={handleReset}>Reset</button>
              <span className="status" aria-live="polite">Live: connected</span>
            </div>
          </form>
        </section>

        <section className="container stack" aria-labelledby="listings-title">
          <h2 id="listings-title" className="h2">Listings</h2>

          <div className="cards" role="list">
            {donations.map((donation) => (
              <article key={donation.id} className="card pad" role="listitem">
                <div className="kv" style={{justifyContent:'space-between', alignItems:'center'}}>
                  <strong>{donation.name}</strong>
                  <span className={`status ${donation.statusType}`} title="Pickup soon">
                    {donation.status}
                  </span>
                </div>
                <h3 className="h2" style={{marginTop:'.25rem'}}>{donation.title}</h3>
                <p className="muted">{donation.description}</p>
                <div className="kv" style={{margin:'.6rem 0'}}>
                  <span>Location: {donation.location}</span>
                  <span>Window: {donation.window}</span>
                  <span>{donation.distance}</span>
                </div>
                <div className="kv">
                  {donation.tags.map((tag, idx) => (
                    <span key={idx}>{tag}</span>
                  ))}
                </div>
                <div className="kv" style={{marginTop:'.8rem'}}>
                  <button 
                    className="btn" 
                    aria-label={`Claim donation from ${donation.name}`}
                  >
                    Claim
                  </button>
                  <button 
                    className="btn ghost" 
                    aria-label={`View details for ${donation.name}`}
                  >
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="muted" style={{textAlign:'center'}}>
            Don't see your listing? <a href="/sell" className="muted" style={{textDecoration:'underline'}}>Post a donation</a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;


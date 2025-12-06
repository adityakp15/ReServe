import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { listingsAPI } from '../utils/api';
import '../styles/styles.css';
import '../styles/buy.css';

function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    foodType: '',
    hall: '',
    pickup_window: ''
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListings = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const query = { limit: 6 };

      if (appliedFilters.hall) query.hall = appliedFilters.hall;
      if (appliedFilters.foodType) query.diet = appliedFilters.foodType;
      if (appliedFilters.pickup_window) {
      }

      const response = await listingsAPI.getListings(query);
      setProducts(response.listings || []);
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFilters({
      foodType: '',
      hall: '',
      pickup_window: ''
    });
  };

  const getBadgeClass = (tag) => {
    if (!tag) return 'badge';
    const t = tag.toLowerCase();
    if (t.includes('vegetarian') || t.includes('vegan') || t.includes('halal') || t.includes('gluten free')) return 'badge--veg';
    if (t.includes('pesc')) return 'badge--pesc';
    if (t.includes('protein')) return 'badge--protein';
    return 'badge';
  };

  return (
    <>
      <Navigation />
      <main>
        <section className="container hero">
          <h1 className="h1">Available Donations Nearby</h1>
          <p className="muted">Filter by food type, dining hall, or pickup window. Listings update in real-time.</p>

          <form
            className="card pad filters"
            role="search"
            aria-label="Donation filters"
            onSubmit={(e) => {
              e.preventDefault();
              loadListings(filters);
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
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="hall">Dining Hall</label>
                <select
                  id="hall"
                  name="hall"
                  value={filters.hall}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="Ikenberry Dining">Ikenberry</option>
                  <option value="ISR">ISR</option>
                  <option value="FAR">FAR</option>
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
          <h2 id="listings-title" className="h2">Recent Listings</h2>

          {loading ? (
            <p className="muted" style={{ textAlign: 'center' }}>Loading listings...</p>
          ) : (
            <section className="card-grid-inline" id="cards">
              {products.length === 0 ? (
                <p className="muted" style={{ textAlign: 'center', width: '100%' }}>No active listings found.</p>
              ) : (
                products.map((product) => (
                  <article key={product.id || product._id} className="card pad product">
                    <div className="product-body">
                      <div className="product-topline">
                        <strong className="product-title">{product.title}</strong>
                        <span className="pill pill--fresh">
                          <span className="mins">{product.fresh ? product.fresh : '0'}</span> mins
                        </span>
                      </div>

                      <div className="product-meta">
                        <div className="meta-row">
                          <span className="emoji">📍</span>
                          <span>{product.hall || product.location}</span>
                        </div>
                        <div className="meta-row">
                          <span className="emoji">⏰</span>
                          <span>{product.time}</span>
                        </div>
                        <div className="badges">
                          <span className={`badge ${getBadgeClass(product.tags)}`}>{product.tags}</span>
                          <span className="badge badge--allergen">Allergens: {product.allergens}</span>
                        </div>
                      </div>

                      <div className="product-inv muted">
                        <strong>{product.available || product.availableUnits} {product.unitLabel || 'meals'}</strong> • ${Number(product.price).toFixed(2)}
                      </div>
                    </div>

                    <div className="product-cta">
                      <button
                        className="btn btn--primary btn--block"
                        onClick={() => navigate('/buy')}
                        aria-label={`Show listing for ${product.title}`}
                      >
                        Show Listing
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          )}

          <p className="muted" style={{ textAlign: 'center' }}>
            Don't see your listing? <a href="/sell" className="muted" style={{ textDecoration: 'underline' }}>Post a donation</a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;

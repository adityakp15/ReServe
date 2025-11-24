import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/buy.css';

function Buy() {
  const [filters, setFilters] = useState({
    search: '',
    diet: 'All',
    hall: 'All',
    maxPrice: ''
  });
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Veggie Pasta Primavera',
      desc: 'Penne + seasonal vegetables, marinara; parmesan optional.',
      hall: 'ISR – Main Entrance',
      time: '03:19 AM – 04:25 AM',
      available: 24,
      price: 2.50,
      fresh: 30,
      tags: 'Vegetarian',
      allergens: 'Gluten'
    },
    {
      id: 2,
      title: 'Grilled Chicken & Rice Bowl',
      desc: 'Brown rice, steamed veggies, grilled chicken.',
      hall: 'Ikenberry Dining – South Lobby',
      time: '03:28 AM – 04:43 AM',
      available: 18,
      price: 3.50,
      fresh: 55,
      tags: 'High Protein',
      allergens: 'Soy'
    },
    {
      id: 3,
      title: 'Salmon Trays (6oz)',
      desc: 'Baked salmon portions with lemon.',
      hall: 'FAR – Loading Bay Window',
      time: '03:43 AM – 05:13 AM',
      available: 10,
      price: 5,
      fresh: 80,
      tags: 'Pescatarian',
      allergens: 'Fish'
    }
  ]);
  const [quantities, setQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  const fmtUSD = (n) => `$${Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 2)}`;

  useEffect(() => {
    let filtered = [...products];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.hall.toLowerCase().includes(query) ||
        p.tags.toLowerCase().includes(query)
      );
    }

    if (filters.diet !== 'All') {
      filtered = filtered.filter(p => 
        p.tags.toLowerCase().includes(filters.diet.toLowerCase())
      );
    }

    if (filters.hall !== 'All') {
      filtered = filtered.filter(p => 
        p.hall.toLowerCase().includes(filters.hall.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    if (onlyAvailable) {
      filtered = filtered.filter(p => p.available > 0);
    }

    setFilteredProducts(filtered);
  }, [filters, onlyAvailable, products]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.id === 'q' ? 'search' : e.target.id === 'maxPrice' ? 'maxPrice' : e.target.id]: e.target.value
    });
  };

  const setQty = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: Math.max(0, Math.min(products.find(p => p.id === productId)?.available || 0, value))
    });
  };

  const handleReserve = (product) => {
    const qty = quantities[product.id] || 0;
    if (qty <= 0) {
      alert("Can't reserve yet. Please choose a quantity greater than 0.");
      return;
    }
    alert(`Reserved ${qty} unit(s) of ${product.title} for ${fmtUSD(qty * product.price)}.`);
    setQty(product.id, 0);
  };

  const getBadgeClass = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes('vegetarian') || t.includes('vegan') || t.includes('halal') || t.includes('gluten free')) return 'badge--veg';
    if (t.includes('pesc')) return 'badge--pesc';
    if (t.includes('protein')) return 'badge--protein';
    return 'badge';
  };

  return (
    <>
      <Navigation />
      <main className="app">
        <div className="container">
          <section className="hero">
            <h1 className="h1">Browse Available Food</h1>
            <p className="muted">Real-time surplus from dining halls. Claim within the pickup window.</p>
          </section>

          <section className="card pad filters-card">
            <div className="filters-grid">
              <div className="field">
                <label htmlFor="q">Search</label>
                <input 
                  id="q" 
                  className="input" 
                  placeholder="Search meals, tags, locations…"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="field">
                <label htmlFor="diet">Dietary</label>
                <select 
                  id="diet" 
                  className="select"
                  value={filters.diet}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Pescatarian</option>
                  <option>High Protein</option>
                  <option>Halal</option>
                  <option>Gluten Free</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="hall">Dining Hall</label>
                <select 
                  id="hall" 
                  className="select"
                  value={filters.hall}
                  onChange={handleFilterChange}
                >
                  <option>All</option>
                  <option>Ikenberry Dining</option>
                  <option>ISR</option>
                  <option>FAR</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="maxPrice">Max Price (USD)</label>
                <input 
                  id="maxPrice" 
                  className="input" 
                  inputMode="decimal" 
                  placeholder=""
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-actions-row">
              <button 
                id="applyFilters" 
                className="btn btn--primary"
                onClick={() => {/* Filters apply automatically */}}
              >
                Apply filters
              </button>
              <button 
                id="clearFilters" 
                className="btn ghost"
                onClick={() => {
                  setFilters({ search: '', diet: 'All', hall: 'All', maxPrice: '' });
                  setOnlyAvailable(false);
                }}
              >
                Reset
              </button>
              <button 
                id="onlyAvail" 
                className={`btn ghost toggle-btn ${onlyAvailable ? 'active' : ''}`}
                onClick={() => setOnlyAvailable(!onlyAvailable)}
              >
                Show Only Available
              </button>
            </div>
          </section>

          <section className="card-list" id="cards">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] || 0;
              return (
                <article key={product.id} className="card pad product">
                  <div className="product-body">
                    <div className="product-topline">
                      <h3 className="product-title link-like">{product.title}</h3>
                      <span className="pill pill--fresh">
                        <span className="mins">{product.fresh}</span> mins
                      </span>
                    </div>
                    <p className="muted line-clamp-1">{product.desc}</p>

                    <div className="product-meta">
                      <div className="meta-row">
                        <span className="emoji">📍</span><span>{product.hall}</span>
                      </div>
                      <div className="meta-row">
                        <span className="emoji">⏰</span><span>{product.time}</span>
                      </div>
                      <div className="badges">
                        <span className={`badge ${getBadgeClass(product.tags)}`}>{product.tags}</span>
                        <span className="badge badge--allergen">Allergens: {product.allergens}</span>
                      </div>
                    </div>

                    <div className="product-inv muted">
                      <strong>{product.available} meals</strong> • {fmtUSD(product.price)}
                    </div>
                  </div>

                  <div className="product-cta">
                    <div className="qty-row">
                      <select 
                        className="select qty"
                        value={qty}
                        onChange={(e) => setQty(product.id, Number(e.target.value))}
                      >
                        {Array.from({ length: product.available + 1 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                      <button 
                        className="btn icon minus"
                        onClick={() => setQty(product.id, qty - 1)}
                      >
                        −
                      </button>
                      <button 
                        className="btn icon plus"
                        onClick={() => setQty(product.id, qty + 1)}
                      >
                        +
                      </button>
                      <button 
                        className="btn ghost max"
                        onClick={() => setQty(product.id, product.available)}
                      >
                        Max
                      </button>
                      <button 
                        className="btn ghost clear"
                        onClick={() => setQty(product.id, 0)}
                      >
                        Clear
                      </button>
                    </div>
                    <button 
                      className="btn btn--primary btn--block reserve"
                      onClick={() => handleReserve(product)}
                    >
                      {qty > 0 ? `Reserve • ${fmtUSD(qty * product.price)}` : 'Reserve'}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Buy;


import { useState, useMemo } from 'react';
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
  const [products] = useState([
    {
      id: 1,
      title: 'Veggie Pasta Primavera',
      desc: 'Penne + seasonal vegetables, marinara; parmesan optional.',
      fullDesc: 'Fresh penne pasta tossed with seasonal vegetables including bell peppers, zucchini, cherry tomatoes, and broccoli in a light marinara sauce. Topped with fresh basil and optional parmesan cheese. A hearty and healthy vegetarian option.',
      hall: 'ISR – Main Entrance',
      time: '03:19 AM – 04:25 AM',
      available: 24,
      price: 2.5,
      fresh: 30,
      tags: 'Vegetarian',
      allergens: 'Gluten',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
      ingredients: 'Penne pasta, bell peppers, zucchini, cherry tomatoes, broccoli, marinara sauce, basil, olive oil, garlic, parmesan (optional)',
      nutrition: { calories: 420, protein: '14g', carbs: '68g', fat: '10g' },
      pickupInstructions: 'Please bring your own container. Items are kept warm in insulated containers at the main entrance desk.'
    },
    {
      id: 2,
      title: 'Grilled Chicken & Rice Bowl',
      desc: 'Brown rice, steamed veggies, grilled chicken.',
      fullDesc: 'Protein-packed bowl featuring tender grilled chicken breast over fluffy brown rice, accompanied by steamed seasonal vegetables including carrots, snap peas, and edamame. Finished with a light sesame-soy glaze.',
      hall: 'Ikenberry Dining – South Lobby',
      time: '03:28 AM – 04:43 AM',
      available: 18,
      price: 3.5,
      fresh: 55,
      tags: 'High Protein',
      allergens: 'Soy',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      ingredients: 'Grilled chicken breast, brown rice, carrots, snap peas, edamame, sesame oil, soy sauce, ginger, garlic',
      nutrition: { calories: 520, protein: '42g', carbs: '54g', fat: '12g' },
      pickupInstructions: 'Available at the South Lobby service counter. Please show your reservation confirmation.'
    },
    {
      id: 3,
      title: 'Salmon Trays (6oz)',
      desc: 'Baked salmon portions with lemon.',
      fullDesc: 'Premium 6oz Atlantic salmon fillet, oven-baked to perfection with fresh lemon, dill, and a touch of olive oil. Served with roasted asparagus and herb-seasoned quinoa. Rich in omega-3 fatty acids.',
      hall: 'FAR – Loading Bay Window',
      time: '03:43 AM – 05:13 AM',
      available: 10,
      price: 5,
      fresh: 80,
      tags: 'Pescatarian',
      allergens: 'Fish',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      ingredients: 'Atlantic salmon, lemon, dill, olive oil, asparagus, quinoa, garlic, herbs, sea salt, black pepper',
      nutrition: { calories: 480, protein: '38g', carbs: '28g', fat: '22g' },
      pickupInstructions: 'Pick up at the Loading Bay Window between specified hours. Meals are individually wrapped and labeled.'
    }
  ]);
  const [quantities, setQuantities] = useState({});
  const [modal, setModal] = useState(null);
  const [detailQty, setDetailQty] = useState(0);

  const fmtUSD = (n) => `$${Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 2)}`;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.hall.toLowerCase().includes(query) ||
        p.tags.toLowerCase().includes(query)
      );
    }

    if (filters.diet !== 'All') {
      filtered = filtered.filter((p) =>
        p.tags.toLowerCase().includes(filters.diet.toLowerCase())
      );
    }

    if (filters.hall !== 'All') {
      filtered = filtered.filter((p) =>
        p.hall.toLowerCase().includes(filters.hall.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    if (onlyAvailable) {
      filtered = filtered.filter((p) => p.available > 0);
    }

    return filtered;
  }, [filters, onlyAvailable, products]);

  const handleFilterChange = (e) => {
    const key =
      e.target.id === 'q'
        ? 'search'
        : e.target.id === 'maxPrice'
          ? 'maxPrice'
          : e.target.id;
    setFilters({
      ...filters,
      [key]: e.target.value
    });
  };

  const setQty = (productId, value) => {
    setQuantities((prev) => {
      const product = products.find((p) => p.id === productId);
      const max = product ? product.available : 0;
      return {
        ...prev,
        [productId]: Math.max(0, Math.min(max, value))
      };
    });
  };

  const openDetail = (product) => {
    setDetailQty(quantities[product.id] || 0);
    setModal({ type: 'detail', product });
  };

  const closeModal = () => {
    setModal(null);
    setDetailQty(0);
  };

  const openError = (
    title = "Can't reserve yet",
    message = 'Please choose a quantity greater than 0.'
  ) => {
    setModal({ type: 'error', title, message });
  };

  const openSuccess = (product, qty) => {
    setModal({ type: 'success', product, qty });
  };

  const handleReserve = (product, qtyOverride) => {
    const qty = qtyOverride ?? quantities[product.id] ?? 0;
    if (qty <= 0) {
      openError();
      return;
    }
    openSuccess(product, qty);
    setQty(product.id, 0);
    setDetailQty(0);
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

          <section className="card-grid-inline" id="cards">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] || 0;
              return (
                <article key={product.id} className="card pad product">
                  {product.image && (
                    <div className="product-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                  )}
                  <div className="product-body">
                    <div className="product-topline">
                      <button
                        type="button"
                        className="product-title link-like"
                        onClick={() => openDetail(product)}
                        style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                      >
                        {product.title}
                      </button>
                      <span className="pill pill--fresh">
                        <span className="mins">{product.fresh}</span> mins
                      </span>
                    </div>

                    <div className="product-meta">
                      <div className="meta-row">
                        <span className="emoji">📍</span>
                        <span>{product.hall}</span>
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
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn icon minus"
                        onClick={() => setQty(product.id, qty - 1)}
                      >
                        −
                      </button>
                      <span className="qty-display">{qty}</span>
                      <button
                        type="button"
                        className="btn icon plus"
                        onClick={() => setQty(product.id, qty + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn ghost max"
                        onClick={() => setQty(product.id, product.available)}
                      >
                        Max
                      </button>
                      <button
                        type="button"
                        className="btn ghost clear"
                        onClick={() => setQty(product.id, 0)}
                      >
                        Clear
                      </button>
                    </div>
                    <button
                      type="button"
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
      {modal && (
        <div className="modal" aria-hidden="false">
          <div className="modal__backdrop" onClick={closeModal}></div>
          <div className="modal__panel" role="dialog" aria-modal="true">
            <div className="modal__content">
              {modal.type === 'detail' && (
                <div className="product-detail">
                  {modal.product.image && (
                    <div className="modal-product-image">
                      <img src={modal.product.image} alt={modal.product.title} />
                    </div>
                  )}
                  <div className="product-topline">
                    <h3>{modal.product.title}</h3>
                    <span className="pill pill--fresh">
                      <span className="mins">{modal.product.fresh}</span> mins
                    </span>
                  </div>
                  
                  <div className="modal-section">
                    <h4 className="modal-section-title">Description</h4>
                    <p className="muted">{modal.product.fullDesc || modal.product.desc}</p>
                  </div>

                  {modal.product.ingredients && (
                    <div className="modal-section">
                      <h4 className="modal-section-title">Ingredients</h4>
                      <p className="muted modal-ingredients">{modal.product.ingredients}</p>
                    </div>
                  )}

                  {modal.product.nutrition && (
                    <div className="modal-section">
                      <h4 className="modal-section-title">Nutrition (per serving)</h4>
                      <div className="nutrition-grid">
                        <div className="nutrition-item">
                          <span className="nutrition-label">Calories</span>
                          <span className="nutrition-value">{modal.product.nutrition.calories}</span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Protein</span>
                          <span className="nutrition-value">{modal.product.nutrition.protein}</span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Carbs</span>
                          <span className="nutrition-value">{modal.product.nutrition.carbs}</span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Fat</span>
                          <span className="nutrition-value">{modal.product.nutrition.fat}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="modal-section">
                    <h4 className="modal-section-title">Pickup Details</h4>
                    <div className="product-meta">
                      <div className="meta-row">
                        <span className="emoji">📍</span>
                        <span>{modal.product.hall}</span>
                      </div>
                      <div className="meta-row">
                        <span className="emoji">⏰</span>
                        <span>{modal.product.time}</span>
                      </div>
                    </div>
                    {modal.product.pickupInstructions && (
                      <p className="muted pickup-instructions">{modal.product.pickupInstructions}</p>
                    )}
                  </div>

                  <div className="modal-section">
                    <div className="badges">
                      <span className={`badge ${getBadgeClass(modal.product.tags)}`}>{modal.product.tags}</span>
                      <span className="badge badge--allergen">Allergens: {modal.product.allergens}</span>
                    </div>
                  </div>

                  <div className="product-inv muted modal-price">
                    <strong>{modal.product.available} meals available</strong> • {fmtUSD(modal.product.price)} per meal
                  </div>
                  <div className="qty-row in-modal">
                    <select
                      className="select select--sm qty"
                      value={detailQty}
                      onChange={(e) => setDetailQty(Math.max(0, Math.min(modal.product.available, Number(e.target.value))))}
                    >
                      {Array.from({ length: modal.product.available + 1 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn icon minus"
                      onClick={() => setDetailQty((prev) => Math.max(0, prev - 1))}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="btn icon plus"
                      onClick={() => setDetailQty((prev) => Math.min(modal.product.available, prev + 1))}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn ghost max"
                      onClick={() => setDetailQty(modal.product.available)}
                    >
                      Max
                    </button>
                    <button
                      type="button"
                      className="btn ghost clear"
                      onClick={() => setDetailQty(0)}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn--primary btn--block"
                      onClick={() => handleReserve(modal.product, detailQty)}
                    >
                      {detailQty > 0 ? `Reserve • ${fmtUSD(detailQty * modal.product.price)}` : 'Reserve'}
                    </button>
                    <button type="button" className="btn ghost btn--block" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}

              {modal.type === 'success' && (
                <div className="modal-confirm">
                  <div className="icon ok">✓</div>
                  <h3>Reservation confirmed</h3>
                  <p>
                    You reserved <strong>{modal.qty}</strong> unit{modal.qty > 1 ? 's' : ''} of{' '}
                    <strong>{modal.product.title}</strong> for <strong>{fmtUSD(modal.qty * modal.product.price)}</strong>.
                  </p>
                  <p className="muted">
                    Pick up at <strong>{modal.product.hall}</strong> during <strong>{modal.product.time}</strong>.
                  </p>
                  <div className="modal-actions single">
                    <button type="button" className="btn btn--block" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}

              {modal.type === 'error' && (
                <div className="modal-confirm">
                  <div className="icon bad">!</div>
                  <h3>{modal.title}</h3>
                  <p>{modal.message}</p>
                  <div className="modal-actions single">
                    <button type="button" className="btn btn--block" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Buy;


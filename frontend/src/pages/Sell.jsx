import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/sell.css';

function Sell() {
  const DIETARY = ["Vegetarian", "Vegan", "Pescatarian", "High Protein", "Halal", "Gluten Free", "Other"];
  const ALLERGENS = ["Gluten", "Dairy", "Nuts", "Soy", "Eggs", "Shellfish", "Fish", "Sesame", "Other"];

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    units: '',
    unitLabel: 'meals',
    price: '',
    location: '',
    winFrom: '',
    winTo: '',
    stype: 'Dining Hall',
    dhall: '',
    rname: '',
    rsoname: '',
    cname: '',
    cemail: '',
    cphone: '',
    dietOther: '',
    allerOther: ''
  });

  const [selectedDiet, setSelectedDiet] = useState(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fmtUSD = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const toggleDiet = (item) => {
    const newSet = new Set(selectedDiet);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setSelectedDiet(newSet);
  };

  const toggleAllergen = (item) => {
    const newSet = new Set(selectedAllergens);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setSelectedAllergens(newSet);
  };

  const clearSection = (section) => {
    switch (section) {
      case 'basics':
        setFormData({ ...formData, title: '', desc: '' });
        break;
      case 'qty':
        setFormData({ ...formData, units: '', unitLabel: 'meals', price: '' });
        break;
      case 'pickup':
        setFormData({ ...formData, location: '', winFrom: '', winTo: '' });
        break;
      case 'seller':
        setFormData({ ...formData, dhall: '', rname: '', rsoname: '', cname: '', cemail: '', cphone: '', stype: 'Dining Hall' });
        break;
      case 'diet':
        setSelectedDiet(new Set());
        setSelectedAllergens(new Set());
        setFormData({ ...formData, dietOther: '', allerOther: '' });
        break;
      case 'all':
        setFormData({
          title: '', desc: '', units: '', unitLabel: 'meals', price: '',
          location: '', winFrom: '', winTo: '', stype: 'Dining Hall',
          dhall: '', rname: '', rsoname: '', cname: '', cemail: '', cphone: '',
          dietOther: '', allerOther: ''
        });
        setSelectedDiet(new Set());
        setSelectedAllergens(new Set());
        setErrors({});
        break;
      default:
        break;
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.desc.trim()) newErrors.description = 'Description is required.';
    
    const units = Number(formData.units);
    if (!Number.isInteger(units) || units <= 0) newErrors.units = 'Enter a whole number greater than 0.';
    if (!formData.unitLabel) newErrors.unitLabel = 'Unit label is required.';
    if (!Number.isFinite(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Enter a valid price (USD).';
    }
    
    if (!formData.location.trim()) newErrors.location = 'Pickup location is required.';
    if (!formData.winFrom) newErrors.windowFrom = 'Pickup start is required.';
    if (!formData.winTo) newErrors.windowTo = 'Pickup end is required.';
    if (formData.winFrom && formData.winTo && new Date(formData.winTo) <= new Date(formData.winFrom)) {
      newErrors.windowTo = 'End must be after start.';
    }
    
    if (formData.stype === 'Dining Hall' && !formData.dhall) {
      newErrors.diningHall = 'Select a dining hall.';
    }
    if (formData.stype === 'Restaurant' && !formData.rname.trim()) {
      newErrors.restaurantName = 'Restaurant name is required.';
    }
    if (formData.stype === 'RSO' && !formData.rsoname.trim()) {
      newErrors.rsoName = 'RSO name is required.';
    }
    
    if (!formData.cname.trim()) newErrors.contactName = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.cemail)) newErrors.contactEmail = 'Valid email required.';
    if (!/^[0-9+\-\s()]{7,}$/.test(formData.cphone)) newErrors.contactPhone = 'Valid phone required.';
    
    if (selectedDiet.has('Other') && !formData.dietOther.trim()) {
      newErrors.dietOther = 'Provide details for \'Other\'.';
    }
    if (selectedAllergens.has('Other') && !formData.allerOther.trim()) {
      newErrors.allergenOther = 'Provide details for \'Other\'.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowModal(true);
      clearSection('all');
    }
  };

  return (
    <>
      <Navigation />
      <main className="container main-content">
        <section className="hero">
          <h1 className="h1">Post a Donation</h1>
          <p className="muted">List surplus food for students and NGOs to reserve.</p>
        </section>

        <form id="sellForm" className="card pad" onSubmit={handleSubmit} noValidate>
          <section className="sell-section">
            <div className="sell-section__hdr">
              <h3 className="sell-section__title">Basics</h3>
              <button type="button" className="btn ghost section-clear" onClick={() => clearSection('basics')}>
                Clear section
              </button>
            </div>
            <div className="grid grid-12">
              <div className="col-span-6 field">
                <label className="label" htmlFor="title">Title <span className="req">*</span></label>
                <input id="title" className="input" required value={formData.title} onChange={handleChange} name="title" />
                <div className="hint">Summarize the item (e.g., "Grilled Chicken & Rice Bowl").</div>
                {errors.title && <div className="error">{errors.title}</div>}
              </div>
              <div className="col-span-6 field">
                <label className="label" htmlFor="desc">Description <span className="req">*</span></label>
                <textarea id="desc" className="textarea" required value={formData.desc} onChange={handleChange} name="desc"></textarea>
                <div className="hint">Key ingredients, reheating notes, or pickup instructions.</div>
                {errors.description && <div className="error">{errors.description}</div>}
              </div>
            </div>
          </section>

          <section className="sell-section">
            <div className="sell-section__hdr">
              <h3 className="sell-section__title">Quantity & Pricing</h3>
              <button type="button" className="btn ghost section-clear" onClick={() => clearSection('qty')}>
                Clear section
              </button>
            </div>
            <div className="grid grid-12">
              <div className="col-span-3 field">
                <label className="label" htmlFor="units">Available Units <span className="req">*</span></label>
                <input id="units" className="input" type="number" min="0" step="1" inputMode="numeric" required 
                       value={formData.units} onChange={handleChange} name="units" />
                <div className="hint">Whole numbers only (e.g., 24).</div>
                {errors.units && <div className="error">{errors.units}</div>}
              </div>
              <div className="col-span-3 field">
                <label className="label" htmlFor="unitLabel">Unit Label <span className="req">*</span></label>
                <select id="unitLabel" className="select" required value={formData.unitLabel} onChange={handleChange} name="unitLabel">
                  <option value="meals">meals</option>
                  <option value="lbs">lbs</option>
                  <option value="trays">trays</option>
                  <option value="slices">slices</option>
                  <option value="boxes">boxes</option>
                </select>
                <div className="hint">How you're counting (e.g., "meals", "lbs").</div>
                {errors.unitLabel && <div className="error">{errors.unitLabel}</div>}
              </div>
              <div className="col-span-6 field">
                <label className="label" htmlFor="price">Price (USD) <span className="req">*</span></label>
                <input id="price" className="input" type="number" min="0" step="0.01" inputMode="decimal" required 
                       value={formData.price} onChange={handleChange} name="price" />
                <div className="hint" id="pricePreview">
                  {formData.price ? `Preview: ${fmtUSD(Number(formData.price))}` : 'Example: 3 or 3.50'}
                </div>
                {errors.price && <div className="error">{errors.price}</div>}
              </div>
            </div>
          </section>

          <section className="sell-section">
            <div className="sell-section__hdr">
              <h3 className="sell-section__title">Pickup</h3>
              <button type="button" className="btn ghost section-clear" onClick={() => clearSection('pickup')}>
                Clear section
              </button>
            </div>
            <div className="grid grid-12">
              <div className="col-span-6 field">
                <label className="label" htmlFor="location">Location <span className="req">*</span></label>
                <input id="location" className="input" required value={formData.location} onChange={handleChange} name="location" />
                <div className="hint">Building / entrance / desk (e.g., "ISR Main Entrance").</div>
                {errors.location && <div className="error">{errors.location}</div>}
              </div>
              <div className="col-span-3 field">
                <label className="label" htmlFor="winFrom">Window – From <span className="req">*</span></label>
                <input id="winFrom" className="input" type="datetime-local" required 
                       value={formData.winFrom} onChange={handleChange} name="winFrom" />
                {errors.windowFrom && <div className="error">{errors.windowFrom}</div>}
              </div>
              <div className="col-span-3 field">
                <label className="label" htmlFor="winTo">Window – To <span className="req">*</span></label>
                <input id="winTo" className="input" type="datetime-local" required 
                       value={formData.winTo} onChange={handleChange} name="winTo" />
                <div className="hint">End time must be after start.</div>
                {errors.windowTo && <div className="error">{errors.windowTo}</div>}
              </div>
            </div>
          </section>

          <section className="sell-section">
            <div className="sell-section__hdr">
              <h3 className="sell-section__title">Seller</h3>
              <button type="button" className="btn ghost section-clear" onClick={() => clearSection('seller')}>
                Clear section
              </button>
            </div>
            <div className="grid grid-12">
              <div className="col-span-4 field">
                <label className="label" htmlFor="stype">Type <span className="req">*</span></label>
                <select id="stype" className="select" value={formData.stype} onChange={handleChange} name="stype">
                  <option>Dining Hall</option>
                  <option>Restaurant</option>
                  <option>RSO</option>
                  <option>Student/Private</option>
                </select>
              </div>
              {formData.stype === 'Dining Hall' && (
                <div id="diningWrap" className="col-span-4 field">
                  <label className="label" htmlFor="dhall">Dining Hall <span className="req">*</span></label>
                  <select id="dhall" className="select" value={formData.dhall} onChange={handleChange} name="dhall">
                    <option value="">Select…</option>
                    <option>Ikenberry Dining</option>
                    <option>ISR</option>
                    <option>FAR</option>
                  </select>
                  {errors.diningHall && <div className="error">{errors.diningHall}</div>}
                </div>
              )}
              {formData.stype === 'Restaurant' && (
                <div id="restoWrap" className="col-span-8 field">
                  <label className="label" htmlFor="rname">Restaurant Name <span className="req">*</span></label>
                  <input id="rname" className="input" value={formData.rname} onChange={handleChange} name="rname" />
                  {errors.restaurantName && <div className="error">{errors.restaurantName}</div>}
                </div>
              )}
              {formData.stype === 'RSO' && (
                <div id="rsoWrap" className="col-span-8 field">
                  <label className="label" htmlFor="rsoname">RSO Name <span className="req">*</span></label>
                  <input id="rsoname" className="input" value={formData.rsoname} onChange={handleChange} name="rsoname" />
                  {errors.rsoName && <div className="error">{errors.rsoName}</div>}
                </div>
              )}
              <div className="col-span-4 field">
                <label className="label" htmlFor="cname">Contact Name <span className="req">*</span></label>
                <input id="cname" className="input" required value={formData.cname} onChange={handleChange} name="cname" />
                <div className="hint">Person responsible at pickup.</div>
                {errors.contactName && <div className="error">{errors.contactName}</div>}
              </div>
              <div className="col-span-4 field">
                <label className="label" htmlFor="cemail">Contact Email <span className="req">*</span></label>
                <input id="cemail" className="input" type="email" required value={formData.cemail} onChange={handleChange} name="cemail" />
                <div className="hint">We'll share this only with the reserver.</div>
                {errors.contactEmail && <div className="error">{errors.contactEmail}</div>}
              </div>
              <div className="col-span-4 field">
                <label className="label" htmlFor="cphone">Contact Phone <span className="req">*</span></label>
                <input id="cphone" className="input" required value={formData.cphone} onChange={handleChange} name="cphone" />
                <div className="hint">Format like (217) 555-1212 or 217-555-1212.</div>
                {errors.contactPhone && <div className="error">{errors.contactPhone}</div>}
              </div>
            </div>
          </section>

          <section className="sell-section">
            <div className="sell-section__hdr">
              <h3 className="sell-section__title">Dietary & Allergens</h3>
              <button type="button" className="btn ghost section-clear" onClick={() => clearSection('diet')}>
                Clear section
              </button>
            </div>
            <div className="grid grid-12">
              <div className="col-span-6 field">
                <label className="label">Dietary Tags</label>
                <div id="dietChips" className="chip-group">
                  {DIETARY.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${selectedDiet.has(item) ? 'chip--active' : ''}`}
                      onClick={() => toggleDiet(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {selectedDiet.has('Other') && (
                  <div id="dietOtherWrap" className="field" style={{marginTop:'8px'}}>
                    <label className="label" htmlFor="dietOther">Other (required when selected)</label>
                    <input id="dietOther" className="input" value={formData.dietOther} onChange={handleChange} name="dietOther" />
                    {errors.dietOther && <div className="error">{errors.dietOther}</div>}
                  </div>
                )}
              </div>
              <div className="col-span-6 field">
                <label className="label">Allergens</label>
                <div id="allerChips" className="chip-group">
                  {ALLERGENS.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${selectedAllergens.has(item) ? 'chip--active' : ''}`}
                      onClick={() => toggleAllergen(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {selectedAllergens.has('Other') && (
                  <div id="allerOtherWrap" className="field" style={{marginTop:'8px'}}>
                    <label className="label" htmlFor="allerOther">Other (required when selected)</label>
                    <input id="allerOther" className="input" value={formData.allerOther} onChange={handleChange} name="allerOther" />
                    {errors.allergenOther && <div className="error">{errors.allergenOther}</div>}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="row" style={{marginTop:'1.5rem'}}>
            <button className="btn btn--primary" type="submit">Post donation</button>
            <div className="right"></div>
            <button type="button" className="btn ghost" onClick={() => clearSection('all')}>
              Clear all
            </button>
          </div>
        </form>
      </main>

      {showModal && (
        <div id="sellModal" className="modal">
          <button className="modal__scrim" aria-label="Close" onClick={() => setShowModal(false)}></button>
          <div className="modal__dialog">
            <div className="modal__body" id="sellModalBody">
              <div className="modal__success">
                <div className="modal__success-icon">✓</div>
                <div className="modal__success-title">Donation posted</div>
                <div className="modal__success-text">Your donation was posted successfully.</div>
              </div>
            </div>
            <div className="modal__actions" id="sellModalActions">
              <button className="btn btn--primary" id="sellModalClose" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Sell;


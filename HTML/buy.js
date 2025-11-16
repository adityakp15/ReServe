/* Utilities */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const fmtUSD = n => `$${Number(n).toFixed(Number(n) % 1 === 0 ? 0 : 2)}`;

/* Modal helpers */
const modal = {
  root: $('#modal-root'),
  content: $('#modal-content'),
  savedContent: null, // Store previous modal content (actual DOM element, not clone)
  open(contentNode, extraClass=''){
    this.content.innerHTML = '';
    this.root.classList.remove('hidden');
    const panel = this.root.querySelector('.modal__panel');
    panel.className = 'modal__panel ' + extraClass;
    this.content.appendChild(contentNode);
    this.root.setAttribute('aria-hidden','false');
  },
  openNested(contentNode, extraClass=''){
    // Save current content by removing it (preserves event listeners)
    this.savedContent = document.createDocumentFragment();
    while(this.content.firstChild){
      this.savedContent.appendChild(this.content.firstChild);
    }
    this.open(contentNode, extraClass);
  },
  closeNested(){
    // Restore previous modal content (with event listeners intact)
    if(this.savedContent){
      this.content.innerHTML = '';
      this.content.appendChild(this.savedContent);
      this.savedContent = null;
    }
  },
  close(){
    this.root.classList.add('hidden');
    this.content.innerHTML = '';
    this.savedContent = null;
    this.root.setAttribute('aria-hidden','true');
  }
};
$('#modal-root .modal__backdrop').addEventListener('click', ()=>modal.close());

/* Build qty select options up to available */
function buildQtyOptions(selectEl, available){
  selectEl.innerHTML = '';
  for(let i=0;i<=available;i++){
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = String(i);
    selectEl.appendChild(opt);
  }
}

/* Initialize a product card */
function initProductCard(card){
  const price = Number(card.dataset.price);
  const available = Number(card.dataset.available);
  const title = card.dataset.title;

  const qtySel = $('.qty', card);
  const minus = $('.minus', card);
  const plus = $('.plus', card);
  const maxBtn = $('.max', card);
  const clearBtn = $('.clear', card);
  const reserveBtn = $('.reserve', card);

  buildQtyOptions(qtySel, available);

  function qty(){ return Number(qtySel.value || 0); }
  function setQty(v){
    const clamped = Math.max(0, Math.min(available, v));
    qtySel.value = String(clamped);
    updateReserveLabel();
  }
  function updateReserveLabel(){
    const q = qty();
    reserveBtn.textContent = q > 0 ? `Reserve • ${fmtUSD(q*price)}` : 'Reserve';
  }

  qtySel.addEventListener('change', updateReserveLabel);
  minus.addEventListener('click', ()=> setQty(qty()-1));
  plus.addEventListener('click',  ()=> setQty(qty()+1));
  maxBtn.addEventListener('click',()=> setQty(available));
  clearBtn.addEventListener('click',()=> setQty(0));

  /* Title -> detail modal */
  $$('.js-open-modal', card).forEach(el => {
    el.addEventListener('click', () => openDetailModal(card));
  });

  /* Reserve from card -> confirm/error modals */
  reserveBtn.addEventListener('click', () => {
    const q = qty();
    if(q <= 0){
      openErrorModal("Can't reserve yet", "Please choose a quantity greater than 0.");
      return;
    }
    openSuccessModal({
      title,
      qty: q,
      price,
      hall: card.dataset.hall,
      time: card.dataset.time
    });
    setQty(0);                        // reset after success
  });

  updateReserveLabel();
}

/* Detail modal (interactive and centered) */
function openDetailModal(card){
  const price = Number(card.dataset.price);
  const available = Number(card.dataset.available);

  // Build a clean modal body
  const wrap = document.createElement('div');
  wrap.className = 'product-detail';

  // Header
  const h3 = document.createElement('h3');
  h3.textContent = card.dataset.title;
  const pill = document.createElement('span');
  pill.className = 'pill pill--fresh';
  pill.innerHTML = `<span class="mins">${card.dataset.fresh}</span> mins`;

  const headerRow = document.createElement('div');
  headerRow.className = 'product-topline';
  headerRow.append(h3, pill);

  const desc = document.createElement('p');
  desc.className = 'muted';
  desc.textContent = card.dataset.desc;

  const meta = document.createElement('div');
  meta.className = 'product-meta';
  meta.innerHTML = `
    <div class="meta-row"><span class="emoji">📍</span><span>${card.dataset.hall}</span></div>
    <div class="meta-row"><span class="emoji">⏰</span><span>${card.dataset.time}</span></div>
    <div class="badges">
      ${card.dataset.tags ? `<span class="badge ${badgeClass(card.dataset.tags)}">${card.dataset.tags}</span>` : ''}
      ${card.dataset.allergens ? `<span class="badge badge--allergen">Allergens: ${card.dataset.allergens}</span>` : ''}
    </div>
  `;

  const inv = document.createElement('div');
  inv.className = 'product-inv muted';
  inv.innerHTML = `<strong>${available} meals</strong> • ${fmtUSD(price)}`;

  // Qty controls (compact in modal)
  const qtyRow = document.createElement('div');
  qtyRow.className = 'qty-row in-modal';
  qtyRow.innerHTML = `
    <select class="select select--sm qty"></select>
    <button class="btn icon minus">−</button>
    <button class="btn icon plus">+</button>
    <button class="btn ghost max">Max</button>
    <button class="btn ghost clear">Clear</button>
  `;

  const qtySel = $('.qty', qtyRow);
  const minus   = $('.minus', qtyRow);
  const plus    = $('.plus', qtyRow);
  const maxBtn  = $('.max', qtyRow);
  const clrBtn  = $('.clear', qtyRow);
  buildQtyOptions(qtySel, available);

  // Modal action bar
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const reserve = document.createElement('button');
  reserve.className = 'btn btn--primary btn--block';
  reserve.textContent = 'Reserve';
  const close = document.createElement('button');
  close.className = 'btn ghost btn--block';
  close.textContent = 'Close';
  actions.append(reserve, close);

  wrap.append(headerRow, desc, meta, inv, qtyRow, actions);

  // Wire up qty logic in modal
  function qty(){ return Number(qtySel.value||0); }
  function setQty(v){ qtySel.value = String(Math.max(0,Math.min(available,v))); updateReserveBtn(); }
  function updateReserveBtn(){
    const q = qty();
    reserve.textContent = q>0 ? `Reserve • ${fmtUSD(q*price)}` : 'Reserve';
  }
  qtySel.addEventListener('change', updateReserveBtn);
  minus.addEventListener('click', ()=>setQty(qty()-1));
  plus .addEventListener('click', ()=>setQty(qty()+1));
  maxBtn.addEventListener('click', ()=>setQty(available));
  clrBtn.addEventListener('click', ()=>setQty(0));
  updateReserveBtn();

  // Reserve from modal -> confirmation (do NOT close the modal immediately)
  reserve.addEventListener('click', ()=>{
    const q = qty();
    if(q<=0){
      // Show error modal when trying to reserve 0 quantity (nested mode)
      openErrorModal("Can't reserve yet", "Please choose a quantity greater than 0.", true);
      return;
    }
    openSuccessModal({
      title: card.dataset.title,
      qty: q,
      price,
      hall: card.dataset.hall,
      time: card.dataset.time
    });
    // reset the originating card UI
    const originQty = card.querySelector('.qty');
    if(originQty){
      originQty.value = '0';
      const btn = card.querySelector('.reserve');
      if(btn) btn.textContent = 'Reserve';
    }
    // IMPORTANT: do NOT modal.close() here; the success modal replaces content
  });

  close.addEventListener('click', ()=>modal.close());
  modal.open(wrap);
}

function badgeClass(tag){
  const t = tag.toLowerCase();
  if(t.includes('vegetarian')||t.includes('vegan')||t.includes('halal')||t.includes('gluten free')) return 'badge--veg';
  if(t.includes('pesc')) return 'badge--pesc';
  if(t.includes('protein')) return 'badge--protein';
  return 'badge';
}

/* Error & Success confirmation modals */
function openErrorModal(title, message, isNested = false){
  const wrap = document.createElement('div');
  wrap.className = 'modal-confirm';
  wrap.innerHTML = `
    <div class="icon bad">!</div>
    <h3>${title}</h3>
    <p>${message}</p>
    <div class="modal-actions single">
      <button class="btn btn--block">Close</button>
    </div>
  `;
  wrap.querySelector('button').addEventListener('click', ()=>{
    if(isNested){
      modal.closeNested(); // Return to previous modal
    } else {
      modal.close(); // Close completely
    }
  });
  if(isNested){
    modal.openNested(wrap,'');
  } else {
    modal.open(wrap,'');
  }
}

function openSuccessModal({title, qty, price, hall, time}){
  const wrap = document.createElement('div');
  wrap.className = 'modal-confirm';
  wrap.innerHTML = `
    <div class="icon ok">✓</div>
    <h3>Reservation confirmed</h3>
    <p>You reserved <strong>${qty}</strong> unit${qty>1?'s':''} of <strong>${title}</strong> for <strong>${fmtUSD(qty*price)}</strong>.</p>
    <p class="muted">Pick up at <strong>${hall}</strong> during <strong>${time}</strong>.</p>
    <div class="modal-actions single">
      <button class="btn btn--block">Close</button>
    </div>
  `;
  wrap.querySelector('button').addEventListener('click', ()=>modal.close());
  modal.open(wrap,'');
}

/* Page init */
document.addEventListener('DOMContentLoaded', () => {
  $$('.product').forEach(initProductCard);

  // Toggle "Show Only Available" button
  const toggleBtn = $('#onlyAvail');
  if(toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      toggleBtn.classList.toggle('active');
      applyFilters(); // Apply filters when toggle changes
    });
  }

  // Dynamic filtering function
  function applyFilters(){
    const searchQuery = ($('#q')?.value || '').toLowerCase().trim();
    const dietFilter = $('#diet')?.value || 'All';
    const hallFilter = $('#hall')?.value || 'All';
    const maxPrice = $('#maxPrice')?.value ? Number($('#maxPrice').value) : Infinity;
    const onlyAvailable = toggleBtn?.classList.contains('active') || false;

    $$('.product').forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const hall = (card.dataset.hall || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const price = Number(card.dataset.price || 0);
      const available = Number(card.dataset.available || 0);

      let show = true;

      // Search filter (matches title, description, hall, or tags)
      if(searchQuery && !title.includes(searchQuery) && !desc.includes(searchQuery) && 
         !hall.includes(searchQuery) && !tags.includes(searchQuery)){
        show = false;
      }

      // Dietary filter
      if(dietFilter !== 'All' && !tags.includes(dietFilter.toLowerCase())){
        show = false;
      }

      // Dining hall filter
      if(hallFilter !== 'All' && !hall.includes(hallFilter.toLowerCase())){
        show = false;
      }

      // Max price filter
      if(maxPrice !== Infinity && price > maxPrice){
        show = false;
      }

      // Show only available filter
      if(onlyAvailable && available <= 0){
        show = false;
      }

      // Show or hide the card
      card.style.display = show ? '' : 'none';
    });
  }

  // Attach event listeners for dynamic filtering
  $('#q')?.addEventListener('input', applyFilters);
  $('#diet')?.addEventListener('change', applyFilters);
  $('#hall')?.addEventListener('change', applyFilters);
  $('#maxPrice')?.addEventListener('input', applyFilters);

  // Apply filters button (now just triggers the same function)
  $('#applyFilters')?.addEventListener('click', ()=>{
    applyFilters();
    console.log('Filters applied');
  });

  // Filters reset
  $('#clearFilters').addEventListener('click', ()=>{
    $('#q').value=''; 
    $('#diet').value='All'; 
    $('#hall').value='All'; 
    $('#maxPrice').value='';
    // Remove active state from toggle button
    toggleBtn?.classList.remove('active');
    // Reapply filters to show all cards
    applyFilters();
  });
});
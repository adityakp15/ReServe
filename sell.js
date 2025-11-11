document.addEventListener("DOMContentLoaded", () => {
  const log = (...a) => console.log("[SellJS]", ...a);
  log("DOMContentLoaded fired");

  /* shorthands */
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmtUSD = n => n.toLocaleString("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });

  if (!$("#sellForm")) { log("sellForm not found — aborting"); return; }

  /* data */
  const DIETARY   = ["Vegetarian","Vegan","Pescatarian","High Protein","Halal","Gluten Free","Other"];
  const ALLERGENS = ["Gluten","Dairy","Nuts","Soy","Eggs","Shellfish","Fish","Sesame","Other"];
  const state = { diet: new Set(), aller: new Set() };

  /* chip builders */
  function makeChip(label, set, onToggle){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", ()=>{
      if (set.has(label)) set.delete(label); else set.add(label);
      b.classList.toggle("chip--active");
      onToggle();
      log("chip toggled:", label, "active?", b.classList.contains("chip--active"));
    });
    return b;
  }
  function onDietChange(){
    const wrap = $("#dietOtherWrap");
    if (wrap) wrap.hidden = !state.diet.has("Other");
  }
  function onAllerChange(){
    const wrap = $("#allerOtherWrap");
    if (wrap) wrap.hidden = !state.aller.has("Other");
  }
  function mountChips(){
    const dietWrap  = $("#dietChips");
    const allerWrap = $("#allerChips");
    if (dietWrap)  DIETARY.forEach(d => dietWrap.appendChild(makeChip(d, state.diet, onDietChange)));
    if (allerWrap) ALLERGENS.forEach(a => allerWrap.appendChild(makeChip(a, state.aller, onAllerChange)));
    log("chips mounted");
  }

  /* seller dynamic */
  const stype      = $("#stype");
  const diningWrap = $("#diningWrap");
  const restoWrap  = $("#restoWrap");
  const rsoWrap    = $("#rsoWrap");

  function syncSeller(){
    const v = stype ? stype.value : "Dining Hall";
    if (diningWrap) diningWrap.hidden = (v !== "Dining Hall");
    if (restoWrap)  restoWrap.hidden  = (v !== "Restaurant");
    if (rsoWrap)    rsoWrap.hidden    = (v !== "RSO");
    log("syncSeller:", v, { diningHidden: diningWrap?.hidden, restoHidden: restoWrap?.hidden, rsoHidden: rsoWrap?.hidden });
  }

  if (stype) {
    stype.addEventListener("change", syncSeller);
    log("stype listener attached");
  } else {
    log("WARNING: #stype not found");
  }

  /* price preview */
  const price = $("#price");
  if (price){
    price.addEventListener("input", (e)=>{
      const pv = $("#pricePreview");
      const v = e.target.value;
      if (!pv) return;
      if (v === "") { pv.textContent = "Example: 3 or 3.50"; return; }
      const num = Number(v);
      pv.textContent = Number.isFinite(num) && num >= 0 ? `Preview: ${fmtUSD(num)}` : "Invalid amount";
    });
  }

  /* error helpers */
  const hideErr = id => { const n = $("#err-"+id); if (n){ n.hidden = true; n.textContent = ""; } };
  const showErr = (id,msg)=>{ const n = $("#err-"+id); if (n){ n.hidden = false; n.textContent = msg; } };

  /* clears */
  function clearBasics(){ $("#title").value=""; $("#desc").value=""; hideErr("title"); hideErr("description"); }
  function clearQty(){
    $("#units").value=""; $("#unitLabel").value="meals"; $("#price").value="";
    const pv = $("#pricePreview"); if (pv) pv.textContent = "Example: 3 or 3.50";
    hideErr("units"); hideErr("unitLabel"); hideErr("price");
  }
  function clearPickup(){
    $("#location").value=""; $("#winFrom").value=""; $("#winTo").value="";
    hideErr("location"); hideErr("windowFrom"); hideErr("windowTo");
  }
  function clearSeller(){
    $("#dhall").value=""; $("#rname").value=""; $("#rsoname").value="";
    $("#cname").value=""; $("#cemail").value=""; $("#cphone").value="";
    if (stype) stype.value = "Dining Hall";
    syncSeller();
    hideErr("diningHall"); hideErr("restaurantName"); hideErr("rsoName");
    hideErr("contactName"); hideErr("contactEmail"); hideErr("contactPhone");
  }
  function clearDietAller(){
    state.diet.clear(); state.aller.clear();
    $$("#dietChips .chip, #allerChips .chip").forEach(x => x.classList.remove("chip--active"));
    const dof=$("#dietOther"), aof=$("#allerOther"), dow=$("#dietOtherWrap"), aow=$("#allerOtherWrap");
    if (dof) dof.value=""; if (aof) aof.value="";
    if (dow) dow.hidden = true; if (aow) aow.hidden = true;
    hideErr("dietOther"); hideErr("allergenOther");
  }
  function clearAll(){ clearBasics(); clearQty(); clearPickup(); clearSeller(); clearDietAller(); $$(".error").forEach(e=>{e.hidden=true; e.textContent="";}); }

  /* bind clear buttons (defensive if any missing) */
  $("#clearBasics")?.addEventListener("click", clearBasics);
  $("#clearQty")?.addEventListener("click", clearQty);
  $("#clearPickup")?.addEventListener("click", clearPickup);
  $("#clearSeller")?.addEventListener("click", clearSeller);
  $("#clearDietAller")?.addEventListener("click", clearDietAller);
  $("#clearAll")?.addEventListener("click", clearAll);

  /* validation */
  function validate(){
    let ok = true;
    const title = ($("#title")?.value || "").trim();
    const desc  = ($("#desc")?.value  || "").trim();
    if (!title){ showErr("title","Title is required."); ok=false; } else hideErr("title");
    if (!desc){ showErr("description","Description is required."); ok=false; } else hideErr("description");

    const units = Number($("#units")?.value || "");
    const ulabel = ($("#unitLabel")?.value || "").trim();
    const p = Number($("#price")?.value || "");
    if (!Number.isInteger(units) || units <= 0){ showErr("units","Enter a whole number greater than 0."); ok=false; } else hideErr("units");
    if (!ulabel){ showErr("unitLabel","Unit label is required."); ok=false; } else hideErr("unitLabel");
    if (!Number.isFinite(p) || p < 0){ showErr("price","Enter a valid price (USD)."); ok=false; } else hideErr("price");

    const loc = ($("#location")?.value || "").trim();
    const wf = $("#winFrom")?.value || "";
    const wt = $("#winTo")?.value || "";
    if (!loc){ showErr("location","Pickup location is required."); ok=false; } else hideErr("location");
    if (!wf){ showErr("windowFrom","Pickup start is required."); ok=false; } else hideErr("windowFrom");
    if (!wt){ showErr("windowTo","Pickup end is required."); ok=false; } else hideErr("windowTo");
    if (wf && wt && new Date(wt).getTime() <= new Date(wf).getTime()){
      showErr("windowTo","End must be after start."); ok=false;
    }

    const v = stype ? stype.value : "Dining Hall";
    if (v === "Dining Hall" && !($("#dhall")?.value)){ showErr("diningHall","Select a dining hall."); ok=false; } else hideErr("diningHall");
    if (v === "Restaurant" && !($("#rname")?.value || "").trim()){ showErr("restaurantName","Restaurant name is required."); ok=false; } else hideErr("restaurantName");
    if (v === "RSO" && !($("#rsoname")?.value || "").trim()){ showErr("rsoName","RSO name is required."); ok=false; } else hideErr("rsoName");

    const cname = ($("#cname")?.value || "").trim();
    const cemail= ($("#cemail")?.value|| "").trim();
    const cphone= ($("#cphone")?.value|| "").trim();
    if (!cname){ showErr("contactName","Name is required."); ok=false; } else hideErr("contactName");
    if (!/^\S+@\S+\.\S+$/.test(cemail)){ showErr("contactEmail","Valid email required."); ok=false; } else hideErr("contactEmail");
    if (!/^[0-9+\-\s()]{7,}$/.test(cphone)){ showErr("contactPhone","Valid phone required."); ok=false; } else hideErr("contactPhone");

    if (state.diet.has("Other") && !($("#dietOther")?.value || "").trim()){
      showErr("dietOther","Provide details for ‘Other’."); ok=false;
    } else hideErr("dietOther");
    if (state.aller.has("Other") && !($("#allerOther")?.value || "").trim()){
      showErr("allergenOther","Provide details for ‘Other’."); ok=false;
    } else hideErr("allergenOther");

    return ok;
  }

  /* modal */
  const sellModal = $("#sellModal");
  function openSellSuccess(html){
    $("#sellModalBody").innerHTML = `
      <div class="modal__success">
        <div class="modal__success-icon">✓</div>
        <div class="modal__success-title">Donation posted</div>
        <div class="modal__success-text">${html}</div>
      </div>`;
    sellModal.style.display = "grid";
  }
  function closeSellModal(){ sellModal.style.display = "none"; }
  $("#sellModalClose")?.addEventListener("click", closeSellModal);
  sellModal?.querySelector(".modal__scrim")?.addEventListener("click", closeSellModal);

  /* submit */
  $("#sellForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    log("submit clicked");
    if (!validate()) { log("validation failed"); return; }
    openSellSuccess("Your donation was posted successfully.");
    clearAll();
  });

  /* init */
  mountChips();
  syncSeller();
  log("init complete");
});
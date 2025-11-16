/* ======================================
   ReServe — Profile Page (Optional JS)
   - Placeholder for future interactions
   - Currently, no dynamic behavior is required.
   ====================================== */

   (function(){
    // Example: Non-functional Edit buttons can log intent for now.
    document.querySelectorAll('.btn-text').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('Edit clicked for:', btn.closest('.card')?.querySelector('h2')?.textContent || 'Section');
      });
    });
  })();
  
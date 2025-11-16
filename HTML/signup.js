/* ======================================
   ReServe — Sign-Up Validation Script
   - Basic client-side validation:
     1) All fields required
     2) Passwords match
     3) Simple email format check (via input[type=email])
   - Shows inline error message (not alert) for better UX
   ====================================== */

   (function(){
    const form = document.getElementById('signup-form');
    const errorEl = document.getElementById('form-error');
  
    function setError(message){
      errorEl.textContent = message || '';
    }
  
    form.addEventListener('submit', function(e){
      e.preventDefault(); // prevent actual submission for this demo
      setError('');
  
      const fullName = form.fullName.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;
      const accountType = form.querySelector('input[name="accountType"]:checked');
  
      // 1) Required fields
      if(!fullName || !email || !password || !confirmPassword || !accountType){
        setError('Please complete all fields and select an account type.');
        return;
      }
  
      // 2) Password match
      if(password !== confirmPassword){
        setError('Passwords do not match. Please re-enter.');
        return;
      }
  
      // 3) Basic length check
      if(password.length < 8){
        setError('Password must be at least 8 characters long.');
        return;
      }
  
      // If browser says email invalid, block
      if(!form.email.checkValidity()){
        setError('Please enter a valid university email address.');
        return;
      }
  
      // Success state — no real submission needed
      console.log('Form Submitted', {
        fullName,
        email,
        accountType: accountType.value
      });
  
      // Provide a tiny UX cue
      setError('');
      form.reset();
      errorEl.style.color = '#2e7d32';
      setError('Success! Your account has been created (demo).');
      setTimeout(()=> {
        errorEl.textContent = '';
        errorEl.style.color = '#c62828';
      }, 2500);
    });
  })();
  
// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update forms
    const tabName = tab.getAttribute('data-tab');
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(`${tabName}Form`).classList.add('active');
  });
});

// Form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Add your login logic here
  console.log('Login submitted', { email, password });
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (password !== confirmPassword) {
    alert("Passwords don't match");
    return;
  }
  
  // Add your signup logic here
  console.log('Signup submitted', { name, email, password });
});  


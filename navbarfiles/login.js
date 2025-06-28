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

    // Toast notification (keep this the same)
    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toast-message');
      
      toastMessage.textContent = message;
      toast.classList.toggle('error', isError);
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Initialize users in localStorage if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }

    // Form submission - Signup
    document.getElementById('signupForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        showToast("Passwords don't match", true);
        return;
      }
      
      try {
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if user already exists
        const userExists = users.some(user => user.email === email);
        if (userExists) {
          showToast("Email already registered", true);
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          createdAt: new Date().toISOString()
        };
        
        // Add new user to array
        users.push(newUser);
        
        // Save back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        showToast("Account created successfully!");
        
        // Switch to login tab
        document.querySelector('.auth-tab[data-tab="login"]').click();
        
        // Clear form
        this.reset();
      } catch (error) {
        console.error('Signup error:', error);
        showToast("Error creating account", true);
      }
    });

    // Form submission - Login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      try {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(user => user.email === email && user.password === password);
        
        if (!user) {
          showToast("Invalid email or password", true);
          return;
        }
        
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showToast(`Welcome back, ${user.name}!`);
        console.log('Logged in user:', user);
        
        // Here you would typically redirect to a dashboard
        // window.location.href = '/dashboard.html';
        
        // For demonstration, let's just show a success message
        setTimeout(() => {
          alert(`Successfully logged in as ${user.name}`);
        }, 1000);
      } catch (error) {
        console.error('Login error:', error);
        showToast("Error during login", true);
      }
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
      e.preventDefault();
      alert("Password reset functionality would be implemented here");
    });

    // Social login buttons (placeholder functionality)
    document.querySelectorAll('.social-button').forEach(button => {
      button.addEventListener('click', function() {
        alert(`${this.classList.contains('google') ? 'Google' : 'Facebook'} login would be implemented here`);
      });
    });
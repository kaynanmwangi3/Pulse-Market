document.addEventListener('DOMContentLoaded', function() {
      // DOM Elements
      const productGrid = document.getElementById('productGrid');
      const productSearch = document.getElementById('productSearch');
      const cartToggle = document.getElementById('cartToggle');
      const cartSidebar = document.getElementById('cartSidebar');
      const cartItems = document.getElementById('cartItems');
      const cartCount = document.getElementById('cartCount');
      const cartTotal = document.getElementById('cartTotal');
      
      // State
      let products = [];
      let cart = [];
      
      // Fetch Products
      async function fetchProducts() {
        try {
          const response = await fetch('db.json');
          products = await response.json();
          renderProducts(products);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
      
      // Render Products
      function renderProducts(products) {
        productGrid.innerHTML = '';
        const template = document.getElementById('productTemplate').innerHTML;
        
        products.forEach(product => {
          const html = template
            .replace(/\${(\w+)}/g, (_, key) => product[key] || '');
          const div = document.createElement('div');
          div.innerHTML = html;
          productGrid.appendChild(div);
        });
        
        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', addToCart);
        });
      }
      
      // Add to Cart
      function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({
            ...product,
            quantity: 1
          });
        }
        
        updateCart();
      }
      
      // Update Cart
      function updateCart() {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update total
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = totalPrice.toFixed(2);
        
        // Render items
        renderCartItems();
      }
      
      // Render Cart Items
      function renderCartItems() {
        cartItems.innerHTML = '';
        const template = document.getElementById('cartItemTemplate').innerHTML;
        
        cart.forEach(item => {
          const html = template
            .replace(/\${(\w+)}/g, (_, key) => item[key] || '');
          const div = document.createElement('div');
          div.innerHTML = html;
          cartItems.appendChild(div);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', removeFromCart);
        });
      }
      
      // Remove from Cart
      function removeFromCart(e) {
        const productId = parseInt(e.target.closest('.cart-item').dataset.id);
        cart = cart.filter(item => item.id !== productId);
        updateCart();
      }
      
      // Search Products
      productSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
      });
      
      // Toggle Cart
      cartToggle.addEventListener('click', function() {
        document.body.classList.toggle('cart-open');
      });
      
      // Initialize
      fetchProducts();
    });

// Mobile Filter Toggle - Add to DOMContentLoaded event
document.querySelector('.mobile-filter-toggle')?.addEventListener('click', () => {
  document.querySelector('.filters').classList.toggle('active');
});

// Close filters when clicking outside (add this too)
document.addEventListener('click', (e) => {
  const filters = document.querySelector('.filters');
  if (!filters.contains(e.target) && 
      !e.target.closest('.mobile-filter-toggle')) {
    filters.classList.remove('active');
  }
});
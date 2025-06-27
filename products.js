let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch products from db.json
    async function loadProducts() {
      try {
        const response = await fetch('db.json');
        const data = await response.json();
        products = data.products;
        renderProducts(products);
        updateCart();
      } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productGrid').innerHTML = '<p>Error loading products. Please try again later.</p>';
      }
    }

    function renderProducts(productList) {
      const productGrid = document.getElementById('productGrid');
      productGrid.innerHTML = '';
      productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="card-image">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="wishlist" data-id="${product.id}">${isWishlisted(product.id) ? '❤️' : '🤍'}</div>
          </div>
          <div class="card-content">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)} <span class="original-price">$${product.originalPrice.toFixed(2)}</span></p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        `;
        productGrid.appendChild(card);
      });
    }

    function isWishlisted(productId) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      return wishlist.includes(productId);
    }

    function toggleWishlist(productId) {
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
      } else {
        wishlist.push(productId);
      }
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      renderProducts(filterProducts());
    }

    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }

    function updateCart() {
      const cartItems = document.getElementById('cartItems');
      const cartCount = document.getElementById('cartCount');
      const cartTotal = document.getElementById('cartTotal');
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
          <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
        `;
        cartItems.appendChild(itemElement);
      });
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartTotal.textContent = total.toFixed(2);
    }

    function filterProducts() {
      const searchTerm = document.getElementById('productSearch').value.toLowerCase();
      const category = document.getElementById('categoryFilter').value;
      const priceRange = document.getElementById('priceFilter').value;

      return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        let matchesPrice = true;
        if (priceRange === '0-50') matchesPrice = product.price <= 50;
        else if (priceRange === '50-100') matchesPrice = product.price > 50 && product.price <= 100;
        else if (priceRange === '100+') matchesPrice = product.price > 100;
        return matchesSearch && matchesCategory && matchesPrice;
      });
    }

    document.getElementById('searchButton').addEventListener('click', () => {
      renderProducts(filterProducts());
    });

    document.getElementById('productSearch').addEventListener('input', () => {
      renderProducts(filterProducts());
    });

    document.getElementById('categoryFilter').addEventListener('change', () => {
      renderProducts(filterProducts());
    });

    document.getElementById('priceFilter').addEventListener('change', () => {
      renderProducts(filterProducts());
    });

    document.getElementById('productGrid').addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
      }
      if (e.target.classList.contains('wishlist')) {
        const productId = parseInt(e.target.dataset.id);
        toggleWishlist(productId);
      }
    });

    document.getElementById('cartToggle').addEventListener('click', () => {
      document.body.classList.toggle('cart-open');
    });

    document.querySelector('.mobile-filter-toggle').addEventListener('click', () => {
      document.querySelector('.filters').classList.toggle('active');
    });

    // Load products on page load
    loadProducts();
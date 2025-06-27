const BASE_URL = 'https://my-json-server.typicode.com/kaynanmwangi3/pulsemarketjsonserver';
    let cart = [];

    async function fetchProducts() {
      const productsContainer = document.getElementById('products');
      const errorContainer = document.getElementById('error');
      const categoryFilter = document.getElementById('category-filter');
      const priceFilter = document.getElementById('price-filter');

      try {
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();

        // Populate category filter
        const categories = [...new Set(products.map(p => p.category || 'Uncategorized'))];
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

        productsContainer.innerHTML = '';
        if (products.length === 0) {
          errorContainer.style.display = 'block';
          errorContainer.textContent = 'No products found.';
          return;
        }

        function displayProducts(filteredProducts) {
          productsContainer.innerHTML = '';
          filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card rounded-lg shadow-md p-4';
            productCard.innerHTML = `
              <h2 class="text-xl font-semibold text-gray-800">${product.name || product.title || 'Unnamed Product'}</h2>
              <p class="text-gray-600 mt-2">${product.description || 'No description available'}</p>
              <p class="text-green-600 font-bold mt-2">$${product.price || 'N/A'}</p>
              <p class="text-gray-500 mt-1">Category: ${product.category || 'Uncategorized'}</p>
              ${product.image ? `<img src="${product.image}" alt="${product.name || product.title || 'Product'}" class="mt-4 w-full h-48 object-cover rounded">` : ''}
              <button class="add-to-cart-btn mt-4 w-full" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
          });
        }

        // Filter function
        function applyFilters() {
          const searchTerm = document.getElementById('search').value.toLowerCase();
          const selectedCategory = categoryFilter.value;
          const [minPrice, maxPrice] = priceFilter.value.split('-').map(Number) || [0, Infinity];

          const filteredProducts = products.filter(product => {
            const nameMatch = (product.name || product.title || '').toLowerCase().includes(searchTerm);
            const categoryMatch = !selectedCategory || (product.category || 'Uncategorized') === selectedCategory;
            const priceMatch = product.price !== undefined && (isNaN(minPrice) || product.price >= minPrice) && (isNaN(maxPrice) || product.price <= maxPrice);
            return nameMatch && categoryMatch && priceMatch;
          });
          displayProducts(filteredProducts);
        }

        // Event listeners for filters
        document.getElementById('search').addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);

        // Initial display
        applyFilters();
      } catch (error) {
        console.error('Error fetching products:', error);
        errorContainer.style.display = 'block';
        errorContainer.textContent = 'Failed to load products. Please try again later.';
      }
    }

    function addToCart(productId) {
      fetch(`${BASE_URL}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
          const cartItem = { ...product, quantity: 1 };
          const existingItem = cart.find(item => item.id === productId);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push(cartItem);
          }
          updateCart();
        });
    }

    function updateCart() {
      const cartItems = document.getElementById('cart-items');
      const cartTotal = document.getElementById('cart-total');
      cartItems.innerHTML = '';

      cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <span>${item.name || item.title || 'Unnamed Product'} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(itemElement);
      });

      const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2);
      cartTotal.textContent = `Total: $${total}`;
    }

    document.getElementById('toggle-cart').addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.toggle('hidden');
    });

    document.getElementById('order-cart').addEventListener('click', () => {
      if (cart.length > 0) {
        alert(`Order placed for ${cart.length} items! Total: $${cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)}`);
        cart = [];
        updateCart();
      } else {
        alert('Cart is empty!');
      }
    });

    window.onload = fetchProducts;
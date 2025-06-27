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
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // API Configuration
    const BIN_ID = "685e7cdf8561e97a502cb95c"; // Your new Bin ID
    const API_KEY = "$2a$10$0n6H.xwsnv1QcrLc00Zui0nIAyv5AU.eCCSvzPG/YLRvkBkS4ByVe"; // Your key
    
    // Fetch Products
    async function fetchProducts() {
        try {
            console.log("Fetching products from JSONBin...");
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            console.log("API Response Status:", response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(`Failed to fetch products (HTTP ${response.status})`);
            }

            const data = await response.json();
            console.log("API Data Received:", data);
            
            if (!data.record?.products) {
                throw new Error("Products array is missing in the response");
            }

            products = data.record.products;
            console.log("Products Loaded:", products);
            renderProducts(products);
            updateCart();
        } catch (error) {
            console.error("Fetch Error:", error);
            productGrid.innerHTML = `
                <div class="error-message">
                    ❌ Failed to load products. Please try again later.
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()">Retry</button>
                </div>
            `;
            
            // Fallback to test data
            products = [{
                id: 1,
                name: "Test Product (Fallback)",
                price: 99.99,
                image: "placeholder.jpg",
                description: "Sample product loaded locally"
            }];
            renderProducts(products);
        }
    }

    // Render Products
    function renderProducts(productsToRender) {
        console.log("Rendering products:", productsToRender);
        productGrid.innerHTML = '';
        
        if (!productsToRender?.length) {
            productGrid.innerHTML = `
                <div class="empty-message">
                    No products found. Try a different search.
                </div>
            `;
            return;
        }

        const template = document.getElementById('productTemplate')?.innerHTML;
        if (!template) {
            console.error("Product template not found!");
            return;
        }

        productsToRender.forEach(product => {
            try {
                const html = template
                    .replace(/\${id}/g, product.id)
                    .replace(/\${name}/g, product.name)
                    .replace(/\${price}/g, product.price?.toFixed(2) || '0.00')
                    .replace(/\${originalPrice}/g, product.originalPrice?.toFixed(2) || '')
                    .replace(/\${image}/g, `images/${product.image}` || 'placeholder.jpg')
                    .replace(/\${description}/g, product.description || '');

                const div = document.createElement('div');
                div.className = 'product-item';
                div.innerHTML = html;
                
                div.querySelector('.add-to-cart')?.addEventListener('click', addToCart);
                productGrid.appendChild(div);
            } catch (error) {
                console.error("Error rendering product:", product, error);
            }
        });
    }

    // Cart Functions (unchanged from your original)
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotal.textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        renderCartItems();
    }

    function renderCartItems() {
        cartItems.innerHTML = '';
        if (!cart.length) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }

        const template = document.getElementById('cartItemTemplate')?.innerHTML;
        if (!template) return;

        cart.forEach(item => {
            const html = template
                .replace(/\${id}/g, item.id)
                .replace(/\${name}/g, item.name)
                .replace(/\${price}/g, item.price.toFixed(2))
                .replace(/\${quantity}/g, item.quantity)
                .replace(/\${image}/g, `images/${item.image}`)
                .replace(/\${total}/g, (item.price * item.quantity).toFixed(2));

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.dataset.id = item.id;
            div.innerHTML = html;
            cartItems.appendChild(div);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeFromCart);
        });
    }

    function removeFromCart(e) {
        cart = cart.filter(item => item.id !== parseInt(e.target.closest('.cart-item').dataset.id));
        updateCart();
    }

    // Event Listeners
    productSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderProducts(products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.description?.toLowerCase().includes(term)
        ));
    });

    cartToggle.addEventListener('click', () => {
        document.body.classList.toggle('cart-open');
    });

    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && e.target !== cartToggle) {
            document.body.classList.remove('cart-open');
        }
    });

    // Initialize
    fetchProducts();
});
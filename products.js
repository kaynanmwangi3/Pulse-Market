document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productGrid = document.getElementById('productGrid');
    const productSearch = document.getElementById('productSearch');
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Configuration
    const BIN_ID = "685e7cdf8561e97a502cb95c";
    const API_KEY = "$2a$10$0n6H.xwsnv1QcrLc00Zui0nIAyv5AU.eCCSvzPG/YLRvkBkS4ByVe";
    const PLACEHOLDER_IMG = "placeholder.jpg"; // Local fallback image

    // State
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch Products
    async function fetchProducts() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`API request failed`);
            
            const data = await response.json();
            products = data.record.products || [];
            renderProducts(products);
        } catch (error) {
            console.error("Fetch failed:", error);
            loadFallbackProducts();
        }
    }

    function loadFallbackProducts() {
        products = [{
            id: 1,
            name: "Sample Product",
            price: 99.99,
            image: PLACEHOLDER_IMG,
            description: "Example description"
        }];
        renderProducts(products);
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (!productsToRender?.length) {
            productGrid.innerHTML = `<div class="empty">No products found</div>`;
            return;
        }

        const template = document.getElementById('productTemplate');
        if (!template) return;

        productsToRender.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-item';
            
            // Create image path - assumes images are in same directory as HTML
            const imgPath = product.image || PLACEHOLDER_IMG;
            
            div.innerHTML = template.innerHTML
                .replace(/\${id}/g, product.id)
                .replace(/\${name}/g, product.name)
                .replace(/\${price}/g, product.price?.toFixed(2))
                .replace(/\${image}/g, imgPath)
                .replace(/\${description}/g, product.description || '');
            
            // Add error handling for images
            const img = div.querySelector('img');
            if (img) {
                img.onerror = function() {
                    this.src = PLACEHOLDER_IMG;
                    this.alt = "Image not available";
                };
            }
            
            div.querySelector('.add-to-cart')?.addEventListener('click', addToCart);
            productGrid.appendChild(div);
        });
    }

    // Cart Functions
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) existingItem.quantity++;
        else cart.push({ ...product, quantity: 1 });
        
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

        const template = document.getElementById('cartItemTemplate');
        if (!template) return;

        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.dataset.id = item.id;
            div.innerHTML = template.innerHTML
                .replace(/\${id}/g, item.id)
                .replace(/\${name}/g, item.name)
                .replace(/\${price}/g, item.price.toFixed(2))
                .replace(/\${quantity}/g, item.quantity)
                .replace(/\${image}/g, item.image || PLACEHOLDER_IMG)
                .replace(/\${total}/g, (item.price * item.quantity).toFixed(2));
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
            (p.description && p.description.toLowerCase().includes(term))
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
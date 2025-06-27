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
    const BIN_ID = "685e7cdf8561e97a502cb95c"; // Your working Bin ID
    const API_KEY = "$2a$10$0n6H.xwsnv1QcrLc00Zui0nIAyv5AU.eCCSvzPG/YLRvkBkS4ByVe";
    const PLACEHOLDER_IMG = "https://via.placeholder.com/300?text=Product";

    // Fetch Products
    async function fetchProducts() {
        try {
            console.log("[DEBUG] Fetching products...");
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("[DEBUG] API Response:", data);

            if (!data.record?.products) {
                throw new Error("No products array found in response");
            }

            products = data.record.products.map(p => ({
                ...p,
                // Ensure image URLs are properly formatted
                image: p.image ? `images/${p.image}` : PLACEHOLDER_IMG
            }));

            console.log("[DEBUG] Processed Products:", products);
            renderProducts(products);
        } catch (error) {
            console.error("[ERROR] Fetch failed:", error);
            loadFallbackProducts();
        }
    }

    // Fallback data
    function loadFallbackProducts() {
        console.warn("[WARN] Using fallback product data");
        products = [{
            id: 1,
            name: "Sample Product",
            price: 99.99,
            image: PLACEHOLDER_IMG,
            description: "Example product description"
        }];
        renderProducts(products);
    }

    // Render Products
    function renderProducts(productsToRender) {
        console.log("[DEBUG] Rendering products...");
        productGrid.innerHTML = '';

        if (!productsToRender?.length) {
            productGrid.innerHTML = `
                <div class="empty-message">
                    No products available.
                </div>`;
            return;
        }

        const template = document.getElementById('productTemplate');
        if (!template) {
            console.error("[ERROR] Product template not found!");
            return;
        }

        productsToRender.forEach(product => {
            try {
                const html = template.innerHTML
                    .replace(/\${id}/g, product.id)
                    .replace(/\${name}/g, product.name)
                    .replace(/\${price}/g, product.price?.toFixed(2) || '0.00')
                    .replace(/\${originalPrice}/g, product.originalPrice?.toFixed(2) || '')
                    .replace(/\${description}/g, product.description || '')
                    .replace(/\${image}/g, product.image || PLACEHOLDER_IMG);

                const div = document.createElement('div');
                div.className = 'product-item';
                div.innerHTML = html;
                
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
            } catch (error) {
                console.error("[ERROR] Rendering product failed:", error);
            }
        });
    }

    // Cart Functions
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

        const template = document.getElementById('cartItemTemplate');
        if (!template) return;

        cart.forEach(item => {
            const html = template.innerHTML
                .replace(/\${id}/g, item.id)
                .replace(/\${name}/g, item.name)
                .replace(/\${price}/g, item.price.toFixed(2))
                .replace(/\${quantity}/g, item.quantity)
                .replace(/\${image}/g, item.image || PLACEHOLDER_IMG)
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
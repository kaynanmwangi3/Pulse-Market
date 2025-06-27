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
    const IMAGE_BASE_URL = "./images/"; // Changed to relative path
    const PLACEHOLDER_IMG = "https://via.placeholder.com/300?text=Product";

    // State
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch Products with Image Validation
    async function fetchProducts() {
        try {
            console.log("Fetching products...");
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            products = data.record.products || [];
            
            // Validate images before rendering
            products = await Promise.all(products.map(async (product) => {
                const imgExists = await checkImageExists(`${IMAGE_BASE_URL}${product.image}`);
                return {
                    ...product,
                    image: imgExists ? `${IMAGE_BASE_URL}${product.image}` : PLACEHOLDER_IMG
                };
            }));

            renderProducts(products);
        } catch (error) {
            console.error("Fetch failed:", error);
            loadFallbackProducts();
        }
    }

    // Check if image exists
    async function checkImageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Fallback data
    function loadFallbackProducts() {
        console.warn("Loading fallback products");
        products = [{
            id: 1,
            name: "Sample Product",
            price: 99.99,
            image: PLACEHOLDER_IMG,
            description: "Example description"
        }];
        renderProducts(products);
    }

    // Render Products with Image Error Handling
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (!productsToRender?.length) {
            productGrid.innerHTML = `<div class="empty">No products found</div>`;
            return;
        }

        const template = document.getElementById('productTemplate');
        if (!template) return;

        productsToRender.forEach(product => {
            const html = template.innerHTML
                .replace(/\${id}/g, product.id)
                .replace(/\${name}/g, product.name)
                .replace(/\${price}/g, product.price?.toFixed(2))
                .replace(/\${image}/g, product.image)
                .replace(/\${description}/g, product.description || '');

            const div = document.createElement('div');
            div.className = 'product-item';
            div.innerHTML = html;
            
            // Double protection for images
            const img = div.querySelector('img');
            if (img) {
                img.onerror = () => {
                    img.src = PLACEHOLDER_IMG;
                    img.alt = "Image not available";
                };
            }
            
            div.querySelector('.add-to-cart')?.addEventListener('click', addToCart);
            productGrid.appendChild(div);
        });
    }

    // [Rest of your cart functions remain unchanged]
    // ... (keep all your existing cart functions exactly as before)

    // Initialize
    fetchProducts();
});
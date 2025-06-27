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
    const IMAGE_BASE_PATH = "images/";
    const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f5f5f5'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='16' text-anchor='middle' fill='%23000'%3EImage not available%3C/text%3E%3C/svg%3E";

    // State
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch Products with Filename Sanitization
    async function fetchProducts() {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            products = data.record?.products || [];
            
            // Fix image paths and handle Zone.Identifier files
            products = products.map(product => {
                let imageFile = product.image || '';
                
                // Remove any Zone.Identifier suffix if present
                imageFile = imageFile.replace(/\[\]Zone\.Identifier$/, '');
                
                // Fix filename inconsistencies (e.g., kitchencutery.jpg vs kitchencutlery.jpg)
                if (imageFile === "kitchencutlery.jpg") imageFile = "kitchencutery.jpg";
                
                return {
                    ...product,
                    image: imageFile ? `${IMAGE_BASE_PATH}${imageFile}` : PLACEHOLDER_IMG
                };
            });

            renderProducts();
        } catch (error) {
            console.error("Fetch error:", error);
            loadFallbackProducts();
        }
    }

    function renderProducts() {
        productGrid.innerHTML = '';
        
        if (!products.length) {
            productGrid.innerHTML = `<div class="empty">No products available</div>`;
            return;
        }

        const template = document.getElementById('productTemplate');
        if (!template) return;

        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-item';
            
            div.innerHTML = template.innerHTML
                .replace(/\${id}/g, product.id)
                .replace(/\${name}/g, product.name)
                .replace(/\${price}/g, product.price?.toFixed(2) || '0.00')
                .replace(/\${image}/g, product.image)
                .replace(/\${description}/g, product.description || '');

            // Robust image handling
            const img = div.querySelector('img');
            if (img) {
                img.loading = "lazy";
                img.onerror = () => {
                    img.src = PLACEHOLDER_IMG;
                    img.alt = "Image not available";
                    console.warn(`Failed to load: ${product.image}`);
                };
            }
            
            div.querySelector('.add-to-cart')?.addEventListener('click', addToCart);
            productGrid.appendChild(div);
        });
    }

    // [Rest of your cart functions remain unchanged]
    // ... (keep all existing cart functions)

    // Initialize
    fetchProducts();
});
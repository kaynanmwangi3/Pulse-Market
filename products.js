// document.addEventListener('DOMContentLoaded', function() {
//       // DOM Elements
//       const productGrid = document.getElementById('productGrid');
//       const productSearch = document.getElementById('productSearch');
//       const cartToggle = document.getElementById('cartToggle');
//       const cartSidebar = document.getElementById('cartSidebar');
//       const cartItems = document.getElementById('cartItems');
//       const cartCount = document.getElementById('cartCount');
//       const cartTotal = document.getElementById('cartTotal');
      
//       // State
//       let products = [];
//       let cart = [];
      
//       // Fetch Products
//       async function fetchProducts() {
//     const BIN_ID = "685d81768960c5a9a5b1f8b5";
//     const API_KEY = "$2a$10$0nGH.xwsnv1QcrLcO0ZuiOnIAyv5AU.eCCSvzPG/YLRvkBkS4ByVe";
    
//     try {
//         const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
//             headers: {
//                 "X-Master-Key": API_KEY,
//                 "Content-Type": "application/json"
//             },
                  mode: "cors"
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
        
//         // Check if data.record exists and has products
//         if (!data.record || !data.record.products) {
//             throw new Error("Invalid data structure from API");
//         }

//         renderProducts(data.record.products);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         // Display error to user
//         productGrid.innerHTML = `
//             <div class="error-message">
//                 Failed to load products. Please try again later.
//             </div>
//         `;
//     }
// }

// // Render Products
// function renderProducts(products) {
//     // Clear existing content
//     productGrid.innerHTML = '';
    
//     // Check if products array exists and has items
//     if (!products || !products.length) {
//         productGrid.innerHTML = `
//             <div class="empty-message">
//                 No products available at the moment.
//             </div>
//         `;
//         return;
//     }

//     // Get template (assuming you have one in your HTML)
//     const template = document.getElementById('productTemplate')?.innerHTML;
    
//     if (!template) {
//         console.error('Product template not found');
//         return;
//     }

//     // Render each product
//     products.forEach(product => {
//         try {
//             const html = template
//                 .replace(/\${id}/g, product.id || '')
//                 .replace(/\${name}/g, product.name || '')
//                 .replace(/\${price}/g, product.price || '')
//                 .replace(/\${image}/g, product.image || 'placeholder.jpg')
//                 .replace(/\${description}/g, product.description || '');
            
//             const div = document.createElement('div');
//             div.className = 'product-item'; // Add a class for styling
//             div.innerHTML = html;
//             productGrid.appendChild(div);
//         } catch (error) {
//             console.error('Error rendering product:', product, error);
//         }
//     });
// }

// // Call fetchProducts when the page loads
// document.addEventListener('DOMContentLoaded', fetchProducts);
        
//         // Add event listeners to all "Add to Cart" buttons
//         document.querySelectorAll('.add-to-cart').forEach(button => {
//           button.addEventListener('click', addToCart);
//         });
//       }
      
//       // Add to Cart
//       function addToCart(e) {
//         const productId = parseInt(e.target.dataset.id);
//         const product = products.find(p => p.id === productId);
        
//         const existingItem = cart.find(item => item.id === productId);
        
//         if (existingItem) {
//           existingItem.quantity++;
//         } else {
//           cart.push({
//             ...product,
//             quantity: 1
//           });
//         }
        
//         updateCart();
//       }
      
//       // Update Cart
//       function updateCart() {
//         // Update count
//         const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//         cartCount.textContent = totalItems;
        
//         // Update total
//         const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//         cartTotal.textContent = totalPrice.toFixed(2);
        
//         // Render items
//         renderCartItems();
//       }
      
//       // Render Cart Items
//       function renderCartItems() {
//         cartItems.innerHTML = '';
//         const template = document.getElementById('cartItemTemplate').innerHTML;
        
//         cart.forEach(item => {
//           const html = template
//             .replace(/\${(\w+)}/g, (_, key) => item[key] || '');
//           const div = document.createElement('div');
//           div.innerHTML = html;
//           cartItems.appendChild(div);
//         });
        
//         // Add event listeners to remove buttons
//         document.querySelectorAll('.remove-item').forEach(button => {
//           button.addEventListener('click', removeFromCart);
//         });
//       }
      
//       // Remove from Cart
//       function removeFromCart(e) {
//         const productId = parseInt(e.target.closest('.cart-item').dataset.id);
//         cart = cart.filter(item => item.id !== productId);
//         updateCart();
//       }
      
//       // Search Products
//       productSearch.addEventListener('input', function(e) {
//         const searchTerm = e.target.value.toLowerCase();
//         const filteredProducts = products.filter(product => 
//           product.name.toLowerCase().includes(searchTerm) || 
//           product.description.toLowerCase().includes(searchTerm)
//         );
//         renderProducts(filteredProducts);
//       });
      
//       // Toggle Cart
//       cartToggle.addEventListener('click', function() {
//         document.body.classList.toggle('cart-open');
//       });
      
//       // Initialize
//       fetchProducts();
//     });

// // Mobile Filter Toggle - Add to DOMContentLoaded event
// document.querySelector('.mobile-filter-toggle')?.addEventListener('click', () => {
//   document.querySelector('.filters').classList.toggle('active');
// });

// // Close filters when clicking outside (add this too)
// document.addEventListener('click', (e) => {
//   const filters = document.querySelector('.filters');
//   if (!filters.contains(e.target) && 
//       !e.target.closest('.mobile-filter-toggle')) {
//     filters.classList.remove('active');
//   }
// });

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
    
    // Fetch Products
    async function fetchProducts() {
        const BIN_ID = "685d81768960c5a9a5b1f8b5";
        const API_KEY = "$2a$10$0nGH.xwsnv1QcrLcO0ZuiOnIAyv5AU.eCCSvzPG/YLRvkBkS4ByVe";
        
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                headers: {
                    "X-Master-Key": API_KEY,
                    "Content-Type": "application/json"
                },
                mode: "cors"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.record || !data.record.products) {
                throw new Error("Invalid data structure from API");
            }

            products = data.record.products;
            renderProducts(products);
            updateCart(); // Initialize cart count
        } catch (error) {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = `
                <div class="error-message">
                    Failed to load products. Please try again later.
                </div>
            `;
        }
    }

    // Render Products
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (!productsToRender || !productsToRender.length) {
            productGrid.innerHTML = `
                <div class="empty-message">
                    No products found matching your search.
                </div>
            `;
            return;
        }

        const template = document.getElementById('productTemplate')?.innerHTML;
        
        if (!template) {
            console.error('Product template not found');
            return;
        }

        productsToRender.forEach(product => {
            try {
                const html = template
                    .replace(/\${id}/g, product.id || '')
                    .replace(/\${name}/g, product.name || '')
                    .replace(/\${price}/g, product.price?.toFixed(2) || '0.00')
                    .replace(/\${image}/g, product.image || 'placeholder.jpg')
                    .replace(/\${description}/g, product.description || '');

                const div = document.createElement('div');
                div.className = 'product-item';
                div.innerHTML = html;
                
                // Add event listener to the button
                const addButton = div.querySelector('.add-to-cart');
                if (addButton) {
                    addButton.addEventListener('click', addToCart);
                }
                
                productGrid.appendChild(div);
            } catch (error) {
                console.error('Error rendering product:', product, error);
            }
        });
    }

    // Add to Cart
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

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
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
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
        
        if (!cart.length) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    Your cart is empty
                </div>
            `;
            return;
        }

        const template = document.getElementById('cartItemTemplate')?.innerHTML;
        
        if (!template) {
            console.error('Cart item template not found');
            return;
        }

        cart.forEach(item => {
            try {
                const html = template
                    .replace(/\${id}/g, item.id || '')
                    .replace(/\${name}/g, item.name || '')
                    .replace(/\${price}/g, item.price?.toFixed(2) || '0.00')
                    .replace(/\${quantity}/g, item.quantity || '1')
                    .replace(/\${image}/g, item.image || 'placeholder.jpg')
                    .replace(/\${total}/g, (item.price * item.quantity).toFixed(2));

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.dataset.id = item.id;
                div.innerHTML = html;
                cartItems.appendChild(div);
            } catch (error) {
                console.error('Error rendering cart item:', item, error);
            }
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
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
        renderProducts(filteredProducts);
    });

    // Toggle Cart
    cartToggle.addEventListener('click', function() {
        document.body.classList.toggle('cart-open');
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && e.target !== cartToggle) {
            document.body.classList.remove('cart-open');
        }
    });

    // Mobile Filter Toggle
    document.querySelector('.mobile-filter-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('.filters').classList.toggle('active');
    });

    // Close filters when clicking outside
    document.addEventListener('click', (e) => {
        const filters = document.querySelector('.filters');
        if (filters && !filters.contains(e.target)){
            filters.classList.remove('active');
        }
    });

    // Initialize
    fetchProducts();
});

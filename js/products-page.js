document.addEventListener('DOMContentLoaded', () => {
    // Initialize filters
    initializeFilters();
    
    // Initialize price range
    initializePriceRange();
    
    // Initialize size buttons
    initializeSizeButtons();
    
    // Initialize sort select
    initializeSortSelect();
    
    // Load initial products
    loadProducts();
});

function initializeFilters() {
    const filterLinks = document.querySelectorAll('.filter-list a');
    
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            filterLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get category and load products
            const category = link.dataset.category;
            loadProducts(category);
        });
    });
}

function initializePriceRange() {
    const priceSlider = document.querySelector('.price-slider');
    const minPriceInput = document.querySelector('.min-price');
    const maxPriceInput = document.querySelector('.max-price');
    
    priceSlider.addEventListener('input', (e) => {
        maxPriceInput.value = e.target.value;
        loadProducts();
    });
    
    minPriceInput.addEventListener('change', () => {
        if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
            minPriceInput.value = maxPriceInput.value;
        }
        loadProducts();
    });
    
    maxPriceInput.addEventListener('change', () => {
        if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
            maxPriceInput.value = minPriceInput.value;
        }
        loadProducts();
    });
}

function initializeSizeButtons() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            loadProducts();
        });
    });
}

function initializeSortSelect() {
    const sortSelect = document.querySelector('.sort-select');
    
    sortSelect.addEventListener('change', () => {
        loadProducts();
    });
}

function loadProducts(category = 'all') {
    const productsList = document.querySelector('.products-list');
    const minPrice = document.querySelector('.min-price').value;
    const maxPrice = document.querySelector('.max-price').value;
    const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active')).map(btn => btn.textContent);
    const sortBy = document.querySelector('.sort-select').value;
    
    // Filter products based on criteria
    let filteredProducts = Object.entries(products).filter(([id, product]) => {
        // Category filter
        if (category !== 'all' && !id.includes(category)) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Size filter
        if (selectedSizes.length > 0) {
            const hasSize = product.sizes.some(size => 
                selectedSizes.includes(size.value) && size.inStock
            );
            if (!hasSize) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort products
    filteredProducts.sort((a, b) => {
        const [idA, productA] = a;
        const [idB, productB] = b;
        
        switch (sortBy) {
            case 'price-low':
                return productA.price - productB.price;
            case 'price-high':
                return productB.price - productA.price;
            case 'newest':
                return idB.localeCompare(idA);
            default:
                return 0;
        }
    });
    
    // Render products
    productsList.innerHTML = filteredProducts.map(([id, product]) => `
        <div class="product-card" data-product-id="${id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart('${id}')">Add to Cart</button>
                    <button class="add-to-wishlist" onclick="toggleWishlist('${id}')">
                        ${isInWishlist(id) ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
    
    // Reload products to update wishlist icons
    loadProducts();
} 
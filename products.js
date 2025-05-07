// Product data
const products = [
    {
        id: 1,
        brand: 'Nike',
        name: 'Air Jordan 1 High OG',
        price: 179.99,
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c6c9b7c-1a1a-4c1a-8c1a-1a1a1a1a1a1a/air-jordan-1-high-og-shoes-86f1ZW.png',
        category: 'Men',
        rating: 4.8,
        reviews: 1245,
        isNew: true,
        colors: ['Black/Red', 'White/Blue', 'Black/White'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The Air Jordan 1 High OG is a classic basketball shoe that has become a streetwear icon.'
    },
    {
        id: 2,
        brand: 'Adidas',
        name: 'Ultraboost 22',
        price: 189.99,
        image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/2c1c1c1c1c1c1c1c1c1c1c1c/ultraboost-22-shoes.jpg',
        category: 'Men',
        rating: 4.7,
        reviews: 892,
        isNew: true,
        colors: ['Black', 'White', 'Grey'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The Ultraboost 22 offers responsive cushioning and a sock-like fit for all-day comfort.'
    },
    {
        id: 3,
        brand: 'New Balance',
        name: '574 Classic',
        price: 99.99,
        image: 'https://nb.scene7.com/is/image/NB/mt574v2_nb_02_i',
        category: 'Men',
        rating: 4.5,
        reviews: 567,
        isNew: false,
        colors: ['Grey', 'Navy', 'Green'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The 574 Classic combines retro style with modern comfort for everyday wear.'
    },
    {
        id: 4,
        brand: 'Nike',
        name: 'Air Force 1 Low',
        price: 109.99,
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a/air-force-1-07-shoes-WrLlWX.png',
        category: 'Men',
        rating: 4.6,
        reviews: 2341,
        isNew: false,
        colors: ['White', 'Black', 'Red'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The Air Force 1 Low is a timeless classic that has been a street style staple for decades.'
    },
    {
        id: 5,
        brand: 'Puma',
        name: 'RS-X',
        price: 119.99,
        image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/371915/01/sv01/fnd/IND/s/rs-x-3-puzzle-unisex-sneakers.jpg',
        category: 'Men',
        rating: 4.4,
        reviews: 423,
        isNew: true,
        colors: ['Blue', 'Red', 'Black'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The RS-X combines retro running style with modern technology for a bold look.'
    },
    {
        id: 6,
        brand: 'Adidas',
        name: 'NMD R1',
        price: 139.99,
        image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/1a1a1a1a1a1a1a1a1a1a1a1a/nmd_r1-shoes.jpg',
        category: 'Men',
        rating: 4.5,
        reviews: 678,
        isNew: false,
        colors: ['Black/Red', 'White/Blue', 'Grey'],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        description: 'The NMD R1 features responsive Boost cushioning and a modern, streamlined design.'
    }
];

// Cart and Wishlist Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Search and Filter State
let currentFilters = {
    search: '',
    sort: 'newest',
    category: getCurrentCategory()
};

// Search suggestions state
let searchSuggestions = [];
let selectedSuggestionIndex = -1;

// Function to get current category from URL
function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('men.html')) return 'Men';
    if (path.includes('women.html')) return 'Women';
    if (path.includes('kids.html')) return 'Kids';
    if (path.includes('trending.html')) return 'Trending';
    return 'All';
}

// Function to get search suggestions
function getSearchSuggestions(searchTerm) {
    if (!searchTerm) return [];

    const term = searchTerm.toLowerCase();
    const suggestions = new Set();

    products.forEach(product => {
        // Add matching product names
        if (product.name.toLowerCase().includes(term)) {
            suggestions.add(product.name);
        }
        // Add matching brands
        if (product.brand.toLowerCase().includes(term)) {
            suggestions.add(product.brand);
        }
        // Add matching categories
        if (product.category.toLowerCase().includes(term)) {
            suggestions.add(product.category);
        }
    });

    return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
}

// Function to create suggestion HTML
function createSuggestionHTML(suggestions) {
    if (suggestions.length === 0) return '';

    return `
        <div class="search-suggestions">
            ${suggestions.map((suggestion, index) => `
                <div class="suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}" 
                     data-suggestion="${suggestion}">
                    <span class="search-svg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="7"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </span>
                    ${suggestion}
                </div>
            `).join('')}
        </div>
    `;
}

// Function to show search suggestions
function showSearchSuggestions(searchTerm) {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;

    // Remove existing suggestions
    const existingSuggestions = searchBox.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }

    // Get and show new suggestions
    searchSuggestions = getSearchSuggestions(searchTerm);
    if (searchSuggestions.length > 0) {
        const suggestionsHTML = createSuggestionHTML(searchSuggestions);
        searchBox.insertAdjacentHTML('beforeend', suggestionsHTML);

        // Add click event listeners to suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const searchInput = document.querySelector('.search-box input');
                if (searchInput) {
                    searchInput.value = item.dataset.suggestion;
                    handleSearch(item.dataset.suggestion);
                }
            });
        });
    }
}

// Function to handle keyboard navigation
function handleKeyboardNavigation(e) {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;

    const suggestions = searchBox.querySelector('.search-suggestions');
    if (!suggestions) return;

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, searchSuggestions.length - 1);
            updateSelectedSuggestion();
            break;
        case 'ArrowUp':
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSelectedSuggestion();
            break;
        case 'Enter':
            e.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                const searchInput = document.querySelector('.search-box input');
                if (searchInput) {
                    searchInput.value = searchSuggestions[selectedSuggestionIndex];
                    handleSearch(searchSuggestions[selectedSuggestionIndex]);
                }
            }
            break;
        case 'Escape':
            e.preventDefault();
            const suggestions = searchBox.querySelector('.search-suggestions');
            if (suggestions) {
                suggestions.remove();
            }
            selectedSuggestionIndex = -1;
            break;
    }
}

// Function to update selected suggestion
function updateSelectedSuggestion() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.isNew ? '<span class="new-badge">New</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    ${createRatingStars(product.rating)}
                    <span class="reviews">(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to create rating stars
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="star full">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        } else {
            starsHTML += '<span class="star empty">☆</span>';
        }
    }

    return `<div class="stars">${starsHTML}</div>`;
}

// Function to create back button HTML
function createBackButtonHTML() {
    return `
        <button class="back-button" onclick="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
        </button>
    `;
}

// Function to handle back navigation
function goBack() {
    if (currentFilters.search) {
        // If we're in a search, clear the search
        currentFilters.search = '';
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.value = '';
        }
        renderProducts();
        updateBreadcrumb();
    } else {
        // Otherwise go to home page
        window.location.href = 'index.html';
    }
}

// Function to create breadcrumb HTML
function createBreadcrumbHTML() {
    const category = currentFilters.category;
    const searchTerm = currentFilters.search;
    
    let breadcrumbHTML = `
        <div class="breadcrumb">
            <a href="index.html">Home</a>
            <span class="separator">/</span>
    `;

    if (category !== 'All') {
        breadcrumbHTML += `
            <a href="${category.toLowerCase()}.html">${category}</a>
        `;
    }

    if (searchTerm) {
        breadcrumbHTML += `
            <span class="separator">/</span>
            <span class="current">Search: "${searchTerm}"</span>
        `;
    }

    breadcrumbHTML += `</div>`;
    return breadcrumbHTML;
}

// Function to update breadcrumb
function updateBreadcrumb() {
    const breadcrumbContainer = document.querySelector('.breadcrumb-container');
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = createBreadcrumbHTML();
    }
}

// Function to filter products
function filterProducts() {
    let filteredProducts = [...products];

    // Apply category filter
    if (currentFilters.category !== 'All') {
        if (currentFilters.category === 'Trending') {
            filteredProducts = filteredProducts.filter(product => product.isNew || product.reviews > 100);
        } else {
            filteredProducts = filteredProducts.filter(product => 
                product.category === currentFilters.category
            );
        }
    }

    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    switch (currentFilters.sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.isNew - a.isNew);
            break;
    }

    return filteredProducts;
}

// Function to render products
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const filteredProducts = filterProducts();

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    addEventListeners();
}

// Function to handle search
function handleSearch(searchTerm) {
    currentFilters.search = searchTerm;
    renderProducts();
    showSearchSuggestions(searchTerm);
    updateBreadcrumb();
}

// Function to handle sort
function handleSort(sortBy) {
    currentFilters.sort = sortBy;
    renderProducts();
}

// Function to add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification('Added to cart!');
}

// Function to toggle wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

// Function to update wishlist UI
function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.id);
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Function to update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-svg .icon-badge');
    if (badge) {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        badge.textContent = totalItems;
    }
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Function to add event listeners
function addEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.wishlist-btn').dataset.id);
            toggleWishlist(productId);
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add back button and breadcrumb container to the page
    const productsHeader = document.querySelector('.products-header');
    if (productsHeader) {
        const navigationContainer = document.createElement('div');
        navigationContainer.className = 'navigation-container';
        
        // Add back button
        navigationContainer.innerHTML = createBackButtonHTML();
        
        // Add breadcrumb container
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.className = 'breadcrumb-container';
        navigationContainer.appendChild(breadcrumbContainer);
        
        productsHeader.insertBefore(navigationContainer, productsHeader.firstChild);
    }

    renderProducts();
    updateCartBadge();
    updateWishlistUI();
    updateBreadcrumb();

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });

        searchInput.addEventListener('keydown', handleKeyboardNavigation);

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                const suggestions = document.querySelector('.search-suggestions');
                if (suggestions) {
                    suggestions.remove();
                }
                selectedSuggestionIndex = -1;
            }
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            handleSort(e.target.value);
        });
    }
}); 
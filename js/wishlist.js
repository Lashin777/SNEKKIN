// Wishlist state
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const wishlistPanel = document.querySelector('.wishlist-panel');
const wishlistItemsContainer = document.querySelector('.wishlist-items');
const emptyWishlistElement = document.querySelector('.empty-wishlist');
const overlay = document.querySelector('.overlay');
const closeWishlistBtn = document.querySelector('.close-wishlist');
const wishlistIcon = document.querySelector('.wishlist-svg');

// Initialize wishlist
function initWishlist() {
    updateWishlistUI();
    renderWishlistItems();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Open wishlist
    wishlistIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openWishlist();
    });

    // Close wishlist
    closeWishlistBtn.addEventListener('click', closeWishlist);
    overlay.addEventListener('click', closeWishlist);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWishlist();
        }
    });
}

// Open wishlist
function openWishlist() {
    wishlistPanel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close wishlist
function closeWishlist() {
    wishlistPanel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Update wishlist UI
function updateWishlistUI() {
    const itemCount = wishlist.length;

    // Show/hide empty wishlist state
    if (itemCount === 0) {
        emptyWishlistElement.style.display = 'block';
        wishlistItemsContainer.style.display = 'none';
    } else {
        emptyWishlistElement.style.display = 'none';
        wishlistItemsContainer.style.display = 'block';
    }
}

// Render wishlist items
function renderWishlistItems() {
    if (!wishlistItemsContainer) return;

    wishlistItemsContainer.innerHTML = wishlist.map(id => {
        const product = window.products.find(p => p.id === id);
        if (!product) return '';

        return `
            <div class="wishlist-item" data-id="${id}">
                <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <div>
                        <h3 class="wishlist-item-name">${product.name}</h3>
                        <p class="wishlist-item-price">$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-btn">Add to Cart</button>
                        <button class="remove-from-wishlist-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners
    addWishlistEventListeners();
}

// Add event listeners to wishlist items
function addWishlistEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Remove buttons
    document.querySelectorAll('.remove-from-wishlist-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromWishlist);
    });
}

// Handle add to cart
function handleAddToCart(e) {
    const button = e.target;
    const wishlistItem = button.closest('.wishlist-item');
    const id = wishlistItem.dataset.id;

    // Add to cart using the global function from cart.js
    if (window.addToCart) {
        window.addToCart(id);
    }
}

// Handle remove from wishlist
function handleRemoveFromWishlist(e) {
    const button = e.target.closest('.remove-from-wishlist-btn');
    const wishlistItem = button.closest('.wishlist-item');
    const id = wishlistItem.dataset.id;

    wishlist = wishlist.filter(itemId => itemId !== id);
    saveWishlist();
    updateWishlistUI();
    renderWishlistItems();
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Add to wishlist function (used by product pages)
window.addToWishlist = function(id) {
    if (!wishlist.includes(id)) {
        wishlist.push(id);
        saveWishlist();
        updateWishlistUI();
        openWishlist();
    }
};

// Remove from wishlist function (used by product pages)
window.removeFromWishlist = function(id) {
    wishlist = wishlist.filter(itemId => itemId !== id);
    saveWishlist();
    updateWishlistUI();
};

// Check if item is in wishlist (used by product pages)
window.isInWishlist = function(id) {
    return wishlist.includes(id);
};

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load wishlist items
    loadWishlistItems();
});

function loadWishlistItems() {
    const wishlistItems = document.querySelector('.wishlist-items');
    const wishlist = getWishlist();
    
    if (Object.keys(wishlist).length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <h2>Your wishlist is empty</h2>
                <p>Looks like you haven't added any items to your wishlist yet.</p>
                <a href="products.html" class="continue-shopping">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-5h2v2H9zm0-8h2v6H9z"/>
                    </svg>
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }
    
    let wishlistHTML = '';
    
    for (const productId of wishlist) {
        const product = products[productId];
        
        wishlistHTML += `
            <div class="wishlist-item" data-product-id="${productId}">
                <div class="wishlist-item-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="wishlist-item-content">
                    <h3 class="wishlist-item-title">${product.name}</h3>
                    <div class="wishlist-item-price">$${product.price.toFixed(2)}</div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart" onclick="addToCart('${productId}')">Add to Cart</button>
                        <button class="remove-from-wishlist" onclick="removeFromWishlist('${productId}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    wishlistItems.innerHTML = wishlistHTML;
}

function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
        loadWishlistItems();
        showNotification('Item removed from wishlist');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 
// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartPanel = document.querySelector('.cart-panel');
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCartElement = document.querySelector('.empty-cart');
const cartFooter = document.querySelector('.cart-footer');
const subtotalElement = document.querySelector('.subtotal');
const shippingElement = document.querySelector('.shipping');
const totalAmountElement = document.querySelector('.total-amount');
const iconBadge = document.querySelector('.icon-badge');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartIcon = document.querySelector('.cart-svg');

// Constants
const SHIPPING_RATE = 10;
const FREE_SHIPPING_THRESHOLD = 100;

// Initialize cart
function initCart() {
    updateCartUI();
    renderCartItems();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Open cart
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    // Close cart
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

// Open cart
function openCart() {
    cartPanel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCart() {
    cartPanel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Update cart UI
function updateCartUI() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Update counts and totals
    iconBadge.textContent = itemCount;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    totalAmountElement.textContent = `$${total.toFixed(2)}`;

    // Show/hide empty cart state
    if (itemCount === 0) {
        emptyCartElement.style.display = 'block';
        cartFooter.style.display = 'none';
    } else {
        emptyCartElement.style.display = 'none';
        cartFooter.style.display = 'block';
    }
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((total, item) => {
        const product = window.products.find(p => p.id === item.id);
        return total + (product.price * item.quantity);
    }, 0);
}

// Calculate shipping
function calculateShipping(subtotal) {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
}

// Render cart items
function renderCartItems() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = window.products.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div>
                        <h3 class="cart-item-name">${product.name}</h3>
                        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn decrease">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn increase">+</button>
                        </div>
                        <button class="remove-btn">
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
    addCartEventListeners();
}

// Add event listeners to cart items
function addCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    // Quantity input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', handleQuantityInput);
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

// Handle quantity change
function handleQuantityChange(e) {
    const button = e.target;
    const cartItem = button.closest('.cart-item');
    const id = cartItem.dataset.id;
    const input = cartItem.querySelector('.quantity-input');
    let quantity = parseInt(input.value);

    if (button.classList.contains('decrease')) {
        quantity = Math.max(1, quantity - 1);
    } else if (button.classList.contains('increase')) {
        quantity = Math.min(10, quantity + 1);
    }

    updateCartItemQuantity(id, quantity);
}

// Handle quantity input
function handleQuantityInput(e) {
    const input = e.target;
    const cartItem = input.closest('.cart-item');
    const id = cartItem.dataset.id;
    let quantity = parseInt(input.value);

    // Validate quantity
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    } else if (quantity > 10) {
        quantity = 10;
    }

    input.value = quantity;
    updateCartItemQuantity(id, quantity);
}

// Update cart item quantity
function updateCartItemQuantity(id, quantity) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].quantity = quantity;
    saveCart();
    updateCartUI();
}

// Handle remove item
function handleRemoveItem(e) {
    const button = e.target.closest('.remove-btn');
    const cartItem = button.closest('.cart-item');
    const id = cartItem.dataset.id;

    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart function (used by product pages)
window.addToCart = function(id, quantity = 1) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity = Math.min(10, existingItem.quantity + quantity);
    } else {
        cart.push({ id, quantity });
    }

    saveCart();
    updateCartUI();
    openCart();
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load cart items
    loadCartItems();
    
    // Initialize event listeners
    initializeEventListeners();
});

function loadCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const cart = getCart();
    
    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="products.html" class="continue-shopping">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-5h2v2H9zm0-8h2v6H9z"/>
                    </svg>
                    Continue Shopping
                </a>
            </div>
        `;
        updateCartSummary(0, 0);
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    for (const [productId, item] of Object.entries(cart)) {
        const product = products[productId];
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-product-id="${productId}">
                <div class="cart-item-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <div>
                        <h3 class="cart-item-title">${product.name}</h3>
                        <p class="cart-item-size">Size: ${item.size}</p>
                    </div>
                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn decrease" onclick="updateQuantity('${productId}', -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="setQuantity('${productId}', this.value)">
                        <button class="quantity-btn increase" onclick="updateQuantity('${productId}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${productId}')">Remove</button>
                </div>
            </div>
        `;
    }
    
    cartItems.innerHTML = cartHTML;
    updateCartSummary(subtotal);
}

function initializeEventListeners() {
    // Quantity input validation
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > 10) e.target.value = 10;
        }
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (Object.keys(cart).length === 0) {
                showNotification('Your cart is empty');
                return;
            }
            // TODO: Implement checkout functionality
            showNotification('Checkout functionality coming soon!');
        });
    }
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart[productId];
    
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1 || newQuantity > 10) return;
    
    item.quantity = newQuantity;
    saveCart(cart);
    loadCartItems();
}

function setQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart[productId];
    
    if (!item) return;
    
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 10) {
        loadCartItems(); // Reset to previous value
        return;
    }
    
    item.quantity = newQuantity;
    saveCart(cart);
    loadCartItems();
}

function removeFromCart(productId) {
    const cart = getCart();
    delete cart[productId];
    saveCart(cart);
    loadCartItems();
    showNotification('Item removed from cart');
}

function updateCartSummary(subtotal) {
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;
    
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.shipping').textContent = `$${shipping.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
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
document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    // Load product data
    loadProduct(productId);

    // Initialize event listeners
    initializeEventListeners();
});

async function loadProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        if (!product) {
            window.location.href = 'index.html';
            return;
        }

        // Update page title
        document.title = `${product.name} - Snekkin`;

        // Update product information
        document.querySelector('.product-title').textContent = product.name;
        document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
        document.querySelector('.product-description').textContent = product.description;

        // Load product images
        loadProductImages(product.images);

        // Load size options
        loadSizeOptions(product.sizes);

        // Load product details
        loadProductDetails(product);

    } catch (error) {
        console.error('Error loading product:', error);
        // Show error message to user
        showError('Failed to load product details. Please try again later.');
    }
}

function loadProductImages(images) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailList = document.querySelector('.thumbnail-list');

    // Set main image
    mainImage.src = images[0];
    mainImage.alt = document.querySelector('.product-title').textContent;

    // Create thumbnails
    thumbnailList.innerHTML = images.map((image, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${image}" alt="Product thumbnail ${index + 1}">
        </div>
    `).join('');

    // Add click event to thumbnails
    thumbnailList.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const index = thumbnail.dataset.index;
            updateMainImage(images[index]);
            
            // Update active thumbnail
            thumbnailList.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });
}

function updateMainImage(imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = imageSrc;
        mainImage.style.opacity = '1';
    }, 200);
}

function loadSizeOptions(sizes) {
    const sizeGrid = document.querySelector('.size-grid');
    
    sizeGrid.innerHTML = sizes.map(size => `
        <button class="size-btn ${size.inStock ? '' : 'disabled'}" 
                data-size="${size.value}"
                ${!size.inStock ? 'disabled' : ''}>
            ${size.value}
        </button>
    `).join('');

    // Add click event to size buttons
    sizeGrid.querySelectorAll('.size-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function loadProductDetails(product) {
    // Description tab
    document.querySelector('#description').innerHTML = `
        <p>${product.description}</p>
        <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    `;

    // Specifications tab
    document.querySelector('#specifications').innerHTML = `
        <table class="specs-table">
            ${Object.entries(product.specifications).map(([key, value]) => `
                <tr>
                    <th>${key}</th>
                    <td>${value}</td>
                </tr>
            `).join('')}
        </table>
    `;

    // Shipping tab
    document.querySelector('#shipping').innerHTML = `
        <div class="shipping-info">
            <h4>Shipping Information</h4>
            <p>${product.shipping.info}</p>
            <ul>
                ${product.shipping.options.map(option => `
                    <li>
                        <strong>${option.name}:</strong> ${option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                        <br>
                        <small>${option.deliveryTime}</small>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function initializeEventListeners() {
    // Quantity selector
    const quantityInput = document.querySelector('.quantity-input');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        quantityInput.value = value;
    });

    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-btn.active');
        if (!selectedSize) {
            showError('Please select a size');
            return;
        }

        const quantity = parseInt(quantityInput.value);
        const productId = new URLSearchParams(window.location.search).get('id');

        // Add to cart logic here
        addToCart(productId, selectedSize.dataset.size, quantity);
    });

    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
        const productId = new URLSearchParams(window.location.search).get('id');
        toggleWishlist(productId);
    });

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active tab content
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addToCart(productId, size, quantity) {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists in cart
    const existingItem = cart.find(item => 
        item.productId === productId && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            size,
            quantity
        });
    }

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show success message
    showSuccess('Added to cart successfully!');
}

function toggleWishlist(productId) {
    // Get current wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Check if product is in wishlist
    const index = wishlist.indexOf(productId);

    const wishlistBtn = document.querySelector('.wishlist-btn');

    if (index === -1) {
        // Add to wishlist
        wishlist.push(productId);
        wishlistBtn.classList.add('active');
        showSuccess('Added to wishlist!');
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        wishlistBtn.classList.remove('active');
        showSuccess('Removed from wishlist!');
    }

    // Save updated wishlist
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 
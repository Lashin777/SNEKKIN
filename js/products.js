// Mock product data
const products = [
    {
        id: 1,
        name: "Nike Air Max 270",
        price: 150,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png",
        category: "men",
        description: "The Nike Air Max 270 delivers visible cushioning under every step with a large window and fresh color."
    },
    {
        id: 2,
        name: "Adidas Ultraboost 22",
        price: 180,
        image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/2c1a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/ultraboost-22-shoes.jpg",
        category: "men",
        description: "The Ultraboost 22 features a responsive Boost midsole and a Primeknit upper for a snug, sock-like fit."
    },
    {
        id: 3,
        name: "Nike Air Force 1",
        price: 100,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/air-force-1-07-mens-shoes-5QFp5Z.png",
        category: "men",
        description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best."
    },
    {
        id: 4,
        name: "Kids Nike Revolution 6",
        price: 45,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c41c0c0-0a0a-0a0a-0a0a-0a0a0a0a0a0a/revolution-6-little-kids-shoes.jpg",
        category: "kids",
        description: "The Nike Revolution 6 cushions your stride with soft foam to keep you running in comfort."
    },
    {
        id: 5,
        name: "Kids Adidas Superstar",
        price: 65,
        image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/superstar-shoes.jpg",
        category: "kids",
        description: "The iconic shell toe and 3-Stripes design make the Superstar a classic for kids."
    },
    {
        id: 6,
        name: "Nike Air Jordan 1",
        price: 170,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/air-jordan-1-high-og-shoes.jpg",
        category: "men",
        description: "The Air Jordan 1 High OG is a classic basketball shoe that's been reimagined for everyday wear."
    }
];

// Function to create product cards
function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="quick-view">
                    <button class="quick-view-btn">Quick View</button>
                </div>
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description}</p>
                <div class="product-actions">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="add-to-wishlist">♡</button>
                </div>
            </div>
        </div>
    `;
}

// Function to display products
function displayProducts(container, category = null) {
    const productsContainer = document.getElementById(container);
    if (!productsContainer) return;

    const filteredProducts = category 
        ? products.filter(product => product.category === category)
        : products;

    productsContainer.innerHTML = filteredProducts
        .map(product => createProductCard(product))
        .join('');
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Display products based on current page
    switch(currentPage) {
        case 'men.html':
            displayProducts('products-container', 'men');
            break;
        case 'kids.html':
            displayProducts('products-container', 'kids');
            break;
        case 'sneakers.html':
            displayProducts('products-container');
            break;
        case 'trending.html':
            displayProducts('products-container');
            break;
    }
});

// Initialize trending section
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Intersection Observer for trending section
    const trendingSection = document.querySelector('.trending');
    const trendingCards = document.querySelectorAll('.trending-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('trending')) {
                    trendingCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200); // Stagger the card animations
                    });
                }
            }
        });
    }, observerOptions);

    observer.observe(trendingSection);

    // Initialize quick view functionality
    initializeQuickView();

    // Initialize hero card clicks
    initializeHeroCards();
});

function initializeQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = btn.closest('.trending-card');
            const productId = card.dataset.productId;
            
            if (productId && products[productId]) {
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });
}

function initializeHeroCards() {
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get the category from the card's data attribute or content
            const category = card.dataset.category || 'all';
            // Navigate to the products page with the category
            window.location.href = `sneakers.html?category=${category}`;
        });
    });
}

// Cart functions
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    showNotification('Added to cart successfully!', 'success');
}

// Wishlist functions
function addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
    }
}

function removeFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Removed from wishlist!', 'success');
    }
}

function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(productId);
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 
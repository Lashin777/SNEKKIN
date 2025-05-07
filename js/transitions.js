// Page Transition Handler
document.addEventListener('DOMContentLoaded', () => {
    // Create transition element
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    // Add click event listeners to all navigation links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle internal links
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Start transition
                transition.classList.add('active');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    // Handle page load
    window.addEventListener('load', () => {
        // Remove transition class after page loads
        setTimeout(() => {
            transition.classList.remove('active');
        }, 100);
    });
});

// Add animation classes to main content
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main, .cart-section, .wishlist-section');
    if (mainContent) {
        mainContent.classList.add('fade-enter');
        setTimeout(() => {
            mainContent.classList.add('fade-enter-active');
        }, 100);
    }
}); 
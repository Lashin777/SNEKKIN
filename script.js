// Trending section functionality
const trendingSection = document.querySelector('.trending');
const trendingCards = document.querySelectorAll('.trending-card');

// Staggered animation for trending cards
const trendingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove visible class from all cards first
            trendingCards.forEach(card => {
                card.classList.remove('visible');
            });
            
            // Add visible class with staggered delay
            trendingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 200);
            });
        } else {
            // Remove visible class when section is out of view
            trendingCards.forEach(card => {
                card.classList.remove('visible');
            });
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

trendingObserver.observe(trendingSection);

// Add hover effects for trending cards
trendingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Add click handlers for trending cards
document.querySelectorAll('.trending-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const brandName = card.querySelector('h3').textContent;
        // Add a small delay for the hover effect to be visible
        card.style.transform = 'scale(1.02) translateY(-5px)';
        setTimeout(() => {
            window.location.href = `sneakers.html?brand=${encodeURIComponent(brandName)}`;
        }, 150);
    });
}); 
/**
 * Animations Module
 * Handles scroll animations and other visual effects
 */

export function initScrollAnimation() {
    // Add noise overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkElementsInViewport);
    
    function checkElementsInViewport() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            } else {
                // Only remove the class if the element should animate every time
                if (element.classList.contains('animate-always')) {
                    element.classList.remove('active');
                }
            }
        });
    }
    
    // Parallax effect for background elements
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// Animate counters when they come into view
export function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200; // Lower is faster
    
    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / counterSpeed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => startCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    };
    
    // Start counters when they come into view
    const counterSection = document.querySelector('.stats-container');
    
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(counterSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counterSection);
    }
}

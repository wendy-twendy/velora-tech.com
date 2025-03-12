// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initCursorEffect();
    initScrollAnimation();
    initCounters();
    initProjectFilters();
    initTestimonialSlider();
    initContactForm();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Add scrolled class to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Custom cursor glow effect
function initCursorEffect() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseout', () => {
            cursorGlow.style.opacity = '0';
        });

        // Add glowing effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(255, 0, 170, 0.5) 0%, rgba(0, 195, 255, 0.3) 70%, transparent 100%)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(110, 0, 255, 0.5) 0%, rgba(0, 195, 255, 0.3) 70%, transparent 100%)';
            });
        });
    }
}

// Scroll animations
function initScrollAnimation() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.service-card, .about-content, .project-card, .testimonial-content, .contact-container');
    
    const revealElement = () => {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Add CSS class for animation
    const style = document.createElement('style');
    style.innerHTML = `
        .service-card, .about-content, .project-card, .testimonial-content, .contact-container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', revealElement);
    
    // Run once at start to check for elements already in view
    revealElement();
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    const updateCount = () => {
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight && rect.bottom >= 0);
            
            if (isVisible && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            }
        });
    };
    
    window.addEventListener('scroll', updateCount);
    updateCount();
}

// Project filters
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add CSS for smooth filter transitions
    const style = document.createElement('style');
    style.innerHTML = `
        .project-card {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Testimonial slider
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    // Show a specific slide
    const showSlide = (n) => {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };
    
    // Next/previous controls
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
    
    // Dot controls
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Show first slide
    showSlide(0);
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to your server
            // For demonstration, we'll just log it to console and show a success message
            console.log('Form submitted:', { name, email, service, message });
            
            // Create success notification
            const notification = document.createElement('div');
            notification.classList.add('form-notification');
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you, ${name}! Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
            `;
            
            // Add notification styles
            const style = document.createElement('style');
            style.innerHTML = `
                .form-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    animation: slideIn 0.5s forwards, slideOut 0.5s forwards 5s;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .notification-content i {
                    font-size: 24px;
                }
                
                .notification-content p {
                    margin: 0;
                    max-width: 300px;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add notification to body
            document.body.appendChild(notification);
            
            // Reset form
            contactForm.reset();
            
            // Remove notification after animation
            setTimeout(() => {
                notification.remove();
            }, 5500);
        });
    }
}

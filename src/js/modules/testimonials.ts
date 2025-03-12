/**
 * Testimonials Module
 * Handles testimonial slider functionality
 */

import { Testimonial, ComponentLoadedEventDetail } from '../../types/index';

/**
 * Initialize testimonial slider
 * Sets up the testimonial slider with navigation, auto-sliding, and event listeners
 */
export function initTestimonialSlider(): void {
    const slides = document.querySelectorAll<HTMLElement>('.testimonial-slide');
    const dots = document.querySelectorAll<HTMLElement>('.dot');
    const prevBtn = document.querySelector<HTMLElement>('.prev-btn');
    const nextBtn = document.querySelector<HTMLElement>('.next-btn');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Initialize slider
    showSlide(currentSlide);
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            showSlide(currentSlide);
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto slide (optional)
    let slideInterval: number = window.setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }, 5000);
    
    // Pause auto slide on hover
    const testimonialSlider = document.querySelector<HTMLElement>('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = window.setInterval(() => {
                currentSlide = (currentSlide + 1) % slideCount;
                showSlide(currentSlide);
            }, 5000);
        });
    }
    
    /**
     * Show a specific slide by index
     * @param index - The index of the slide to show
     */
    function showSlide(index: number): void {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        
        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
}

// Listen for language change events to reinitialize the testimonial slider
document.addEventListener('language:changed', () => {
    // Wait for components to be reloaded before initializing the slider
    document.addEventListener('components:all-loaded', () => {
        initTestimonialSlider();
    }, { once: true });
});

// Also listen for individual component loads
document.addEventListener('component:loaded', (event: Event) => {
    const customEvent = event as CustomEvent<ComponentLoadedEventDetail>;
    // Check if the loaded component is the testimonials component
    if (customEvent.detail.name === 'testimonials') {
        initTestimonialSlider();
    }
});

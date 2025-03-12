/**
 * Animations Module
 * Handles scroll animations and other visual effects
 */

import { AnimationOptions } from '../../types/index';

/**
 * Initialize scroll animations
 * @param options Optional animation configuration options
 */
export function initScrollAnimation(options?: AnimationOptions): void {
    const defaultOptions: AnimationOptions = {
        threshold: 0.2,
        rootMargin: '0px',
        once: true
    };
    
    const config: AnimationOptions = { ...defaultOptions, ...options };
    
    // Add noise overlay
    const noiseOverlay: HTMLDivElement = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    
    // Elements to animate on scroll
    const animatedElements: NodeListOf<Element> = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkElementsInViewport);
    
    function checkElementsInViewport(): void {
        animatedElements.forEach(element => {
            const elementTop: number = element.getBoundingClientRect().top;
            const elementVisible: number = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            } else {
                // Only remove the class if the element should animate every time
                if (!config.once && element.classList.contains('animate-always')) {
                    element.classList.remove('active');
                }
            }
        });
    }
    
    // Parallax effect for background elements
    const parallaxElements: NodeListOf<Element> = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollPosition: number = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed: number = parseFloat(element.getAttribute('data-speed') || '0.5');
            (element as HTMLElement).style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

/**
 * Initialize counter animations for statistics
 */
export function initCounters(): void {
    const counters: NodeListOf<Element> = document.querySelectorAll('.counter');
    const counterSpeed: number = 200; // Lower is faster
    
    const startCounters = (): void => {
        counters.forEach(counter => {
            const target: number = +(counter.getAttribute('data-target') || '0');
            const count: number = +(counter.textContent || '0');
            const increment: number = target / counterSpeed;
            
            if (count < target) {
                counter.textContent = Math.ceil(count + increment).toString();
                setTimeout(() => startCounters(), 1);
            } else {
                counter.textContent = target.toString();
            }
        });
    };
    
    // Start counters when they come into view
    const counterSection: Element | null = document.querySelector('.stats-container');
    
    if (counterSection) {
        const observer: IntersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(counterSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counterSection);
    }
}

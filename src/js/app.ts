/**
 * Main Application Entry Point
 * Imports and initializes all modules
 */

// Import modules
import { initNavigation } from './modules/navigation';
import { initCursorEffect } from './modules/cursor';
import { initScrollAnimation, initCounters } from './modules/animations';
import { initProjectFilters } from './modules/projects';
import { initTestimonialSlider } from './modules/testimonials';
import { initContactForm } from './modules/contact';
import { loadComponents } from './modules/component-loader';
import { initLanguageSystem } from './modules/language-manager';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Add noise overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    
    // Initialize language system first
    await initLanguageSystem();
    
    // Load components after language is set
    await loadComponents();
    
    // Initialize modules after components are loaded
    initNavigation();
    initCursorEffect();
    initScrollAnimation();
    initCounters();
    initProjectFilters();
    initTestimonialSlider();
    initContactForm();
    
    // Dispatch event that all components are loaded and initialized
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
    
    // Lazy load and initialize the Spline viewer only when needed
    const splineContainer = document.getElementById('spline-canvas-container');
    if (splineContainer) {
        // Show loading indicator immediately
        const loadingElement = document.querySelector('.spline-loading') as HTMLElement;
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.classList.add('visible');
        }
        
        // Lazy load the Spline viewer module
        import(/* webpackChunkName: "spline-module" */ './modules/spline-viewer')
            .then(module => {
                // Initialize the Spline viewer
                module.initSplineViewer();
            })
            .catch(err => {
                console.error('Failed to load Spline viewer module:', err);
                // Hide loading indicator on error
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                    loadingElement.classList.remove('visible');
                }
                // Show error message
                const errorElement = document.querySelector('.spline-error') as HTMLElement;
                if (errorElement) {
                    errorElement.style.display = 'flex';
                }
            });
    }
    
    // Run tests in development mode
    if (isDevelopment) {
        import('./test-runner').then(() => {
            console.log('Test runner loaded');
        }).catch(err => {
            console.error('Failed to load test runner:', err);
        });
    }
    
    console.log('Velora Tech application initialized');
});

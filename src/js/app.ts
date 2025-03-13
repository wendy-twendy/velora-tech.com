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
import { ReactComponentBridge } from './modules/react-component-bridge';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[app] DOM content loaded, initializing application...');
    
    // Add noise overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    
    // Initialize language system first
    console.log('[app] Initializing language system...');
    await initLanguageSystem();
    
    // Load components after language is set
    console.log('[app] Loading components...');
    await loadComponents();
    
    // Initialize React component bridge
    console.log('[app] Initializing React component bridge...');
    ReactComponentBridge.init();
    
    // Initialize modules after components are loaded
    console.log('[app] Initializing modules...');
    initNavigation();
    initCursorEffect();
    initScrollAnimation();
    initCounters();
    initProjectFilters();
    initTestimonialSlider();
    initContactForm();
    
    // Dispatch event that all components are loaded and initialized
    console.log('[app] Dispatching components:all-loaded event');
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
    
    // Run tests in development mode
    if (isDevelopment) {
        import('./test-runner').then(() => {
            console.log('[app] Test runner loaded');
        }).catch(err => {
            console.error('[app] Failed to load test runner:', err);
        });
    }
    
    console.log('[app] Velora Tech application initialized');
});

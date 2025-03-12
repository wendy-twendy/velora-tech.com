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
import { initSplineScene } from './modules/spline-scene';

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
    
    // Initialize the Spline 3D scene in the hero section
    initSplineScene('spline-container', 'https://prod.spline.design/6HYSzjF6o5jFsTZY/scene.splinecode');
    
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

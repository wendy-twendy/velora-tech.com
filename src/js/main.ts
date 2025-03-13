/**
 * Main JavaScript file for Velora Tech website
 * Initializes all modules and functionality
 */

// Import modules
import { initNavigation } from './modules/navigation';
import { initCursorEffect } from './modules/cursor';
import { initScrollAnimation, initCounters } from './modules/animations';
import { initProjectFilters } from './modules/projects';
import { initTestimonialSlider } from './modules/testimonials';
import { initContactForm } from './modules/contact';
import { initLanguageSystem } from './modules/language-manager';
import { loadComponents } from './modules/component-loader';
import { initSplineScene } from './modules/spline-scene';

/**
 * Initialize all website functionality
 */
function initWebsite(): void {
    // Initialize language manager first to detect and set the correct language
    initLanguageSystem();
    
    // Load components based on the selected language
    loadComponents().then(() => {
        // Initialize all modules after components are loaded
        initNavigation();
        initCursorEffect();
        initScrollAnimation();
        initCounters();
        initProjectFilters();
        initTestimonialSlider();
        initContactForm();
        
        // Initialize the Spline 3D scene in the hero section
        initSplineScene('spline-container', 'https://prod.spline.design/cj6GSivfEQ9lqQqm/scene.splinecode');
        
        // Dispatch event that all components are loaded and initialized
        document.dispatchEvent(new CustomEvent('components:all-loaded'));
    });
}

// Wait for the DOM to be fully loaded before initializing the website
document.addEventListener('DOMContentLoaded', initWebsite);

// Re-initialize when language changes
document.addEventListener('language:changed', () => {
    // The component-loader will handle reloading components
    // Individual modules listen for the components:all-loaded event
    console.log('Language changed, reinitializing website...');
});

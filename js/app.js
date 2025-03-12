/**
 * Main Application Entry Point
 * Imports and initializes all modules
 */

import { initNavigation } from './modules/navigation.js';
import { initCursorEffect } from './modules/cursor.js';
import { initScrollAnimation, initCounters } from './modules/animations.js';
import { initProjectFilters } from './modules/projects.js';
import { initTestimonialSlider } from './modules/testimonials.js';
import { initContactForm } from './modules/contact.js';
import { loadComponents } from './modules/component-loader.js';
import { initLanguageSystem } from './modules/language-manager.js';

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
    
    console.log('Velora Tech application initialized');
});

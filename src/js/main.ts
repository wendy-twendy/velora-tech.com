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
import { initLanguageSystem, getCurrentLanguage } from './modules/language-manager';
import { loadComponents } from './modules/component-loader';
import { initTranslationSystem, translatePage } from './modules/translation-service';
import { ReactComponentBridge } from './modules/react-component-bridge';
import { DebugPanel } from './modules/debug-panel';

// Import CSS for Tailwind
import '../../css/tailwind.css';

/**
 * Initialize all website functionality
 */
async function initWebsite(): Promise<void> {
    console.log('Initializing website...');
    
    try {
        // Initialize debug panel in development mode
        if (process.env.NODE_ENV === 'development') {
            DebugPanel.init();
        }
        
        // Initialize language manager first to detect and set the correct language
        const detectedLanguage = await initLanguageSystem();
        console.log(`Website initialized with language: ${detectedLanguage}`);
        
        // Initialize the translation system with the detected language
        await initTranslationSystem();
        
        // Load components based on the selected language
        await loadComponents();
        
        // Initialize all modules after components are loaded
        initNavigation();
        initCursorEffect();
        initScrollAnimation();
        initCounters();
        initProjectFilters();
        initTestimonialSlider();
        initContactForm();
        
        // Initialize React components
        ReactComponentBridge.init();
        
        // Dispatch event that all components are loaded and initialized
        document.dispatchEvent(new CustomEvent('components:all-loaded'));
        
        // Apply initial translations to all elements
        await translatePage();
        
        console.log('Website initialization complete');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}

// Wait for the DOM to be fully loaded before initializing the website
document.addEventListener('DOMContentLoaded', initWebsite);

// Define custom event interface for language changed event
interface LanguageChangedEvent extends CustomEvent {
    detail: {
        language: string;
    };
}

// Declare custom events in the global WindowEventMap
declare global {
    interface DocumentEventMap {
        'language:changed': LanguageChangedEvent;
        'components:all-loaded': CustomEvent;
    }
}

// Re-initialize when language changes
document.addEventListener('language:changed', async (event) => {
    const languageChangedEvent = event as LanguageChangedEvent;
    console.log('Language changed event detected in main.ts');
    
    try {
        // First translate all existing elements on the page
        await translatePage();
        
        // Then reload components that need complete reloading
        await loadComponents();
        
        // Reinitialize React components
        ReactComponentBridge.init();
        
        // Reinitialize any modules that need to be updated after language change
        initCounters();
        initProjectFilters();
        initTestimonialSlider();
        
        console.log(`Language changed to ${getCurrentLanguage()}, components reloaded and translations applied`);
    } catch (error) {
        console.error('Error handling language change:', error);
    }
});

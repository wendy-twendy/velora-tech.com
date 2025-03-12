/**
 * Component Loader Module
 * Handles loading HTML components dynamically with language support
 */

import { LanguageCode, ComponentLoadedEventDetail } from '../../types/index';
import { getCurrentLanguage, Languages } from './language-manager';

/**
 * Load all components based on their data-component attribute
 * and current language setting
 */
export async function loadComponents(): Promise<void> {
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    const currentLanguage = getCurrentLanguage();
    
    for (const placeholder of componentPlaceholders) {
        const componentName = placeholder.getAttribute('data-component');
        
        if (!componentName) {
            console.error('Component placeholder missing data-component attribute');
            continue;
        }
        
        try {
            // First try to load language-specific component
            let response = await fetch(`components/lang/${currentLanguage}/${componentName}.html`);
            
            // If language-specific component doesn't exist, fall back to default
            if (!response.ok) {
                response = await fetch(`components/${componentName}.html`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
            }
            
            const html = await response.text();
            placeholder.innerHTML = html;
            
            // Dispatch event when component is loaded
            const event = new CustomEvent<ComponentLoadedEventDetail>('component:loaded', { 
                detail: { 
                    name: componentName, 
                    element: placeholder as HTMLElement 
                }
            });
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            placeholder.innerHTML = `<div class="error-message">Failed to load ${componentName} component</div>`;
        }
    }
    
    // Dispatch event when all components are loaded
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
}

// Add type declaration for the custom events
declare global {
    interface WindowEventMap {
        'component:loaded': CustomEvent<ComponentLoadedEventDetail>;
        'components:all-loaded': CustomEvent;
    }
}

// Reload components when language changes
document.addEventListener('language:changed', async () => {
    await loadComponents();
});

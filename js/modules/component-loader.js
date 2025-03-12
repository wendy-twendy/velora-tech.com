/**
 * Component Loader Module
 * Handles loading HTML components dynamically with language support
 */

import { getCurrentLanguage, LANGUAGES } from './language-manager.js';

export async function loadComponents() {
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    const currentLanguage = getCurrentLanguage();
    
    for (const placeholder of componentPlaceholders) {
        const componentName = placeholder.getAttribute('data-component');
        
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
            const event = new CustomEvent('component:loaded', { 
                detail: { name: componentName, element: placeholder }
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

// Reload components when language changes
document.addEventListener('language:changed', async () => {
    await loadComponents();
});

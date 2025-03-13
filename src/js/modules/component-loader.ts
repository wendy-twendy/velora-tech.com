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
        
        // Skip reloading the hero component which contains the Spline scene
        // to prevent reinitialization during language changes
        const isHeroComponent = componentName === 'hero';
        const hasSplineElement = placeholder.querySelector('#spline-container');
        
        // If this is the hero component with a loaded Spline scene, only update the text content
        if (isHeroComponent && hasSplineElement && document.querySelector('.spline-canvas canvas')) {
            try {
                // Get the language-specific hero component
                const response = await fetch(`components/lang/${currentLanguage}/${componentName}.html`);
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
                
                const html = await response.text();
                
                // Create a temporary element to parse the HTML
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;
                
                // Only update text content, not the Spline container
                updateTextContentOnly(placeholder as HTMLElement, tempElement);
                
                // Dispatch event when component is updated
                const event = new CustomEvent<ComponentLoadedEventDetail>('component:loaded', { 
                    detail: { 
                        name: componentName, 
                        element: placeholder as HTMLElement 
                    }
                });
                document.dispatchEvent(event);
                
                continue; // Skip the normal component loading for hero
            } catch (error) {
                console.error(`Error updating hero component text: ${error}`);
                // Continue with normal loading as fallback
            }
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

/**
 * Update only the text content of a component without replacing the Spline scene
 * @param targetElement - The element to update
 * @param sourceElement - The element containing the new content
 */
function updateTextContentOnly(targetElement: HTMLElement, sourceElement: HTMLElement): void {
    // Update the hero heading text
    const targetHeading = targetElement.querySelector('.hero-content h1');
    const sourceHeading = sourceElement.querySelector('.hero-content h1');
    if (targetHeading && sourceHeading) {
        targetHeading.textContent = sourceHeading.textContent;
        targetHeading.setAttribute('data-text', sourceHeading.getAttribute('data-text') || '');
    }
    
    // Update the hero paragraph text
    const targetParagraph = targetElement.querySelector('.hero-content p');
    const sourceParagraph = sourceElement.querySelector('.hero-content p');
    if (targetParagraph && sourceParagraph) {
        targetParagraph.textContent = sourceParagraph.textContent;
    }
    
    // Update the hero button texts
    const targetButtons = targetElement.querySelectorAll('.cta-buttons a');
    const sourceButtons = sourceElement.querySelectorAll('.cta-buttons a');
    
    if (targetButtons.length === sourceButtons.length) {
        for (let i = 0; i < targetButtons.length; i++) {
            targetButtons[i].textContent = sourceButtons[i].textContent;
        }
    }
    
    // Update the loading text in the Spline container
    const targetLoadingText = targetElement.querySelector('.spline-loading p');
    const sourceLoadingText = sourceElement.querySelector('.spline-loading p');
    if (targetLoadingText && sourceLoadingText) {
        targetLoadingText.textContent = sourceLoadingText.textContent;
    }
    
    // Update error text
    const targetErrorHeading = targetElement.querySelector('.spline-error h3');
    const sourceErrorHeading = sourceElement.querySelector('.spline-error h3');
    if (targetErrorHeading && sourceErrorHeading) {
        targetErrorHeading.textContent = sourceErrorHeading.textContent;
    }
    
    const targetErrorText = targetElement.querySelector('.spline-error p');
    const sourceErrorText = sourceElement.querySelector('.spline-error p');
    if (targetErrorText && sourceErrorText) {
        targetErrorText.textContent = sourceErrorText.textContent;
    }
    
    // Update scroll text
    const targetScrollText = targetElement.querySelector('.scroll-text');
    const sourceScrollText = sourceElement.querySelector('.scroll-text');
    if (targetScrollText && sourceScrollText) {
        targetScrollText.textContent = sourceScrollText.textContent;
    }
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

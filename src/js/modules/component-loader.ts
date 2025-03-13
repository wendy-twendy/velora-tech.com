/**
 * Component Loader Module
 * Handles loading HTML components dynamically with language support
 */

import { LanguageCode, ComponentLoadedEventDetail } from '../../types/index';
import { getCurrentLanguage, Languages } from './language-manager';
import { translateElement } from './translation-service';

// List of component names that should be handled by React instead of HTML loading
const REACT_COMPONENTS = ['spline-scene', 'spline-scene-basic'];

/**
 * Load all components based on their data-component attribute
 * and current language setting
 */
export async function loadComponents(): Promise<void> {
    console.log('[component-loader] Loading components...');
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    console.log(`[component-loader] Found ${componentPlaceholders.length} component placeholders`);
    
    for (const placeholder of componentPlaceholders) {
        const componentName = placeholder.getAttribute('data-component');
        
        if (!componentName) {
            console.error('[component-loader] Component placeholder missing data-component attribute');
            continue;
        }
        
        console.log(`[component-loader] Loading component: ${componentName}`);
        
        // Skip loading HTML for React components
        if (REACT_COMPONENTS.includes(componentName)) {
            console.log(`[component-loader] Identified React component: ${componentName}`);
            
            // Dispatch event when component is identified (will be handled by React bridge)
            const event = new CustomEvent<ComponentLoadedEventDetail>('component:loaded', { 
                detail: { 
                    name: componentName, 
                    element: placeholder as HTMLElement 
                }
            });
            document.dispatchEvent(event);
            console.log(`[component-loader] Dispatched component:loaded event for React component: ${componentName}`);
            continue;
        }
        
        try {
            // Load the component template from the main components directory
            console.log(`[component-loader] Fetching component template: components/${componentName}.html`);
            const response = await fetch(`components/${componentName}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            placeholder.innerHTML = html;
            
            // Apply translations to the loaded component
            console.log(`[component-loader] Applying translations to component: ${componentName}`);
            await translateElement(placeholder as HTMLElement);
            
            // If this is the header component, make sure the language switcher reflects the current language
            if (componentName === 'header') {
                const currentLanguage = getCurrentLanguage();
                console.log(`[component-loader] Setting active language in header: ${currentLanguage}`);
                
                const languageSwitcher = placeholder.querySelector('.language-switcher');
                if (languageSwitcher) {
                    const buttons = languageSwitcher.querySelectorAll('button');
                    
                    buttons.forEach(button => {
                        const buttonLang = button.getAttribute('data-language');
                        
                        if (buttonLang === currentLanguage) {
                            button.classList.add('active', 'lang-active');
                        } else {
                            button.classList.remove('active', 'lang-active');
                        }
                    });
                }
            }
            
            // Dispatch event when component is loaded
            const event = new CustomEvent<ComponentLoadedEventDetail>('component:loaded', { 
                detail: { 
                    name: componentName, 
                    element: placeholder as HTMLElement 
                }
            });
            document.dispatchEvent(event);
            
            console.log(`[component-loader] Component ${componentName} loaded successfully`);
        } catch (error) {
            console.error(`[component-loader] Error loading component ${componentName}:`, error);
            placeholder.innerHTML = `<div class="error-message">Failed to load ${componentName} component</div>`;
        }
    }
    
    // Dispatch event when all components are loaded
    console.log('[component-loader] All components loaded');
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

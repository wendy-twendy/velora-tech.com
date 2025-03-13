/**
 * Component Loader Module
 * Handles loading HTML components dynamically with language support
 */

import { LanguageCode, ComponentLoadedEventDetail } from '../../types/index';
import { getCurrentLanguage, Languages } from './language-manager';
import { translateElement } from './translation-service';

/**
 * Load all components based on their data-component attribute
 * and current language setting
 */
export async function loadComponents(): Promise<void> {
    console.log('Loading components...');
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    console.log(`Found ${componentPlaceholders.length} component placeholders`);
    
    for (const placeholder of componentPlaceholders) {
        const componentName = placeholder.getAttribute('data-component');
        
        if (!componentName) {
            console.error('Component placeholder missing data-component attribute');
            continue;
        }
        
        console.log(`Loading component: ${componentName}`);
        
        try {
            // Load the component template from the main components directory
            console.log(`Fetching component template: components/${componentName}.html`);
            const response = await fetch(`components/${componentName}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            placeholder.innerHTML = html;
            
            // Apply translations to the loaded component
            console.log(`Applying translations to component: ${componentName}`);
            await translateElement(placeholder as HTMLElement);
            
            // If this is the header component, make sure the language switcher reflects the current language
            if (componentName === 'header') {
                const currentLanguage = getCurrentLanguage();
                console.log(`Setting active language in header: ${currentLanguage}`);
                
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
            
            console.log(`Component ${componentName} loaded successfully`);
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            placeholder.innerHTML = `<div class="error-message">Failed to load ${componentName} component</div>`;
        }
    }
    
    // Dispatch event when all components are loaded
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
    console.log('All components loaded');
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

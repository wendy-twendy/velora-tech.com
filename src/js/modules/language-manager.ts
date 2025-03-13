/**
 * Language Manager Module
 * Handles language detection, switching, and storage
 */

import { LanguageCode, LocationData } from '../../types/index';

// Available languages
export enum Languages {
  EN = 'en',
  AL = 'al'
}

// Default language
const DEFAULT_LANGUAGE: Languages = Languages.EN;

// Language storage key
const LANGUAGE_STORAGE_KEY: string = 'velora_preferred_language';

/**
 * Detect user's language based on browser settings and location
 * @returns {Promise<LanguageCode>} The detected language code
 */
async function detectUserLanguage(): Promise<LanguageCode> {
    // First check if user has a stored preference
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && Object.values(Languages).includes(storedLanguage as Languages)) {
        console.log(`Using stored language preference: ${storedLanguage}`);
        return storedLanguage as LanguageCode;
    }
    
    try {
        // Try to detect location using IP geolocation API
        console.log('Attempting to detect user location...');
        const response = await fetch('https://ipapi.co/json/');
        const data: LocationData = await response.json();
        
        // If user is in Albania, set Albanian as default
        if (data.country_code === 'AL') {
            console.log('User detected in Albania, setting language to Albanian');
            return Languages.AL;
        }
    } catch (error) {
        console.error('Error detecting user location:', error);
        // Fall back to browser language if geolocation fails
    }
    
    // Check browser language as fallback
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('sq')) {
        console.log('Browser language indicates Albanian, setting language to Albanian');
        return Languages.AL;
    }
    
    // Default to English if no other detection works
    console.log('No language preference detected, defaulting to English');
    return DEFAULT_LANGUAGE;
}

/**
 * Set the current language
 * @param {LanguageCode} languageCode - The language code to set
 */
function setLanguage(languageCode: LanguageCode): void {
    if (!Object.values(Languages).includes(languageCode as Languages)) {
        console.error(`Invalid language code: ${languageCode}`);
        return;
    }
    
    console.log(`Setting language to: ${languageCode}`);
    
    // Store language preference
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    // Set language attribute on html element
    document.documentElement.setAttribute('lang', languageCode === Languages.AL ? 'sq' : 'en');
    
    // Update language switcher UI
    updateLanguageSwitcherUI(languageCode);
    
    // Dispatch language changed event with the new language
    const event = new CustomEvent('language:changed', { 
        detail: { language: languageCode }
    });
    
    console.log(`Dispatching language:changed event with language: ${languageCode}`);
    document.dispatchEvent(event);
}

/**
 * Get the current language
 * @returns {LanguageCode} The current language code
 */
function getCurrentLanguage(): LanguageCode {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const currentLang = (storedLanguage || DEFAULT_LANGUAGE) as LanguageCode;
    console.log(`Current language is: ${currentLang}`);
    return currentLang;
}

/**
 * Update the language switcher UI to reflect current language
 * @param {LanguageCode} languageCode - The current language code
 */
function updateLanguageSwitcherUI(languageCode: LanguageCode): void {
    console.log(`Updating language switcher UI for: ${languageCode}`);
    const switchers = document.querySelectorAll('.language-switcher');
    console.log(`Found ${switchers.length} language switchers`);
    
    switchers.forEach(switcher => {
        const buttons = switcher.querySelectorAll('button');
        console.log(`Found ${buttons.length} language buttons in switcher`);
        
        buttons.forEach(button => {
            const buttonLang = button.getAttribute('data-language');
            console.log(`Button language: ${buttonLang}, current language: ${languageCode}`);
            
            if (buttonLang === languageCode) {
                button.classList.add('active', 'lang-active');
                console.log(`Activated button for ${buttonLang}`);
            } else {
                button.classList.remove('active', 'lang-active');
                console.log(`Deactivated button for ${buttonLang}`);
            }
        });
    });
}

/**
 * Initialize the language system
 */
export async function initLanguageSystem(): Promise<LanguageCode> {
    console.log('Initializing language system...');
    
    // Detect user's language
    const detectedLanguage = await detectUserLanguage();
    console.log(`Detected language: ${detectedLanguage}`);
    
    // Set initial language
    setLanguage(detectedLanguage);
    
    // Add event listeners for language switcher buttons
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Check if the clicked element is a language button
        if (target.hasAttribute('data-language')) {
            const newLanguage = target.getAttribute('data-language') as LanguageCode;
            console.log(`Language button clicked: ${newLanguage}`);
            
            if (newLanguage !== getCurrentLanguage()) {
                console.log(`Switching language from ${getCurrentLanguage()} to ${newLanguage}`);
                setLanguage(newLanguage);
                
                // Force a page reload if needed
                // window.location.reload();
            } else {
                console.log(`Language ${newLanguage} already active, no change needed`);
            }
            return;
        }
        
        // Check if the clicked element is inside a language button
        const langButton = target.closest('[data-language]') as HTMLElement;
        if (langButton) {
            const newLanguage = langButton.getAttribute('data-language') as LanguageCode;
            console.log(`Language button parent clicked: ${newLanguage}`);
            
            if (newLanguage !== getCurrentLanguage()) {
                console.log(`Switching language from ${getCurrentLanguage()} to ${newLanguage}`);
                setLanguage(newLanguage);
                
                // Force a page reload if needed
                // window.location.reload();
            } else {
                console.log(`Language ${newLanguage} already active, no change needed`);
            }
        }
    });
    
    // Apply initial UI state
    updateLanguageSwitcherUI(detectedLanguage);
    
    return detectedLanguage;
}

// Export public API
export { getCurrentLanguage, setLanguage };

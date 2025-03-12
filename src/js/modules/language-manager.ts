/**
 * Language Manager Module
 * Handles language detection, switching, and storage
 */

import { LanguageCode, LocationData } from '../../types/index';

// Available languages
enum Languages {
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
        return storedLanguage as LanguageCode;
    }
    
    try {
        // Try to detect location using IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data: LocationData = await response.json();
        
        // If user is in Albania, set Albanian as default
        if (data.country_code === 'AL') {
            return Languages.AL;
        }
    } catch (error) {
        console.error('Error detecting user location:', error);
        // Fall back to browser language if geolocation fails
    }
    
    // Check browser language as fallback
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('sq')) {
        return Languages.AL;
    }
    
    // Default to English if no other detection works
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
    
    // Store language preference
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    // Set language attribute on html element
    document.documentElement.setAttribute('lang', languageCode === Languages.AL ? 'sq' : 'en');
    
    // Reload components with new language
    document.dispatchEvent(new CustomEvent('language:changed', { 
        detail: { language: languageCode }
    }));
    
    // Update language switcher UI
    updateLanguageSwitcherUI(languageCode);
}

/**
 * Get the current language
 * @returns {LanguageCode} The current language code
 */
function getCurrentLanguage(): LanguageCode {
    return (localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE) as LanguageCode;
}

/**
 * Update the language switcher UI to reflect current language
 * @param {LanguageCode} languageCode - The current language code
 */
function updateLanguageSwitcherUI(languageCode: LanguageCode): void {
    const switchers = document.querySelectorAll('.language-switcher');
    
    switchers.forEach(switcher => {
        const buttons = switcher.querySelectorAll('button');
        
        buttons.forEach(button => {
            const buttonLang = button.getAttribute('data-language');
            
            if (buttonLang === languageCode) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    });
}

/**
 * Initialize the language system
 */
export async function initLanguageSystem(): Promise<LanguageCode> {
    // Detect user's language
    const detectedLanguage = await detectUserLanguage();
    
    // Set initial language
    setLanguage(detectedLanguage);
    
    // Add event listeners for language switcher buttons
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const langButton = target.closest('[data-language]') as HTMLElement;
        
        if (langButton) {
            const newLanguage = langButton.getAttribute('data-language') as LanguageCode;
            setLanguage(newLanguage);
        }
    });
    
    return detectedLanguage;
}

// Export public API
export { Languages, getCurrentLanguage, setLanguage };

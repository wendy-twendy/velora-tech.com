/**
 * Language Manager Module
 * Handles language detection, switching, and storage
 */

// Available languages
const LANGUAGES = {
    EN: 'en',
    AL: 'al'
};

// Default language
const DEFAULT_LANGUAGE = LANGUAGES.EN;

// Language storage key
const LANGUAGE_STORAGE_KEY = 'velora_preferred_language';

/**
 * Detect user's language based on browser settings and location
 * @returns {Promise<string>} The detected language code
 */
async function detectUserLanguage() {
    // First check if user has a stored preference
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && Object.values(LANGUAGES).includes(storedLanguage)) {
        return storedLanguage;
    }
    
    try {
        // Try to detect location using IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // If user is in Albania, set Albanian as default
        if (data.country_code === 'AL') {
            return LANGUAGES.AL;
        }
    } catch (error) {
        console.error('Error detecting user location:', error);
        // Fall back to browser language if geolocation fails
    }
    
    // Check browser language as fallback
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('sq')) {
        return LANGUAGES.AL;
    }
    
    // Default to English if no other detection works
    return DEFAULT_LANGUAGE;
}

/**
 * Set the current language
 * @param {string} languageCode - The language code to set
 */
function setLanguage(languageCode) {
    if (!Object.values(LANGUAGES).includes(languageCode)) {
        console.error(`Invalid language code: ${languageCode}`);
        return;
    }
    
    // Store language preference
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    // Set language attribute on html element
    document.documentElement.setAttribute('lang', languageCode === LANGUAGES.AL ? 'sq' : 'en');
    
    // Reload components with new language
    document.dispatchEvent(new CustomEvent('language:changed', { 
        detail: { language: languageCode }
    }));
    
    // Update language switcher UI
    updateLanguageSwitcherUI(languageCode);
}

/**
 * Get the current language
 * @returns {string} The current language code
 */
function getCurrentLanguage() {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
}

/**
 * Update the language switcher UI to reflect current language
 * @param {string} languageCode - The current language code
 */
function updateLanguageSwitcherUI(languageCode) {
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
export async function initLanguageSystem() {
    // Detect user's language
    const detectedLanguage = await detectUserLanguage();
    
    // Set initial language
    setLanguage(detectedLanguage);
    
    // Add event listeners for language switcher buttons
    document.addEventListener('click', (event) => {
        const langButton = event.target.closest('[data-language]');
        
        if (langButton) {
            const newLanguage = langButton.getAttribute('data-language');
            setLanguage(newLanguage);
        }
    });
    
    return detectedLanguage;
}

// Export public API
export { LANGUAGES, getCurrentLanguage, setLanguage };

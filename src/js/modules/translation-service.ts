/**
 * Translation Service Module
 * Handles loading and retrieving translations from JSON files
 */

import { LanguageCode } from '../../types/index';
import { getCurrentLanguage } from './language-manager';

// Type for translation data
type TranslationData = {
  [key: string]: string | TranslationData;
};

// Cache for loaded translations
const translationCache: Record<LanguageCode, TranslationData> = {} as Record<LanguageCode, TranslationData>;

/**
 * Load translations for a specific language
 * @param {LanguageCode} language - The language code to load translations for
 * @returns {Promise<TranslationData>} The loaded translation data
 */
async function loadTranslations(language: LanguageCode): Promise<TranslationData> {
  // Return from cache if already loaded
  if (translationCache[language]) {
    return translationCache[language];
  }
  
  try {
    console.log(`Attempting to load translations for ${language} from /src/locales/${language}.json`);
    
    // First try with absolute path
    let response = await fetch(`/src/locales/${language}.json`);
    
    // If that fails, try with relative path
    if (!response.ok) {
      console.log(`Failed with absolute path, trying relative path for ${language}`);
      response = await fetch(`../locales/${language}.json`);
    }
    
    // If that also fails, try another relative path
    if (!response.ok) {
      console.log(`Failed with first relative path, trying another path for ${language}`);
      response = await fetch(`src/locales/${language}.json`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}: ${response.status} ${response.statusText}`);
    }
    
    const translations = await response.json();
    console.log(`Successfully loaded translations for ${language}`, translations);
    translationCache[language] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    return {};
  }
}

/**
 * Clear translation cache for a specific language or all languages
 * @param {LanguageCode} [language] - Optional language code to clear, if not provided all languages are cleared
 */
function clearTranslationCache(language?: LanguageCode): void {
  if (language) {
    console.log(`Clearing translation cache for ${language}`);
    delete translationCache[language];
  } else {
    // Clear all languages
    console.log('Clearing all translation caches');
    Object.keys(translationCache).forEach(lang => {
      delete translationCache[lang as LanguageCode];
    });
  }
}

/**
 * Get a translation value by key path
 * @param {string} keyPath - Dot notation path to the translation key (e.g., 'about.title')
 * @param {LanguageCode} [language] - Optional language code, defaults to current language
 * @returns {Promise<string>} The translated text
 */
export async function getTranslation(keyPath: string, language?: LanguageCode): Promise<string> {
  const lang = language || getCurrentLanguage();
  const translations = await loadTranslations(lang);
  
  // Navigate the object using the key path
  const keys = keyPath.split('.');
  let value: any = translations;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Translation key not found: ${keyPath} in language ${lang}`);
      return keyPath; // Return the key path as fallback
    }
  }
  
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/**
 * Initialize the translation system
 * @returns {Promise<void>}
 */
export async function initTranslationSystem(): Promise<void> {
  const currentLanguage = getCurrentLanguage();
  console.log(`Initializing translation system with language: ${currentLanguage}`);
  
  try {
    await loadTranslations(currentLanguage);
    
    // Preload the other language for faster switching
    const otherLanguage = currentLanguage === 'en' ? 'al' : 'en';
    loadTranslations(otherLanguage).catch(() => {}); // Silently fail preloading
    
    // Apply initial translations
    await translatePage();
    
    console.log('Translation system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize translation system:', error);
  }
  
  // Listen for language changes
  document.addEventListener('language:changed', ((event: CustomEvent<{language: LanguageCode}>) => {
    const newLanguage = event.detail.language;
    console.log(`Translation service detected language change to: ${newLanguage}`);
    
    // Clear the cache for the new language to ensure fresh translations
    clearTranslationCache(newLanguage);
    
    // Load the new language
    loadTranslations(newLanguage).catch(error => {
      console.error(`Failed to load translations for new language: ${newLanguage}`, error);
    });
  }) as EventListener);
}

/**
 * Apply translations to an HTML element
 * @param {HTMLElement} element - The element to translate
 * @returns {Promise<void>}
 */
export async function translateElement(element: HTMLElement): Promise<void> {
  const translationElements = element.querySelectorAll('[data-i18n]');
  console.log(`Translating ${translationElements.length} elements in`, element);
  
  for (const el of translationElements) {
    const key = el.getAttribute('data-i18n');
    if (!key) continue;
    
    try {
      const translation = await getTranslation(key);
      
      // Handle different element types
      if (el instanceof HTMLInputElement) {
        if (el.type === 'placeholder') {
          el.placeholder = translation;
        } else {
          el.value = translation;
        }
      } else if (el instanceof HTMLImageElement) {
        el.alt = translation;
      } else {
        el.textContent = translation;
        
        // If this is a glitch element, also update the data-text attribute
        if (el.classList.contains('glitch') && el.hasAttribute('data-text')) {
          el.setAttribute('data-text', translation);
        }
      }
    } catch (error) {
      console.error(`Error translating element with key ${key}:`, error);
    }
  }
}

/**
 * Translate all elements on the page with data-i18n attributes
 * @returns {Promise<void>}
 */
export async function translatePage(): Promise<void> {
  console.log('Translating entire page');
  await translateElement(document.body);
}

// Export public API
export { TranslationData };

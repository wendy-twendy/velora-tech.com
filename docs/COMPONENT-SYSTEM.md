# Velora Tech Component System Documentation

## Table of Contents
- [Introduction](#introduction)
- [Component System Overview](#component-system-overview)
- [Component Loading API](#component-loading-api)
- [Language Management API](#language-management-api)
- [Translation API](#translation-api)
- [Event System](#event-system)
- [Creating New Components](#creating-new-components)
- [Extending Existing Components](#extending-existing-components)
- [TypeScript Interfaces](#typescript-interfaces)

## Introduction

This document provides detailed information about the component system of the Velora Tech website. It is designed to help developers understand how to use, extend, and integrate with the existing components.

The Velora Tech website uses a custom component system with TypeScript modules to create a modular, maintainable, and bilingual website. This document explains how these components work and how to extend them.

## Component System Overview

The Velora Tech website uses a component-based architecture where UI elements are defined as reusable HTML components that can be loaded dynamically. The component system consists of:

1. **Component Templates**: HTML files in the `components/` directory
2. **Component Loader**: A TypeScript module that loads components dynamically
3. **Component Integration**: Components are integrated into the page using placeholders with `data-component` attributes

### Component Structure

```
components/
├── pages/                # Page-specific components
│   ├── about-page.html
│   ├── contact-page.html
│   └── ...
├── about.html            # Reusable components
├── contact.html
├── footer.html
├── header.html
├── hero.html
├── projects.html
├── services.html
└── testimonials.html
```

Each component is a self-contained HTML fragment that can include:
- HTML structure
- Translation keys (using `data-i18n` attributes)
- CSS classes for styling
- Data attributes for JavaScript functionality

## Component Loading API

The component loading system is managed by the `component-loader.ts` module, which provides the following API:

### `loadComponents(): Promise<void>`

Loads all components based on their `data-component` attributes and the current language setting.

```typescript
import { loadComponents } from './modules/component-loader';

// Load all components
await loadComponents();
```

### Component Loading Process

1. Find all elements with a `data-component` attribute
2. Load the corresponding HTML file from the components directory
3. Inject the HTML into the placeholder element
4. Apply translations to the loaded component
5. Dispatch a `component:loaded` event

### Example Usage

```html
<!-- Component placeholder in index.html -->
<div data-component="header"></div>
```

```typescript
// Load the component
await loadComponents();
```

### Component Events

The component loader dispatches the following events:

- `component:loaded`: Dispatched when a single component is loaded
- `components:all-loaded`: Dispatched when all components are loaded

```typescript
// Listen for component loaded event
document.addEventListener('component:loaded', (event: CustomEvent<ComponentLoadedEventDetail>) => {
  const { name, element } = event.detail;
  console.log(`Component ${name} loaded:`, element);
});

// Listen for all components loaded event
document.addEventListener('components:all-loaded', () => {
  console.log('All components loaded');
});
```

## Language Management API

The language management system is handled by the `language-manager.ts` module, which provides the following API:

### `initLanguageSystem(): Promise<LanguageCode>`

Initializes the language system, detects the user's preferred language, and sets up event listeners for language switching.

```typescript
import { initLanguageSystem } from './modules/language-manager';

// Initialize the language system
const detectedLanguage = await initLanguageSystem();
console.log(`Language initialized: ${detectedLanguage}`);
```

### `getCurrentLanguage(): LanguageCode`

Returns the current language code ('en' or 'al').

```typescript
import { getCurrentLanguage } from './modules/language-manager';

// Get the current language
const currentLanguage = getCurrentLanguage();
console.log(`Current language: ${currentLanguage}`);
```

### `setLanguage(languageCode: LanguageCode): void`

Sets the current language and triggers a language change event.

```typescript
import { setLanguage } from './modules/language-manager';

// Set the language to Albanian
setLanguage('al');
```

### Language Events

The language manager dispatches the following event:

- `language:changed`: Dispatched when the language is changed

```typescript
// Listen for language changed event
document.addEventListener('language:changed', (event: CustomEvent<{language: LanguageCode}>) => {
  const newLanguage = event.detail.language;
  console.log(`Language changed to: ${newLanguage}`);
});
```

## Translation API

The translation system is managed by the `translation-service.ts` module, which provides the following API:

### `initTranslationSystem(): Promise<void>`

Initializes the translation system, loads translations for the current language, and sets up event listeners.

```typescript
import { initTranslationSystem } from './modules/translation-service';

// Initialize the translation system
await initTranslationSystem();
```

### `getTranslation(keyPath: string, language?: LanguageCode): Promise<string>`

Gets a translation value by key path.

```typescript
import { getTranslation } from './modules/translation-service';

// Get a translation
const translation = await getTranslation('about.title');
console.log(`Translation: ${translation}`);
```

### `translateElement(element: HTMLElement): Promise<void>`

Applies translations to an HTML element and its children.

```typescript
import { translateElement } from './modules/translation-service';

// Translate an element
const element = document.querySelector('.my-element');
await translateElement(element);
```

### `translatePage(): Promise<void>`

Translates all elements on the page with `data-i18n` attributes.

```typescript
import { translatePage } from './modules/translation-service';

// Translate the entire page
await translatePage();
```

### Translation Usage

Translations are applied to elements with `data-i18n` attributes:

```html
<!-- HTML with translation keys -->
<h1 data-i18n="about.title">About Velora Tech</h1>
<p data-i18n="about.paragraph1">Default text</p>
```

## Event System

The Velora Tech website uses a custom event system for communication between modules. The following custom events are defined:

### Language Events

- `language:changed`: Dispatched when the language is changed
  ```typescript
  interface LanguageChangedEvent extends CustomEvent {
    detail: {
      language: LanguageCode;
    };
  }
  ```

### Component Events

- `component:loaded`: Dispatched when a component is loaded
  ```typescript
  interface ComponentLoadedEvent extends CustomEvent {
    detail: {
      name: string;
      element: HTMLElement;
    };
  }
  ```

- `components:all-loaded`: Dispatched when all components are loaded

### Example Event Usage

```typescript
// Dispatch a custom event
document.dispatchEvent(new CustomEvent('language:changed', { 
  detail: { language: 'en' }
}));

// Listen for a custom event
document.addEventListener('language:changed', (event: CustomEvent<{language: LanguageCode}>) => {
  const newLanguage = event.detail.language;
  console.log(`Language changed to: ${newLanguage}`);
});
```

## Creating New Components

To create a new component:

1. Create a new HTML file in the `components/` directory:
   ```html
   <!-- components/new-component.html -->
   <div class="new-component">
     <h2 data-i18n="newComponent.title">New Component</h2>
     <p data-i18n="newComponent.description">Description</p>
   </div>
   ```

2. Add translations to the locale files:
   ```json
   // src/locales/en.json
   {
     "newComponent": {
       "title": "New Component",
       "description": "Description in English"
     }
   }
   
   // src/locales/al.json
   {
     "newComponent": {
       "title": "Komponenti i Ri",
       "description": "Përshkrimi në shqip"
     }
   }
   ```

3. Add the component placeholder to the HTML:
   ```html
   <div data-component="new-component"></div>
   ```

4. If needed, create a TypeScript module to handle the component's functionality:
   ```typescript
   // src/js/modules/new-component.ts
   export function initNewComponent(): void {
     // Implementation
   }
   ```

5. Import and initialize the module in `src/js/app.ts`:
   ```typescript
   import { initNewComponent } from './modules/new-component';
   
   // Initialize the module
   initNewComponent();
   ```

## Extending Existing Components

To extend an existing component:

1. Modify the component HTML file:
   ```html
   <!-- components/existing-component.html -->
   <div class="existing-component">
     <h2 data-i18n="existingComponent.title">Existing Component</h2>
     <p data-i18n="existingComponent.description">Description</p>
     
     <!-- New content -->
     <div class="new-section">
       <h3 data-i18n="existingComponent.newSection.title">New Section</h3>
       <p data-i18n="existingComponent.newSection.description">New section description</p>
     </div>
   </div>
   ```

2. Add new translations to the locale files:
   ```json
   // src/locales/en.json
   {
     "existingComponent": {
       "title": "Existing Component",
       "description": "Description",
       "newSection": {
         "title": "New Section",
         "description": "New section description in English"
       }
     }
   }
   
   // src/locales/al.json
   {
     "existingComponent": {
       "title": "Komponenti Ekzistues",
       "description": "Përshkrimi",
       "newSection": {
         "title": "Seksioni i Ri",
         "description": "Përshkrimi i seksionit të ri në shqip"
       }
     }
   }
   ```

3. If needed, extend the TypeScript module:
   ```typescript
   // src/js/modules/existing-module.ts
   export function initExistingModule(): void {
     // Existing implementation
     
     // New functionality
     document.querySelectorAll('.new-section').forEach(section => {
       // Implementation for new section
     });
   }
   ```

# Velora Tech Website Architecture

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Architecture Concepts](#core-architecture-concepts)
- [Module System](#module-system)
- [Component System](#component-system)
- [Internationalization (i18n)](#internationalization-i18n)
- [Build System](#build-system)
- [Design Patterns](#design-patterns)
- [Technical Decisions](#technical-decisions)

## Overview

The Velora Tech website is a modern, bilingual (English and Albanian) corporate website built using TypeScript. The architecture follows a modular design pattern with a component-based structure, allowing for easy maintenance, extension, and localization.

## Technology Stack

- **Languages**: TypeScript, HTML5, CSS3
- **Module Bundler**: Webpack
- **Package Manager**: npm
- **Type Checking**: TypeScript compiler
- **UI Framework**: Custom component system (no external UI framework)
- **Internationalization**: Custom i18n solution with JSON-based translations
- **Deployment**: GitHub Pages

## Project Structure

```
velora-tech.com/
├── components/            # HTML components
│   ├── pages/             # Page-specific components
│   ├── about.html         # Component templates
│   ├── contact.html
│   ├── ...
├── css/                   # CSS stylesheets
├── dist/                  # Compiled output
│   └── bundle.js          # Bundled JavaScript
├── src/                   # Source code
│   ├── js/                # TypeScript source
│   │   ├── modules/       # Core modules
│   │   ├── app.ts         # Application entry point
│   │   └── main.ts        # Main initialization
│   ├── locales/           # Translation files
│   │   ├── en.json        # English translations
│   │   └── al.json        # Albanian translations
│   └── types/             # TypeScript type definitions
├── index.html             # Main HTML entry point
├── tsconfig.json          # TypeScript configuration
└── webpack.config.js      # Webpack configuration
```

## Core Architecture Concepts

The Velora Tech website architecture is built around several core concepts:

1. **Module-based Architecture**: The codebase is organized into independent modules that handle specific functionality.
2. **Component System**: UI elements are defined as reusable HTML components that can be loaded dynamically.
3. **Language Management**: The website supports both English and Albanian languages with automatic detection and manual switching.
4. **Event-driven Communication**: Modules communicate through custom events to maintain loose coupling.
5. **Progressive Enhancement**: Core functionality works without JavaScript, with enhanced features added when JS is available.

## Module System

The website functionality is divided into the following core modules:

- **navigation.ts**: Handles the website navigation and menu functionality
- **cursor.ts**: Implements custom cursor effects
- **animations.ts**: Manages scroll-based animations and counters
- **projects.ts**: Handles project filtering and display
- **testimonials.ts**: Manages the testimonial slider
- **contact.ts**: Handles the contact form validation and submission
- **component-loader.ts**: Dynamically loads HTML components
- **language-manager.ts**: Manages language detection and switching
- **translation-service.ts**: Handles loading and applying translations

Each module is designed to be independent and focused on a specific concern, following the single responsibility principle. Modules are initialized in a specific order to ensure dependencies are satisfied.

### Example Module Pattern

```typescript
// Module initialization pattern
export function initModule(): void {
  // Module initialization code
  
  // Event listeners
  document.addEventListener('event', handleEvent);
  
  // Public methods and state
}

// Private functions
function privateFunction() {
  // Implementation
}

// Export public API
export { publicFunction, publicVariable };
```

## Component System

The website uses a component-based architecture for UI elements. Components are HTML fragments stored in the `components/` directory and loaded dynamically based on the current language setting.

Components are loaded using the `component-loader.ts` module, which:

1. Finds all elements with a `data-component` attribute
2. Loads the corresponding HTML file from the components directory
3. Injects the HTML into the placeholder element
4. Applies translations to the loaded component
5. Dispatches a `component:loaded` event

### Example Component Usage

```html
<!-- Component placeholder in index.html -->
<div data-component="header"></div>

<!-- Component content in components/header.html -->
<header class="site-header">
  <nav>
    <ul>
      <li><a href="#" data-i18n="header.nav.home">Home</a></li>
      <!-- More navigation items -->
    </ul>
  </nav>
</header>
```

## Internationalization (i18n)

The website implements a comprehensive internationalization system supporting English and Albanian languages. The i18n system consists of:

1. **Language Detection**: Automatically detects the user's preferred language based on:
   - Previously stored preference
   - IP geolocation (Albanian users get Albanian by default)
   - Browser language settings
   
2. **Language Switching**: Allows users to manually switch between languages via UI controls

3. **Translation System**: Loads translations from JSON files and applies them to elements with `data-i18n` attributes

4. **Component Localization**: Reloads components when language changes to ensure all content is properly translated

### Translation Flow

1. The `language-manager.ts` module detects and sets the initial language
2. The `translation-service.ts` module loads the appropriate translation file
3. Translations are applied to elements with `data-i18n` attributes
4. When language changes, a `language:changed` event is dispatched
5. Components are reloaded and translations are reapplied

### Example Translation Usage

```html
<!-- HTML with translation keys -->
<h1 data-i18n="about.title">About Velora Tech</h1>

<!-- Translation JSON (en.json) -->
{
  "about": {
    "title": "About Velora Tech"
  }
}

<!-- Translation JSON (al.json) -->
{
  "about": {
    "title": "Rreth Velora Tech"
  }
}
```

## Build System

The website uses Webpack for bundling and TypeScript for type checking:

1. **TypeScript Compilation**: TypeScript files are compiled to JavaScript using the TypeScript compiler
2. **Bundling**: Webpack bundles all JavaScript files into a single bundle
3. **Optimization**: Production builds are optimized for size and performance
4. **Source Maps**: Development builds include source maps for debugging

### Build Process

1. TypeScript compiles `.ts` files to JavaScript
2. Webpack bundles the compiled JavaScript into a single file
3. The bundled file is output to the `dist/` directory
4. The HTML file references the bundled JavaScript

## Design Patterns

The Velora Tech website implements several design patterns:

1. **Module Pattern**: Each feature is encapsulated in its own module with a clear public API
2. **Observer Pattern**: Custom events are used for communication between modules
3. **Factory Pattern**: Components are created dynamically based on configuration
4. **Singleton Pattern**: Core services like language management are implemented as singletons
5. **Lazy Loading**: Components and resources are loaded on demand

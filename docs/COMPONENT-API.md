# Velora Tech Module APIs and Integration Documentation

## Table of Contents
- [Introduction](#introduction)
- [Module APIs](#module-apis)
  - [Navigation Module](#navigation-module)
  - [Cursor Module](#cursor-module)
  - [Animations Module](#animations-module)
  - [Projects Module](#projects-module)
  - [Testimonials Module](#testimonials-module)
  - [Contact Module](#contact-module)
- [Integration Points](#integration-points)
- [TypeScript Interfaces](#typescript-interfaces)

## Introduction

This document provides detailed information about the module APIs and integration points of the Velora Tech website. It is designed to help developers understand how to use and extend the existing modules. For information about the component system, please refer to the [COMPONENT-SYSTEM.md](./COMPONENT-SYSTEM.md) document.

The Velora Tech website is built with several core TypeScript modules, each providing specific functionality that can be integrated and extended.

## Module APIs

The Velora Tech website is built with several core modules, each providing specific functionality.

### Navigation Module

The `navigation.ts` module handles the website navigation and menu functionality.

#### `initNavigation(): void`

Initializes the navigation module, setting up event listeners and mobile menu functionality.

```typescript
import { initNavigation } from './modules/navigation';

// Initialize navigation
initNavigation();
```

#### Navigation Features

- Mobile menu toggle
- Smooth scrolling to sections
- Active section highlighting
- Navigation state management

### Cursor Module

The `cursor.ts` module implements custom cursor effects.

#### `initCursorEffect(): void`

Initializes the custom cursor effect.

```typescript
import { initCursorEffect } from './modules/cursor';

// Initialize cursor effect
initCursorEffect();
```

#### Cursor Features

- Custom cursor following mouse movement
- Hover effects on interactive elements
- Cursor state management (default, hover, click)

### Animations Module

The `animations.ts` module manages scroll-based animations and counters.

#### `initScrollAnimation(): void`

Initializes scroll-based animations.

```typescript
import { initScrollAnimation } from './modules/animations';

// Initialize scroll animations
initScrollAnimation();
```

#### `initCounters(): void`

Initializes number counters.

```typescript
import { initCounters } from './modules/animations';

// Initialize counters
initCounters();
```

#### Animation Features

- Scroll-triggered animations
- Number counters with animation
- Intersection Observer-based triggers

### Projects Module

The `projects.ts` module handles project filtering and display.

#### `initProjectFilters(): void`

Initializes project filtering functionality.

```typescript
import { initProjectFilters } from './modules/projects';

// Initialize project filters
initProjectFilters();
```

#### Projects Features

- Category-based filtering
- Animation during filtering
- Project display and layout

### Testimonials Module

The `testimonials.ts` module manages the testimonial slider.

#### `initTestimonialSlider(): void`

Initializes the testimonial slider.

```typescript
import { initTestimonialSlider } from './modules/testimonials';

// Initialize testimonial slider
initTestimonialSlider();
```

#### Testimonials Features

- Testimonial carousel/slider
- Auto-play functionality
- Navigation controls
- Responsive behavior

### Contact Module

The `contact.ts` module handles the contact form validation and submission.

#### `initContactForm(): void`

Initializes the contact form functionality.

```typescript
import { initContactForm } from './modules/contact';

// Initialize contact form
initContactForm();
```

#### Contact Features

- Form validation
- Form submission
- Success/error handling
- Field formatting

## Integration Points

The Velora Tech website provides several integration points for extending functionality:

### 1. Component Integration

New components can be integrated by:
- Creating a new HTML file in the `components/` directory
- Adding a placeholder with a `data-component` attribute in the HTML
- The component will be automatically loaded by the component loader

### 2. Module Integration

New modules can be integrated by:
- Creating a new TypeScript file in `src/js/modules/`
- Importing and initializing the module in `src/js/app.ts`
- The module will be initialized when the page loads

### 3. Event Integration

Custom functionality can be integrated using the event system:
- Listen for events like `component:loaded` or `language:changed`
- Dispatch custom events for other modules to respond to

### 4. Translation Integration

New translations can be integrated by:
- Adding translation keys and values to the locale files
- Using `data-i18n` attributes in HTML elements
- The translations will be automatically applied

### 5. Module Extension Pattern

To extend an existing module:

```typescript
// Import the original module
import { initExistingModule } from './modules/existing-module';

// Create an extended version
export function initExtendedModule(): void {
  // Call the original initialization
  initExistingModule();
  
  // Add additional functionality
  document.querySelectorAll('.new-element').forEach(element => {
    // Additional implementation
  });
}
```

### 6. Application Lifecycle Hooks

The application provides several lifecycle hooks for integration:

- **DOMContentLoaded**: Initial application setup
- **components:all-loaded**: All components have been loaded
- **language:changed**: Language has been changed

Example usage:

```typescript
// Hook into application lifecycle
document.addEventListener('components:all-loaded', () => {
  // Initialize your custom functionality after all components are loaded
  initCustomFeature();
});
```

## TypeScript Interfaces

The Velora Tech website defines several TypeScript interfaces for type safety:

### Language Interfaces

```typescript
// Language code type
export type LanguageCode = 'en' | 'al';

// Language data interface
export interface LanguageData {
  [key: string]: string;
}

// Location data from IP geolocation
export interface LocationData {
  country_code: string;
  country_name: string;
  city: string;
  region: string;
  [key: string]: any;
}
```

### Component Interfaces

```typescript
// Component data interface
export interface ComponentData {
  id: string;
  path: string;
  isLanguageSpecific: boolean;
}

// Component loaded event detail
export interface ComponentLoadedEventDetail {
  name: string;
  element: HTMLElement;
}
```

### Content Interfaces

```typescript
// Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
}

// Testimonial interface
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  image?: string;
}

// Contact form data interface
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

### Animation Interfaces

```typescript
// Animation options interface
export interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}
```

### Event Interfaces

```typescript
// Language change event interface
export interface LanguageChangeEvent extends CustomEvent {
  detail: {
    language: LanguageCode;
  };
}

// Global event declarations
declare global {
  interface WindowEventMap {
    'language:changed': CustomEvent<{ language: LanguageCode }>;
    'component:loaded': CustomEvent<ComponentLoadedEventDetail>;
    'components:all-loaded': CustomEvent;
  }
}

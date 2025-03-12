/**
 * Type definitions for Velora Tech website
 */

// Language related types
export type LanguageCode = 'en' | 'al';

export interface LanguageData {
  [key: string]: string;
}

// Component related types
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

// Location data from IP geolocation
export interface LocationData {
  country_code: string;
  country_name: string;
  city: string;
  region: string;
  [key: string]: any;
}

// Project related types
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
}

// Testimonial related types
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  image?: string;
}

// Contact form related types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Animation related types
export interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

// Custom event types
export interface LanguageChangeEvent extends CustomEvent {
  detail: {
    language: LanguageCode;
  };
}

// Declare global namespace for custom events
declare global {
  interface WindowEventMap {
    'language:changed': CustomEvent<{ language: LanguageCode }>;
    'component:loaded': CustomEvent<ComponentLoadedEventDetail>;
    'components:all-loaded': CustomEvent;
  }
}

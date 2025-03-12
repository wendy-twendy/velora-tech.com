/**
 * Type declarations for Velora Tech website modules
 */

declare module './modules/navigation' {
  export function initNavigation(): void;
}

declare module './modules/cursor' {
  export function initCursorEffect(): void;
}

declare module './modules/animations' {
  export function initScrollAnimation(): void;
  export function initCounters(): void;
}

declare module './modules/projects' {
  export function initProjectFilters(): void;
}

declare module './modules/testimonials' {
  export function initTestimonialSlider(): void;
}

declare module './modules/contact' {
  export function initContactForm(): void;
}

declare module './modules/component-loader' {
  export function loadComponents(): Promise<void>;
}

declare module './modules/language-manager' {
  export function initLanguageSystem(): Promise<void>;
}

declare module './test-runner' {
  // No exports needed
}

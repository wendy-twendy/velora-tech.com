/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/animations.ts":
/*!**************************************!*\
  !*** ./src/js/modules/animations.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initCounters: () => (/* binding */ initCounters),
/* harmony export */   initScrollAnimation: () => (/* binding */ initScrollAnimation)
/* harmony export */ });
/**
 * Animations Module
 * Handles scroll animations and other visual effects
 */
/**
 * Initialize scroll animations
 * @param options Optional animation configuration options
 */
function initScrollAnimation(options) {
    const defaultOptions = {
        threshold: 0.2,
        rootMargin: '0px',
        once: true
    };
    const config = { ...defaultOptions, ...options };
    // Add noise overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    // Initial check for elements in viewport
    checkElementsInViewport();
    // Check elements on scroll
    window.addEventListener('scroll', checkElementsInViewport);
    function checkElementsInViewport() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
            else {
                // Only remove the class if the element should animate every time
                if (!config.once && element.classList.contains('animate-always')) {
                    element.classList.remove('active');
                }
            }
        });
    }
    // Parallax effect for background elements
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}
/**
 * Initialize counter animations for statistics
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200; // Lower is faster
    const startCounters = () => {
        counters.forEach(counter => {
            const target = +(counter.getAttribute('data-target') || '0');
            const count = +(counter.textContent || '0');
            const increment = target / counterSpeed;
            if (count < target) {
                counter.textContent = Math.ceil(count + increment).toString();
                setTimeout(() => startCounters(), 1);
            }
            else {
                counter.textContent = target.toString();
            }
        });
    };
    // Start counters when they come into view
    const counterSection = document.querySelector('.stats-container');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(counterSection);
            }
        }, { threshold: 0.5 });
        observer.observe(counterSection);
    }
}


/***/ }),

/***/ "./src/js/modules/component-loader.ts":
/*!********************************************!*\
  !*** ./src/js/modules/component-loader.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadComponents: () => (/* binding */ loadComponents)
/* harmony export */ });
/* harmony import */ var _language_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./language-manager */ "./src/js/modules/language-manager.ts");
/**
 * Component Loader Module
 * Handles loading HTML components dynamically with language support
 */

/**
 * Load all components based on their data-component attribute
 * and current language setting
 */
async function loadComponents() {
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    const currentLanguage = (0,_language_manager__WEBPACK_IMPORTED_MODULE_0__.getCurrentLanguage)();
    for (const placeholder of componentPlaceholders) {
        const componentName = placeholder.getAttribute('data-component');
        if (!componentName) {
            console.error('Component placeholder missing data-component attribute');
            continue;
        }
        // Skip reloading the hero component which contains the Spline scene
        // to prevent reinitialization during language changes
        const isHeroComponent = componentName === 'hero';
        const hasSplineElement = placeholder.querySelector('#spline-container');
        // If this is the hero component with a loaded Spline scene, only update the text content
        if (isHeroComponent && hasSplineElement && document.querySelector('.spline-canvas canvas')) {
            try {
                // Get the language-specific hero component
                const response = await fetch(`components/lang/${currentLanguage}/${componentName}.html`);
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
                const html = await response.text();
                // Create a temporary element to parse the HTML
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;
                // Only update text content, not the Spline container
                updateTextContentOnly(placeholder, tempElement);
                // Dispatch event when component is updated
                const event = new CustomEvent('component:loaded', {
                    detail: {
                        name: componentName,
                        element: placeholder
                    }
                });
                document.dispatchEvent(event);
                continue; // Skip the normal component loading for hero
            }
            catch (error) {
                console.error(`Error updating hero component text: ${error}`);
                // Continue with normal loading as fallback
            }
        }
        try {
            // First try to load language-specific component
            let response = await fetch(`components/lang/${currentLanguage}/${componentName}.html`);
            // If language-specific component doesn't exist, fall back to default
            if (!response.ok) {
                response = await fetch(`components/${componentName}.html`);
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
            }
            const html = await response.text();
            placeholder.innerHTML = html;
            // Dispatch event when component is loaded
            const event = new CustomEvent('component:loaded', {
                detail: {
                    name: componentName,
                    element: placeholder
                }
            });
            document.dispatchEvent(event);
        }
        catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            placeholder.innerHTML = `<div class="error-message">Failed to load ${componentName} component</div>`;
        }
    }
    // Dispatch event when all components are loaded
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
}
/**
 * Update only the text content of a component without replacing the Spline scene
 * @param targetElement - The element to update
 * @param sourceElement - The element containing the new content
 */
function updateTextContentOnly(targetElement, sourceElement) {
    // Update the hero heading text
    const targetHeading = targetElement.querySelector('.hero-content h1');
    const sourceHeading = sourceElement.querySelector('.hero-content h1');
    if (targetHeading && sourceHeading) {
        targetHeading.textContent = sourceHeading.textContent;
        targetHeading.setAttribute('data-text', sourceHeading.getAttribute('data-text') || '');
    }
    // Update the hero paragraph text
    const targetParagraph = targetElement.querySelector('.hero-content p');
    const sourceParagraph = sourceElement.querySelector('.hero-content p');
    if (targetParagraph && sourceParagraph) {
        targetParagraph.textContent = sourceParagraph.textContent;
    }
    // Update the hero button texts
    const targetButtons = targetElement.querySelectorAll('.cta-buttons a');
    const sourceButtons = sourceElement.querySelectorAll('.cta-buttons a');
    if (targetButtons.length === sourceButtons.length) {
        for (let i = 0; i < targetButtons.length; i++) {
            targetButtons[i].textContent = sourceButtons[i].textContent;
        }
    }
    // Update the loading text in the Spline container
    const targetLoadingText = targetElement.querySelector('.spline-loading p');
    const sourceLoadingText = sourceElement.querySelector('.spline-loading p');
    if (targetLoadingText && sourceLoadingText) {
        targetLoadingText.textContent = sourceLoadingText.textContent;
    }
    // Update error text
    const targetErrorHeading = targetElement.querySelector('.spline-error h3');
    const sourceErrorHeading = sourceElement.querySelector('.spline-error h3');
    if (targetErrorHeading && sourceErrorHeading) {
        targetErrorHeading.textContent = sourceErrorHeading.textContent;
    }
    const targetErrorText = targetElement.querySelector('.spline-error p');
    const sourceErrorText = sourceElement.querySelector('.spline-error p');
    if (targetErrorText && sourceErrorText) {
        targetErrorText.textContent = sourceErrorText.textContent;
    }
    // Update scroll text
    const targetScrollText = targetElement.querySelector('.scroll-text');
    const sourceScrollText = sourceElement.querySelector('.scroll-text');
    if (targetScrollText && sourceScrollText) {
        targetScrollText.textContent = sourceScrollText.textContent;
    }
}
// Reload components when language changes
document.addEventListener('language:changed', async () => {
    await loadComponents();
});


/***/ }),

/***/ "./src/js/modules/contact.ts":
/*!***********************************!*\
  !*** ./src/js/modules/contact.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initContactForm: () => (/* binding */ initContactForm)
/* harmony export */ });
/**
 * Contact Module
 * Handles contact form validation and submission
 */
/**
 * Initialize contact form
 * Sets up form validation, submission handling, and UI interactions
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm)
        return;
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    let formSubmitAttempted = false;
    // Add floating label effect
    formInputs.forEach(input => {
        // Set initial state for inputs with values
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        // Handle input changes
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            else {
                input.classList.remove('has-value');
            }
            // Only validate if form submission has been attempted
            if (formSubmitAttempted) {
                validateInput(input);
            }
        });
        // Handle focus
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });
        // Handle blur
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('focused');
            // Only validate on blur if form submission has been attempted
            if (formSubmitAttempted) {
                validateInput(input);
            }
        });
    });
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Set flag to indicate form submission has been attempted
        formSubmitAttempted = true;
        let isValid = true;
        // Validate all inputs
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn)
                return;
            const originalText = submitBtn.textContent || '';
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                formInputs.forEach(input => {
                    input.classList.remove('has-value');
                    input.parentElement?.classList.remove('error');
                });
                // Reset form submission flag
                formSubmitAttempted = false;
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Your message has been sent successfully!';
                contactForm.appendChild(successMessage);
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 2000);
        }
    });
    /**
     * Validate a form input element
     * @param input - The input element to validate
     * @returns boolean indicating if the input is valid
     */
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        // Remove previous error message
        const errorElement = input.parentElement?.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        // Check if required field is empty
        if (input.hasAttribute('required') && value === '') {
            showError(input, 'This field is required');
            isValid = false;
        }
        else if (value !== '') {
            // Validate email format
            if (type === 'email' && !isValidEmail(value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
            // Validate phone format if needed
            if (name === 'phone' && !isValidPhone(value)) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
        // Add or remove error class
        if (isValid) {
            input.parentElement?.classList.remove('error');
        }
        else {
            input.parentElement?.classList.add('error');
        }
        return isValid;
    }
    /**
     * Show error message for an input
     * @param input - The input element with an error
     * @param message - The error message to display
     */
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        input.parentElement?.appendChild(errorElement);
    }
    /**
     * Validate email format
     * @param email - The email to validate
     * @returns boolean indicating if the email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Validate phone number format
     * @param phone - The phone number to validate
     * @returns boolean indicating if the phone number is valid
     */
    function isValidPhone(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }
}


/***/ }),

/***/ "./src/js/modules/cursor.ts":
/*!**********************************!*\
  !*** ./src/js/modules/cursor.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initCursorEffect: () => (/* binding */ initCursorEffect)
/* harmony export */ });
/**
 * Cursor Module
 * Handles custom cursor effects and interactions
 */
/**
 * Initialize custom cursor effects
 */
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);
    let cursorVisible = false;
    let cursorEnlarged = false;
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    // Mouse leave
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    // Link hover effect
    const links = document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn');
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(0, 195, 255, 0.5) 0%, rgba(110, 0, 255, 0.3) 70%, transparent 100%)';
            cursorEnlarged = true;
        });
        link.addEventListener('mouseout', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(110, 0, 255, 0.5) 0%, rgba(0, 195, 255, 0.3) 70%, transparent 100%)';
            cursorEnlarged = false;
        });
    });
}


/***/ }),

/***/ "./src/js/modules/language-manager.ts":
/*!********************************************!*\
  !*** ./src/js/modules/language-manager.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Languages: () => (/* binding */ Languages),
/* harmony export */   getCurrentLanguage: () => (/* binding */ getCurrentLanguage),
/* harmony export */   initLanguageSystem: () => (/* binding */ initLanguageSystem),
/* harmony export */   setLanguage: () => (/* binding */ setLanguage)
/* harmony export */ });
/**
 * Language Manager Module
 * Handles language detection, switching, and storage
 */
// Available languages
var Languages;
(function (Languages) {
    Languages["EN"] = "en";
    Languages["AL"] = "al";
})(Languages || (Languages = {}));
// Default language
const DEFAULT_LANGUAGE = Languages.EN;
// Language storage key
const LANGUAGE_STORAGE_KEY = 'velora_preferred_language';
/**
 * Detect user's language based on browser settings and location
 * @returns {Promise<LanguageCode>} The detected language code
 */
async function detectUserLanguage() {
    // First check if user has a stored preference
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && Object.values(Languages).includes(storedLanguage)) {
        return storedLanguage;
    }
    try {
        // Try to detect location using IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        // If user is in Albania, set Albanian as default
        if (data.country_code === 'AL') {
            return Languages.AL;
        }
    }
    catch (error) {
        console.error('Error detecting user location:', error);
        // Fall back to browser language if geolocation fails
    }
    // Check browser language as fallback
    const browserLang = navigator.language || navigator.userLanguage;
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
function setLanguage(languageCode) {
    if (!Object.values(Languages).includes(languageCode)) {
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
function getCurrentLanguage() {
    return (localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE);
}
/**
 * Update the language switcher UI to reflect current language
 * @param {LanguageCode} languageCode - The current language code
 */
function updateLanguageSwitcherUI(languageCode) {
    const switchers = document.querySelectorAll('.language-switcher');
    switchers.forEach(switcher => {
        const buttons = switcher.querySelectorAll('button');
        buttons.forEach(button => {
            const buttonLang = button.getAttribute('data-language');
            if (buttonLang === languageCode) {
                button.classList.add('active');
            }
            else {
                button.classList.remove('active');
            }
        });
    });
}
/**
 * Initialize the language system
 */
async function initLanguageSystem() {
    // Detect user's language
    const detectedLanguage = await detectUserLanguage();
    // Set initial language
    setLanguage(detectedLanguage);
    // Add event listeners for language switcher buttons
    document.addEventListener('click', (event) => {
        const target = event.target;
        const langButton = target.closest('[data-language]');
        if (langButton) {
            const newLanguage = langButton.getAttribute('data-language');
            setLanguage(newLanguage);
        }
    });
    return detectedLanguage;
}
// Export public API



/***/ }),

/***/ "./src/js/modules/navigation.ts":
/*!**************************************!*\
  !*** ./src/js/modules/navigation.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initNavigation: () => (/* binding */ initNavigation)
/* harmony export */ });
/**
 * Navigation Module
 * Handles navigation functionality including mobile menu toggle and smooth scrolling
 */
/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
            const targetId = link.getAttribute('href');
            if (targetId) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    // Add active class to nav links based on scroll position
    window.addEventListener('scroll', highlightNavOnScroll);
}
/**
 * Highlight navigation links based on scroll position
 */
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            if (sectionId) {
                currentSection = sectionId;
            }
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}


/***/ }),

/***/ "./src/js/modules/projects.ts":
/*!************************************!*\
  !*** ./src/js/modules/projects.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initProjectFilters: () => (/* binding */ initProjectFilters)
/* harmony export */ });
/**
 * Projects Module
 * Handles project filtering and interactions
 */
/**
 * Initialize project filters
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    // Initialize with "All" filter active
    filterProjects('all');
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            // Filter projects
            if (filterValue) {
                filterProjects(filterValue);
            }
        });
    });
    function filterProjects(category) {
        projectCards.forEach(card => {
            const projectCategory = card.getAttribute('data-category');
            const cardElement = card;
            // Hide all projects first
            cardElement.style.display = 'none';
            // Show projects based on filter
            if (category === 'all' || projectCategory === category) {
                cardElement.style.display = 'block';
                // Add animation
                setTimeout(() => {
                    cardElement.style.opacity = '1';
                    cardElement.style.transform = 'translateY(0)';
                }, 100);
            }
            else {
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'translateY(20px)';
            }
        });
    }
    // Add hover effect to project cards
    projectCards.forEach(card => {
        const cardElement = card;
        const overlay = cardElement.querySelector('.project-overlay');
        const projectInfo = cardElement.querySelector('.project-info');
        if (overlay && projectInfo) {
            cardElement.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                projectInfo.style.transform = 'translateY(0)';
            });
            cardElement.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                projectInfo.style.transform = 'translateY(20px)';
            });
        }
    });
}


/***/ }),

/***/ "./src/js/modules/testimonials.ts":
/*!****************************************!*\
  !*** ./src/js/modules/testimonials.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initTestimonialSlider: () => (/* binding */ initTestimonialSlider)
/* harmony export */ });
/**
 * Testimonials Module
 * Handles testimonial slider functionality
 */
/**
 * Initialize testimonial slider
 * Sets up the testimonial slider with navigation, auto-sliding, and event listeners
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!slides.length)
        return;
    let currentSlide = 0;
    const slideCount = slides.length;
    // Initialize slider
    showSlide(currentSlide);
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            showSlide(currentSlide);
        });
    }
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        });
    }
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    // Auto slide (optional)
    let slideInterval = window.setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }, 5000);
    // Pause auto slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = window.setInterval(() => {
                currentSlide = (currentSlide + 1) % slideCount;
                showSlide(currentSlide);
            }, 5000);
        });
    }
    /**
     * Show a specific slide by index
     * @param index - The index of the slide to show
     */
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        // Show current slide
        slides[index].classList.add('active');
        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
}
// Listen for language change events to reinitialize the testimonial slider
document.addEventListener('language:changed', () => {
    // Wait for components to be reloaded before initializing the slider
    document.addEventListener('components:all-loaded', () => {
        initTestimonialSlider();
    }, { once: true });
});
// Also listen for individual component loads
document.addEventListener('component:loaded', (event) => {
    const customEvent = event;
    // Check if the loaded component is the testimonials component
    if (customEvent.detail.name === 'testimonials') {
        initTestimonialSlider();
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "velora-tech-website:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkvelora_tech_website"] = self["webpackChunkvelora_tech_website"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/app.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/navigation */ "./src/js/modules/navigation.ts");
/* harmony import */ var _modules_cursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/cursor */ "./src/js/modules/cursor.ts");
/* harmony import */ var _modules_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/animations */ "./src/js/modules/animations.ts");
/* harmony import */ var _modules_projects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/projects */ "./src/js/modules/projects.ts");
/* harmony import */ var _modules_testimonials__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/testimonials */ "./src/js/modules/testimonials.ts");
/* harmony import */ var _modules_contact__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/contact */ "./src/js/modules/contact.ts");
/* harmony import */ var _modules_component_loader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/component-loader */ "./src/js/modules/component-loader.ts");
/* harmony import */ var _modules_language_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/language-manager */ "./src/js/modules/language-manager.ts");
/**
 * Main Application Entry Point
 * Imports and initializes all modules
 */
// Import modules








// Check if we're in development mode
const isDevelopment = "development" === 'development';
// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Add noise overlay
    const noiseOverlay = document.createElement('div');
    noiseOverlay.classList.add('noise-overlay');
    document.body.appendChild(noiseOverlay);
    // Initialize language system first
    await (0,_modules_language_manager__WEBPACK_IMPORTED_MODULE_7__.initLanguageSystem)();
    // Load components after language is set
    await (0,_modules_component_loader__WEBPACK_IMPORTED_MODULE_6__.loadComponents)();
    // Initialize modules after components are loaded
    (0,_modules_navigation__WEBPACK_IMPORTED_MODULE_0__.initNavigation)();
    (0,_modules_cursor__WEBPACK_IMPORTED_MODULE_1__.initCursorEffect)();
    (0,_modules_animations__WEBPACK_IMPORTED_MODULE_2__.initScrollAnimation)();
    (0,_modules_animations__WEBPACK_IMPORTED_MODULE_2__.initCounters)();
    (0,_modules_projects__WEBPACK_IMPORTED_MODULE_3__.initProjectFilters)();
    (0,_modules_testimonials__WEBPACK_IMPORTED_MODULE_4__.initTestimonialSlider)();
    (0,_modules_contact__WEBPACK_IMPORTED_MODULE_5__.initContactForm)();
    // Dispatch event that all components are loaded and initialized
    document.dispatchEvent(new CustomEvent('components:all-loaded'));
    // Lazy load and initialize the Spline viewer only when needed
    const splineContainer = document.getElementById('spline-canvas-container');
    if (splineContainer) {
        // Show loading indicator immediately
        const loadingElement = document.querySelector('.spline-loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.classList.add('visible');
        }
        // Lazy load the Spline viewer module
        Promise.all(/*! import() | spline-module */[__webpack_require__.e("spline-vendor"), __webpack_require__.e("spline-module")]).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/spline-viewer */ "./src/js/modules/spline-viewer.ts"))
            .then(module => {
            // Initialize the Spline viewer
            module.initSplineViewer();
        })
            .catch(err => {
            console.error('Failed to load Spline viewer module:', err);
            // Hide loading indicator on error
            if (loadingElement) {
                loadingElement.style.display = 'none';
                loadingElement.classList.remove('visible');
            }
            // Show error message
            const errorElement = document.querySelector('.spline-error');
            if (errorElement) {
                errorElement.style.display = 'flex';
            }
        });
    }
    // Run tests in development mode
    if (isDevelopment) {
        __webpack_require__.e(/*! import() */ "src_js_test-runner_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./test-runner */ "./src/js/test-runner.ts")).then(() => {
            console.log('Test runner loaded');
        }).catch(err => {
            console.error('Failed to load test runner:', err);
        });
    }
    console.log('Velora Tech application initialized');
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3JCLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFnQixDQUFDO1lBQzVFLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQ2YsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3hDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNoQixrS0FBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUN2RCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy9hbmltYXRpb25zLnRzIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy9jb21wb25lbnQtbG9hZGVyLnRzIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy9jb250YWN0LnRzIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy9jdXJzb3IudHMiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS8uL3NyYy9qcy9tb2R1bGVzL2xhbmd1YWdlLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS8uL3NyYy9qcy9tb2R1bGVzL25hdmlnYXRpb24udHMiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS8uL3NyYy9qcy9tb2R1bGVzL3Byb2plY3RzLnRzIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy90ZXN0aW1vbmlhbHMudHMiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92ZWxvcmEtdGVjaC13ZWJzaXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92ZWxvcmEtdGVjaC13ZWJzaXRlL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvd2VicGFjay9ydW50aW1lL2xvYWQgc2NyaXB0Iiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92ZWxvcmEtdGVjaC13ZWJzaXRlL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS8uL3NyYy9qcy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmltYXRpb25zIE1vZHVsZVxuICogSGFuZGxlcyBzY3JvbGwgYW5pbWF0aW9ucyBhbmQgb3RoZXIgdmlzdWFsIGVmZmVjdHNcbiAqL1xuXG5pbXBvcnQgeyBBbmltYXRpb25PcHRpb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXgnO1xuXG4vKipcbiAqIEluaXRpYWxpemUgc2Nyb2xsIGFuaW1hdGlvbnNcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIGFuaW1hdGlvbiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRTY3JvbGxBbmltYXRpb24ob3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgdGhyZXNob2xkOiAwLjIsXG4gICAgICAgIHJvb3RNYXJnaW46ICcwcHgnLFxuICAgICAgICBvbmNlOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjb25zdCBjb25maWc6IEFuaW1hdGlvbk9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgXG4gICAgLy8gQWRkIG5vaXNlIG92ZXJsYXlcbiAgICBjb25zdCBub2lzZU92ZXJsYXk6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9pc2VPdmVybGF5LmNsYXNzTGlzdC5hZGQoJ25vaXNlLW92ZXJsYXknKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vaXNlT3ZlcmxheSk7XG4gICAgXG4gICAgLy8gRWxlbWVudHMgdG8gYW5pbWF0ZSBvbiBzY3JvbGxcbiAgICBjb25zdCBhbmltYXRlZEVsZW1lbnRzOiBOb2RlTGlzdE9mPEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZhZGUtaW4sIC5zbGlkZS1pbiwgLnNjYWxlLWluJyk7XG4gICAgXG4gICAgLy8gSW5pdGlhbCBjaGVjayBmb3IgZWxlbWVudHMgaW4gdmlld3BvcnRcbiAgICBjaGVja0VsZW1lbnRzSW5WaWV3cG9ydCgpO1xuICAgIFxuICAgIC8vIENoZWNrIGVsZW1lbnRzIG9uIHNjcm9sbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBjaGVja0VsZW1lbnRzSW5WaWV3cG9ydCk7XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tFbGVtZW50c0luVmlld3BvcnQoKTogdm9pZCB7XG4gICAgICAgIGFuaW1hdGVkRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRUb3A6IG51bWJlciA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudFZpc2libGU6IG51bWJlciA9IDE1MDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGVsZW1lbnRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBlbGVtZW50VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBjbGFzcyBpZiB0aGUgZWxlbWVudCBzaG91bGQgYW5pbWF0ZSBldmVyeSB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKCFjb25maWcub25jZSAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYW5pbWF0ZS1hbHdheXMnKSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIFBhcmFsbGF4IGVmZmVjdCBmb3IgYmFja2dyb3VuZCBlbGVtZW50c1xuICAgIGNvbnN0IHBhcmFsbGF4RWxlbWVudHM6IE5vZGVMaXN0T2Y8RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFyYWxsYXgnKTtcbiAgICBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzY3JvbGxQb3NpdGlvbjogbnVtYmVyID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBcbiAgICAgICAgcGFyYWxsYXhFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3BlZWQ6IG51bWJlciA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3BlZWQnKSB8fCAnMC41Jyk7XG4gICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHtzY3JvbGxQb3NpdGlvbiAqIHNwZWVkfXB4KWA7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgY291bnRlciBhbmltYXRpb25zIGZvciBzdGF0aXN0aWNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0Q291bnRlcnMoKTogdm9pZCB7XG4gICAgY29uc3QgY291bnRlcnM6IE5vZGVMaXN0T2Y8RWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY291bnRlcicpO1xuICAgIGNvbnN0IGNvdW50ZXJTcGVlZDogbnVtYmVyID0gMjAwOyAvLyBMb3dlciBpcyBmYXN0ZXJcbiAgICBcbiAgICBjb25zdCBzdGFydENvdW50ZXJzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb3VudGVycy5mb3JFYWNoKGNvdW50ZXIgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0OiBudW1iZXIgPSArKGNvdW50ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpIHx8ICcwJyk7XG4gICAgICAgICAgICBjb25zdCBjb3VudDogbnVtYmVyID0gKyhjb3VudGVyLnRleHRDb250ZW50IHx8ICcwJyk7XG4gICAgICAgICAgICBjb25zdCBpbmNyZW1lbnQ6IG51bWJlciA9IHRhcmdldCAvIGNvdW50ZXJTcGVlZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNvdW50IDwgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY291bnRlci50ZXh0Q29udGVudCA9IE1hdGguY2VpbChjb3VudCArIGluY3JlbWVudCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHN0YXJ0Q291bnRlcnMoKSwgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvdW50ZXIudGV4dENvbnRlbnQgPSB0YXJnZXQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICAvLyBTdGFydCBjb3VudGVycyB3aGVuIHRoZXkgY29tZSBpbnRvIHZpZXdcbiAgICBjb25zdCBjb3VudGVyU2VjdGlvbjogRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhdHMtY29udGFpbmVyJyk7XG4gICAgXG4gICAgaWYgKGNvdW50ZXJTZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgaWYgKGVudHJpZXNbMF0uaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICBzdGFydENvdW50ZXJzKCk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGNvdW50ZXJTZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgeyB0aHJlc2hvbGQ6IDAuNSB9KTtcbiAgICAgICAgXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoY291bnRlclNlY3Rpb24pO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ29tcG9uZW50IExvYWRlciBNb2R1bGVcbiAqIEhhbmRsZXMgbG9hZGluZyBIVE1MIGNvbXBvbmVudHMgZHluYW1pY2FsbHkgd2l0aCBsYW5ndWFnZSBzdXBwb3J0XG4gKi9cblxuaW1wb3J0IHsgTGFuZ3VhZ2VDb2RlLCBDb21wb25lbnRMb2FkZWRFdmVudERldGFpbCB9IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4JztcbmltcG9ydCB7IGdldEN1cnJlbnRMYW5ndWFnZSwgTGFuZ3VhZ2VzIH0gZnJvbSAnLi9sYW5ndWFnZS1tYW5hZ2VyJztcblxuLyoqXG4gKiBMb2FkIGFsbCBjb21wb25lbnRzIGJhc2VkIG9uIHRoZWlyIGRhdGEtY29tcG9uZW50IGF0dHJpYnV0ZVxuICogYW5kIGN1cnJlbnQgbGFuZ3VhZ2Ugc2V0dGluZ1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY29tcG9uZW50UGxhY2Vob2xkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuICAgIGNvbnN0IGN1cnJlbnRMYW5ndWFnZSA9IGdldEN1cnJlbnRMYW5ndWFnZSgpO1xuICAgIFxuICAgIGZvciAoY29uc3QgcGxhY2Vob2xkZXIgb2YgY29tcG9uZW50UGxhY2Vob2xkZXJzKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBwbGFjZWhvbGRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29tcG9uZW50Jyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbXBvbmVudCBwbGFjZWhvbGRlciBtaXNzaW5nIGRhdGEtY29tcG9uZW50IGF0dHJpYnV0ZScpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFNraXAgcmVsb2FkaW5nIHRoZSBoZXJvIGNvbXBvbmVudCB3aGljaCBjb250YWlucyB0aGUgU3BsaW5lIHNjZW5lXG4gICAgICAgIC8vIHRvIHByZXZlbnQgcmVpbml0aWFsaXphdGlvbiBkdXJpbmcgbGFuZ3VhZ2UgY2hhbmdlc1xuICAgICAgICBjb25zdCBpc0hlcm9Db21wb25lbnQgPSBjb21wb25lbnROYW1lID09PSAnaGVybyc7XG4gICAgICAgIGNvbnN0IGhhc1NwbGluZUVsZW1lbnQgPSBwbGFjZWhvbGRlci5xdWVyeVNlbGVjdG9yKCcjc3BsaW5lLWNvbnRhaW5lcicpO1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgaGVybyBjb21wb25lbnQgd2l0aCBhIGxvYWRlZCBTcGxpbmUgc2NlbmUsIG9ubHkgdXBkYXRlIHRoZSB0ZXh0IGNvbnRlbnRcbiAgICAgICAgaWYgKGlzSGVyb0NvbXBvbmVudCAmJiBoYXNTcGxpbmVFbGVtZW50ICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtY2FudmFzIGNhbnZhcycpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgbGFuZ3VhZ2Utc3BlY2lmaWMgaGVybyBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBjb21wb25lbnRzL2xhbmcvJHtjdXJyZW50TGFuZ3VhZ2V9LyR7Y29tcG9uZW50TmFtZX0uaHRtbGApO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBjb21wb25lbnQ6ICR7Y29tcG9uZW50TmFtZX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSB0ZW1wb3JhcnkgZWxlbWVudCB0byBwYXJzZSB0aGUgSFRNTFxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgdGVtcEVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHVwZGF0ZSB0ZXh0IGNvbnRlbnQsIG5vdCB0aGUgU3BsaW5lIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIHVwZGF0ZVRleHRDb250ZW50T25seShwbGFjZWhvbGRlciBhcyBIVE1MRWxlbWVudCwgdGVtcEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERpc3BhdGNoIGV2ZW50IHdoZW4gY29tcG9uZW50IGlzIHVwZGF0ZWRcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudDxDb21wb25lbnRMb2FkZWRFdmVudERldGFpbD4oJ2NvbXBvbmVudDpsb2FkZWQnLCB7IFxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wb25lbnROYW1lLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IHBsYWNlaG9sZGVyIGFzIEhUTUxFbGVtZW50IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIFNraXAgdGhlIG5vcm1hbCBjb21wb25lbnQgbG9hZGluZyBmb3IgaGVyb1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB1cGRhdGluZyBoZXJvIGNvbXBvbmVudCB0ZXh0OiAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggbm9ybWFsIGxvYWRpbmcgYXMgZmFsbGJhY2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEZpcnN0IHRyeSB0byBsb2FkIGxhbmd1YWdlLXNwZWNpZmljIGNvbXBvbmVudFxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGNvbXBvbmVudHMvbGFuZy8ke2N1cnJlbnRMYW5ndWFnZX0vJHtjb21wb25lbnROYW1lfS5odG1sYCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIElmIGxhbmd1YWdlLXNwZWNpZmljIGNvbXBvbmVudCBkb2Vzbid0IGV4aXN0LCBmYWxsIGJhY2sgdG8gZGVmYXVsdFxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGNvbXBvbmVudHMvJHtjb21wb25lbnROYW1lfS5odG1sYCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIGNvbXBvbmVudDogJHtjb21wb25lbnROYW1lfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIERpc3BhdGNoIGV2ZW50IHdoZW4gY29tcG9uZW50IGlzIGxvYWRlZFxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQ8Q29tcG9uZW50TG9hZGVkRXZlbnREZXRhaWw+KCdjb21wb25lbnQ6bG9hZGVkJywgeyBcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHsgXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBvbmVudE5hbWUsIFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBwbGFjZWhvbGRlciBhcyBIVE1MRWxlbWVudCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nIGNvbXBvbmVudCAke2NvbXBvbmVudE5hbWV9OmAsIGVycm9yKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPkZhaWxlZCB0byBsb2FkICR7Y29tcG9uZW50TmFtZX0gY29tcG9uZW50PC9kaXY+YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBEaXNwYXRjaCBldmVudCB3aGVuIGFsbCBjb21wb25lbnRzIGFyZSBsb2FkZWRcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY29tcG9uZW50czphbGwtbG9hZGVkJykpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBvbmx5IHRoZSB0ZXh0IGNvbnRlbnQgb2YgYSBjb21wb25lbnQgd2l0aG91dCByZXBsYWNpbmcgdGhlIFNwbGluZSBzY2VuZVxuICogQHBhcmFtIHRhcmdldEVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byB1cGRhdGVcbiAqIEBwYXJhbSBzb3VyY2VFbGVtZW50IC0gVGhlIGVsZW1lbnQgY29udGFpbmluZyB0aGUgbmV3IGNvbnRlbnRcbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGV4dENvbnRlbnRPbmx5KHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzb3VyY2VFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIC8vIFVwZGF0ZSB0aGUgaGVybyBoZWFkaW5nIHRleHRcbiAgICBjb25zdCB0YXJnZXRIZWFkaW5nID0gdGFyZ2V0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGVyby1jb250ZW50IGgxJyk7XG4gICAgY29uc3Qgc291cmNlSGVhZGluZyA9IHNvdXJjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhlcm8tY29udGVudCBoMScpO1xuICAgIGlmICh0YXJnZXRIZWFkaW5nICYmIHNvdXJjZUhlYWRpbmcpIHtcbiAgICAgICAgdGFyZ2V0SGVhZGluZy50ZXh0Q29udGVudCA9IHNvdXJjZUhlYWRpbmcudGV4dENvbnRlbnQ7XG4gICAgICAgIHRhcmdldEhlYWRpbmcuc2V0QXR0cmlidXRlKCdkYXRhLXRleHQnLCBzb3VyY2VIZWFkaW5nLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0JykgfHwgJycpO1xuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIGhlcm8gcGFyYWdyYXBoIHRleHRcbiAgICBjb25zdCB0YXJnZXRQYXJhZ3JhcGggPSB0YXJnZXRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZXJvLWNvbnRlbnQgcCcpO1xuICAgIGNvbnN0IHNvdXJjZVBhcmFncmFwaCA9IHNvdXJjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhlcm8tY29udGVudCBwJyk7XG4gICAgaWYgKHRhcmdldFBhcmFncmFwaCAmJiBzb3VyY2VQYXJhZ3JhcGgpIHtcbiAgICAgICAgdGFyZ2V0UGFyYWdyYXBoLnRleHRDb250ZW50ID0gc291cmNlUGFyYWdyYXBoLnRleHRDb250ZW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIGhlcm8gYnV0dG9uIHRleHRzXG4gICAgY29uc3QgdGFyZ2V0QnV0dG9ucyA9IHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmN0YS1idXR0b25zIGEnKTtcbiAgICBjb25zdCBzb3VyY2VCdXR0b25zID0gc291cmNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3RhLWJ1dHRvbnMgYScpO1xuICAgIFxuICAgIGlmICh0YXJnZXRCdXR0b25zLmxlbmd0aCA9PT0gc291cmNlQnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXRCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0YXJnZXRCdXR0b25zW2ldLnRleHRDb250ZW50ID0gc291cmNlQnV0dG9uc1tpXS50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgdGhlIGxvYWRpbmcgdGV4dCBpbiB0aGUgU3BsaW5lIGNvbnRhaW5lclxuICAgIGNvbnN0IHRhcmdldExvYWRpbmdUZXh0ID0gdGFyZ2V0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3BsaW5lLWxvYWRpbmcgcCcpO1xuICAgIGNvbnN0IHNvdXJjZUxvYWRpbmdUZXh0ID0gc291cmNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3BsaW5lLWxvYWRpbmcgcCcpO1xuICAgIGlmICh0YXJnZXRMb2FkaW5nVGV4dCAmJiBzb3VyY2VMb2FkaW5nVGV4dCkge1xuICAgICAgICB0YXJnZXRMb2FkaW5nVGV4dC50ZXh0Q29udGVudCA9IHNvdXJjZUxvYWRpbmdUZXh0LnRleHRDb250ZW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBVcGRhdGUgZXJyb3IgdGV4dFxuICAgIGNvbnN0IHRhcmdldEVycm9ySGVhZGluZyA9IHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNwbGluZS1lcnJvciBoMycpO1xuICAgIGNvbnN0IHNvdXJjZUVycm9ySGVhZGluZyA9IHNvdXJjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNwbGluZS1lcnJvciBoMycpO1xuICAgIGlmICh0YXJnZXRFcnJvckhlYWRpbmcgJiYgc291cmNlRXJyb3JIZWFkaW5nKSB7XG4gICAgICAgIHRhcmdldEVycm9ySGVhZGluZy50ZXh0Q29udGVudCA9IHNvdXJjZUVycm9ySGVhZGluZy50ZXh0Q29udGVudDtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdGFyZ2V0RXJyb3JUZXh0ID0gdGFyZ2V0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc3BsaW5lLWVycm9yIHAnKTtcbiAgICBjb25zdCBzb3VyY2VFcnJvclRleHQgPSBzb3VyY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtZXJyb3IgcCcpO1xuICAgIGlmICh0YXJnZXRFcnJvclRleHQgJiYgc291cmNlRXJyb3JUZXh0KSB7XG4gICAgICAgIHRhcmdldEVycm9yVGV4dC50ZXh0Q29udGVudCA9IHNvdXJjZUVycm9yVGV4dC50ZXh0Q29udGVudDtcbiAgICB9XG4gICAgXG4gICAgLy8gVXBkYXRlIHNjcm9sbCB0ZXh0XG4gICAgY29uc3QgdGFyZ2V0U2Nyb2xsVGV4dCA9IHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbC10ZXh0Jyk7XG4gICAgY29uc3Qgc291cmNlU2Nyb2xsVGV4dCA9IHNvdXJjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbC10ZXh0Jyk7XG4gICAgaWYgKHRhcmdldFNjcm9sbFRleHQgJiYgc291cmNlU2Nyb2xsVGV4dCkge1xuICAgICAgICB0YXJnZXRTY3JvbGxUZXh0LnRleHRDb250ZW50ID0gc291cmNlU2Nyb2xsVGV4dC50ZXh0Q29udGVudDtcbiAgICB9XG59XG5cbi8vIEFkZCB0eXBlIGRlY2xhcmF0aW9uIGZvciB0aGUgY3VzdG9tIGV2ZW50c1xuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBXaW5kb3dFdmVudE1hcCB7XG4gICAgICAgICdjb21wb25lbnQ6bG9hZGVkJzogQ3VzdG9tRXZlbnQ8Q29tcG9uZW50TG9hZGVkRXZlbnREZXRhaWw+O1xuICAgICAgICAnY29tcG9uZW50czphbGwtbG9hZGVkJzogQ3VzdG9tRXZlbnQ7XG4gICAgfVxufVxuXG4vLyBSZWxvYWQgY29tcG9uZW50cyB3aGVuIGxhbmd1YWdlIGNoYW5nZXNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xhbmd1YWdlOmNoYW5nZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9hZENvbXBvbmVudHMoKTtcbn0pO1xuIiwiLyoqXG4gKiBDb250YWN0IE1vZHVsZVxuICogSGFuZGxlcyBjb250YWN0IGZvcm0gdmFsaWRhdGlvbiBhbmQgc3VibWlzc2lvblxuICovXG5cbmltcG9ydCB7IENvbnRhY3RGb3JtRGF0YSB9IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4JztcblxuLyoqXG4gKiBJbml0aWFsaXplIGNvbnRhY3QgZm9ybVxuICogU2V0cyB1cCBmb3JtIHZhbGlkYXRpb24sIHN1Ym1pc3Npb24gaGFuZGxpbmcsIGFuZCBVSSBpbnRlcmFjdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRDb250YWN0Rm9ybSgpOiB2b2lkIHtcbiAgICBjb25zdCBjb250YWN0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEZvcm1FbGVtZW50PignLmNvbnRhY3QtZm9ybScpO1xuICAgIFxuICAgIGlmICghY29udGFjdEZvcm0pIHJldHVybjtcbiAgICBcbiAgICBjb25zdCBmb3JtSW5wdXRzID0gY29udGFjdEZvcm0ucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50PignaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKTtcbiAgICBsZXQgZm9ybVN1Ym1pdEF0dGVtcHRlZCA9IGZhbHNlO1xuICAgIFxuICAgIC8vIEFkZCBmbG9hdGluZyBsYWJlbCBlZmZlY3RcbiAgICBmb3JtSW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAvLyBTZXQgaW5pdGlhbCBzdGF0ZSBmb3IgaW5wdXRzIHdpdGggdmFsdWVzXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdoYXMtdmFsdWUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gSGFuZGxlIGlucHV0IGNoYW5nZXNcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5wdXQudmFsdWUudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ2hhcy12YWx1ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtdmFsdWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gT25seSB2YWxpZGF0ZSBpZiBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gYXR0ZW1wdGVkXG4gICAgICAgICAgICBpZiAoZm9ybVN1Ym1pdEF0dGVtcHRlZCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIEhhbmRsZSBmb2N1c1xuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcbiAgICAgICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC5hZGQoJ2ZvY3VzZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBIYW5kbGUgYmx1clxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xuICAgICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBPbmx5IHZhbGlkYXRlIG9uIGJsdXIgaWYgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIGF0dGVtcHRlZFxuICAgICAgICAgICAgaWYgKGZvcm1TdWJtaXRBdHRlbXB0ZWQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUlucHV0KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gRm9ybSBzdWJtaXNzaW9uXG4gICAgY29udGFjdEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNldCBmbGFnIHRvIGluZGljYXRlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiBhdHRlbXB0ZWRcbiAgICAgICAgZm9ybVN1Ym1pdEF0dGVtcHRlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvLyBWYWxpZGF0ZSBhbGwgaW5wdXRzXG4gICAgICAgIGZvcm1JbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlSW5wdXQoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAvLyBTaG93IGxvYWRpbmcgc3RhdGVcbiAgICAgICAgICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGNvbnRhY3RGb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpO1xuICAgICAgICAgICAgaWYgKCFzdWJtaXRCdG4pIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gc3VibWl0QnRuLnRleHRDb250ZW50IHx8ICcnO1xuICAgICAgICAgICAgc3VibWl0QnRuLnRleHRDb250ZW50ID0gJ1NlbmRpbmcuLi4nO1xuICAgICAgICAgICAgc3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gU2ltdWxhdGUgZm9ybSBzdWJtaXNzaW9uIChyZXBsYWNlIHdpdGggYWN0dWFsIHN1Ym1pc3Npb24pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBmb3JtXG4gICAgICAgICAgICAgICAgY29udGFjdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBmb3JtIHN1Ym1pc3Npb24gZmxhZ1xuICAgICAgICAgICAgICAgIGZvcm1TdWJtaXRBdHRlbXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBTaG93IHN1Y2Nlc3MgbWVzc2FnZVxuICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnc3VjY2Vzcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UudGV4dENvbnRlbnQgPSAnWW91ciBtZXNzYWdlIGhhcyBiZWVuIHNlbnQgc3VjY2Vzc2Z1bGx5ISc7XG4gICAgICAgICAgICAgICAgY29udGFjdEZvcm0uYXBwZW5kQ2hpbGQoc3VjY2Vzc01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IGJ1dHRvblxuICAgICAgICAgICAgICAgIHN1Ym1pdEJ0bi50ZXh0Q29udGVudCA9IG9yaWdpbmFsVGV4dDtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgc3VjY2VzcyBtZXNzYWdlIGFmdGVyIDUgc2Vjb25kc1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgYSBmb3JtIGlucHV0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gaW5wdXQgLSBUaGUgaW5wdXQgZWxlbWVudCB0byB2YWxpZGF0ZVxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgaW5wdXQgaXMgdmFsaWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUlucHV0KGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCB0eXBlID0gaW5wdXQudHlwZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGlucHV0Lm5hbWU7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyBlcnJvciBtZXNzYWdlXG4gICAgICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJyk7XG4gICAgICAgIGlmIChlcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVycm9yRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQ2hlY2sgaWYgcmVxdWlyZWQgZmllbGQgaXMgZW1wdHlcbiAgICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHNob3dFcnJvcihpbnB1dCwgJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIGVtYWlsIGZvcm1hdFxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdlbWFpbCcgJiYgIWlzVmFsaWRFbWFpbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzaG93RXJyb3IoaW5wdXQsICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJyk7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBWYWxpZGF0ZSBwaG9uZSBmb3JtYXQgaWYgbmVlZGVkXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3Bob25lJyAmJiAhaXNWYWxpZFBob25lKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNob3dFcnJvcihpbnB1dCwgJ1BsZWFzZSBlbnRlciBhIHZhbGlkIHBob25lIG51bWJlcicpO1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIG9yIHJlbW92ZSBlcnJvciBjbGFzc1xuICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTaG93IGVycm9yIG1lc3NhZ2UgZm9yIGFuIGlucHV0XG4gICAgICogQHBhcmFtIGlucHV0IC0gVGhlIGlucHV0IGVsZW1lbnQgd2l0aCBhbiBlcnJvclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIC0gVGhlIGVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNob3dFcnJvcihpbnB1dDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlcnJvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXJyb3ItbWVzc2FnZScpO1xuICAgICAgICBlcnJvckVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50Py5hcHBlbmRDaGlsZChlcnJvckVsZW1lbnQpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZSBlbWFpbCBmb3JtYXRcbiAgICAgKiBAcGFyYW0gZW1haWwgLSBUaGUgZW1haWwgdG8gdmFsaWRhdGVcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIGVtYWlsIGlzIHZhbGlkXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNWYWxpZEVtYWlsKGVtYWlsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvO1xuICAgICAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGUgcGhvbmUgbnVtYmVyIGZvcm1hdFxuICAgICAqIEBwYXJhbSBwaG9uZSAtIFRoZSBwaG9uZSBudW1iZXIgdG8gdmFsaWRhdGVcbiAgICAgKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIHBob25lIG51bWJlciBpcyB2YWxpZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVmFsaWRQaG9uZShwaG9uZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHBob25lUmVnZXggPSAvXlsrXT9bKF0/WzAtOV17M31bKV0/Wy1cXHMuXT9bMC05XXszfVstXFxzLl0/WzAtOV17NCw2fSQvO1xuICAgICAgICByZXR1cm4gcGhvbmVSZWdleC50ZXN0KHBob25lKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEN1cnNvciBNb2R1bGVcbiAqIEhhbmRsZXMgY3VzdG9tIGN1cnNvciBlZmZlY3RzIGFuZCBpbnRlcmFjdGlvbnNcbiAqL1xuXG4vKipcbiAqIEluaXRpYWxpemUgY3VzdG9tIGN1cnNvciBlZmZlY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0Q3Vyc29yRWZmZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnNvcjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjdXJzb3IuY2xhc3NMaXN0LmFkZCgnY3Vyc29yLWdsb3cnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGN1cnNvcik7XG4gICAgXG4gICAgbGV0IGN1cnNvclZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgY3Vyc29yRW5sYXJnZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBcbiAgICAvLyBNb3VzZSBtb3ZlbWVudFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmICghY3Vyc29yVmlzaWJsZSkge1xuICAgICAgICAgICAgY3Vyc29yLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgICAgICBjdXJzb3JWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3Vyc29yLnN0eWxlLmxlZnQgPSBgJHtlLmNsaWVudFh9cHhgO1xuICAgICAgICBjdXJzb3Iuc3R5bGUudG9wID0gYCR7ZS5jbGllbnRZfXB4YDtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBNb3VzZSBsZWF2ZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGN1cnNvci5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBjdXJzb3JWaXNpYmxlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ2xpY2sgZWZmZWN0XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICBjdXJzb3Iuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSBzY2FsZSgwLjgpJztcbiAgICB9KTtcbiAgICBcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICBjdXJzb3Iuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSBzY2FsZSgxKSc7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gTGluayBob3ZlciBlZmZlY3RcbiAgICBjb25zdCBsaW5rczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EsIGJ1dHRvbiwgLnNlcnZpY2UtY2FyZCwgLnByb2plY3QtY2FyZCwgLmZpbHRlci1idG4nKTtcbiAgICBcbiAgICBsaW5rcy5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnNvci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC01MCUsIC01MCUpIHNjYWxlKDEuNSknO1xuICAgICAgICAgICAgY3Vyc29yLnN0eWxlLmJhY2tncm91bmQgPSAncmFkaWFsLWdyYWRpZW50KGNpcmNsZSwgcmdiYSgwLCAxOTUsIDI1NSwgMC41KSAwJSwgcmdiYSgxMTAsIDAsIDI1NSwgMC4zKSA3MCUsIHRyYW5zcGFyZW50IDEwMCUpJztcbiAgICAgICAgICAgIGN1cnNvckVubGFyZ2VkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICAgICAgY3Vyc29yLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoMSknO1xuICAgICAgICAgICAgY3Vyc29yLnN0eWxlLmJhY2tncm91bmQgPSAncmFkaWFsLWdyYWRpZW50KGNpcmNsZSwgcmdiYSgxMTAsIDAsIDI1NSwgMC41KSAwJSwgcmdiYSgwLCAxOTUsIDI1NSwgMC4zKSA3MCUsIHRyYW5zcGFyZW50IDEwMCUpJztcbiAgICAgICAgICAgIGN1cnNvckVubGFyZ2VkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiLyoqXG4gKiBMYW5ndWFnZSBNYW5hZ2VyIE1vZHVsZVxuICogSGFuZGxlcyBsYW5ndWFnZSBkZXRlY3Rpb24sIHN3aXRjaGluZywgYW5kIHN0b3JhZ2VcbiAqL1xuXG5pbXBvcnQgeyBMYW5ndWFnZUNvZGUsIExvY2F0aW9uRGF0YSB9IGZyb20gJy4uLy4uL3R5cGVzL2luZGV4JztcblxuLy8gQXZhaWxhYmxlIGxhbmd1YWdlc1xuZW51bSBMYW5ndWFnZXMge1xuICBFTiA9ICdlbicsXG4gIEFMID0gJ2FsJ1xufVxuXG4vLyBEZWZhdWx0IGxhbmd1YWdlXG5jb25zdCBERUZBVUxUX0xBTkdVQUdFOiBMYW5ndWFnZXMgPSBMYW5ndWFnZXMuRU47XG5cbi8vIExhbmd1YWdlIHN0b3JhZ2Uga2V5XG5jb25zdCBMQU5HVUFHRV9TVE9SQUdFX0tFWTogc3RyaW5nID0gJ3ZlbG9yYV9wcmVmZXJyZWRfbGFuZ3VhZ2UnO1xuXG4vKipcbiAqIERldGVjdCB1c2VyJ3MgbGFuZ3VhZ2UgYmFzZWQgb24gYnJvd3NlciBzZXR0aW5ncyBhbmQgbG9jYXRpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlPExhbmd1YWdlQ29kZT59IFRoZSBkZXRlY3RlZCBsYW5ndWFnZSBjb2RlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdFVzZXJMYW5ndWFnZSgpOiBQcm9taXNlPExhbmd1YWdlQ29kZT4ge1xuICAgIC8vIEZpcnN0IGNoZWNrIGlmIHVzZXIgaGFzIGEgc3RvcmVkIHByZWZlcmVuY2VcbiAgICBjb25zdCBzdG9yZWRMYW5ndWFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKExBTkdVQUdFX1NUT1JBR0VfS0VZKTtcbiAgICBpZiAoc3RvcmVkTGFuZ3VhZ2UgJiYgT2JqZWN0LnZhbHVlcyhMYW5ndWFnZXMpLmluY2x1ZGVzKHN0b3JlZExhbmd1YWdlIGFzIExhbmd1YWdlcykpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlZExhbmd1YWdlIGFzIExhbmd1YWdlQ29kZTtcbiAgICB9XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgLy8gVHJ5IHRvIGRldGVjdCBsb2NhdGlvbiB1c2luZyBJUCBnZW9sb2NhdGlvbiBBUElcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9pcGFwaS5jby9qc29uLycpO1xuICAgICAgICBjb25zdCBkYXRhOiBMb2NhdGlvbkRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBJZiB1c2VyIGlzIGluIEFsYmFuaWEsIHNldCBBbGJhbmlhbiBhcyBkZWZhdWx0XG4gICAgICAgIGlmIChkYXRhLmNvdW50cnlfY29kZSA9PT0gJ0FMJykge1xuICAgICAgICAgICAgcmV0dXJuIExhbmd1YWdlcy5BTDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRldGVjdGluZyB1c2VyIGxvY2F0aW9uOicsIGVycm9yKTtcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIGJyb3dzZXIgbGFuZ3VhZ2UgaWYgZ2VvbG9jYXRpb24gZmFpbHNcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgYnJvd3NlciBsYW5ndWFnZSBhcyBmYWxsYmFja1xuICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8IChuYXZpZ2F0b3IgYXMgYW55KS51c2VyTGFuZ3VhZ2U7XG4gICAgaWYgKGJyb3dzZXJMYW5nICYmIGJyb3dzZXJMYW5nLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnc3EnKSkge1xuICAgICAgICByZXR1cm4gTGFuZ3VhZ2VzLkFMO1xuICAgIH1cbiAgICBcbiAgICAvLyBEZWZhdWx0IHRvIEVuZ2xpc2ggaWYgbm8gb3RoZXIgZGV0ZWN0aW9uIHdvcmtzXG4gICAgcmV0dXJuIERFRkFVTFRfTEFOR1VBR0U7XG59XG5cbi8qKlxuICogU2V0IHRoZSBjdXJyZW50IGxhbmd1YWdlXG4gKiBAcGFyYW0ge0xhbmd1YWdlQ29kZX0gbGFuZ3VhZ2VDb2RlIC0gVGhlIGxhbmd1YWdlIGNvZGUgdG8gc2V0XG4gKi9cbmZ1bmN0aW9uIHNldExhbmd1YWdlKGxhbmd1YWdlQ29kZTogTGFuZ3VhZ2VDb2RlKTogdm9pZCB7XG4gICAgaWYgKCFPYmplY3QudmFsdWVzKExhbmd1YWdlcykuaW5jbHVkZXMobGFuZ3VhZ2VDb2RlIGFzIExhbmd1YWdlcykpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgSW52YWxpZCBsYW5ndWFnZSBjb2RlOiAke2xhbmd1YWdlQ29kZX1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBTdG9yZSBsYW5ndWFnZSBwcmVmZXJlbmNlXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oTEFOR1VBR0VfU1RPUkFHRV9LRVksIGxhbmd1YWdlQ29kZSk7XG4gICAgXG4gICAgLy8gU2V0IGxhbmd1YWdlIGF0dHJpYnV0ZSBvbiBodG1sIGVsZW1lbnRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdsYW5nJywgbGFuZ3VhZ2VDb2RlID09PSBMYW5ndWFnZXMuQUwgPyAnc3EnIDogJ2VuJyk7XG4gICAgXG4gICAgLy8gUmVsb2FkIGNvbXBvbmVudHMgd2l0aCBuZXcgbGFuZ3VhZ2VcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbGFuZ3VhZ2U6Y2hhbmdlZCcsIHsgXG4gICAgICAgIGRldGFpbDogeyBsYW5ndWFnZTogbGFuZ3VhZ2VDb2RlIH1cbiAgICB9KSk7XG4gICAgXG4gICAgLy8gVXBkYXRlIGxhbmd1YWdlIHN3aXRjaGVyIFVJXG4gICAgdXBkYXRlTGFuZ3VhZ2VTd2l0Y2hlclVJKGxhbmd1YWdlQ29kZSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IGxhbmd1YWdlXG4gKiBAcmV0dXJucyB7TGFuZ3VhZ2VDb2RlfSBUaGUgY3VycmVudCBsYW5ndWFnZSBjb2RlXG4gKi9cbmZ1bmN0aW9uIGdldEN1cnJlbnRMYW5ndWFnZSgpOiBMYW5ndWFnZUNvZGUge1xuICAgIHJldHVybiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oTEFOR1VBR0VfU1RPUkFHRV9LRVkpIHx8IERFRkFVTFRfTEFOR1VBR0UpIGFzIExhbmd1YWdlQ29kZTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGxhbmd1YWdlIHN3aXRjaGVyIFVJIHRvIHJlZmxlY3QgY3VycmVudCBsYW5ndWFnZVxuICogQHBhcmFtIHtMYW5ndWFnZUNvZGV9IGxhbmd1YWdlQ29kZSAtIFRoZSBjdXJyZW50IGxhbmd1YWdlIGNvZGVcbiAqL1xuZnVuY3Rpb24gdXBkYXRlTGFuZ3VhZ2VTd2l0Y2hlclVJKGxhbmd1YWdlQ29kZTogTGFuZ3VhZ2VDb2RlKTogdm9pZCB7XG4gICAgY29uc3Qgc3dpdGNoZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxhbmd1YWdlLXN3aXRjaGVyJyk7XG4gICAgXG4gICAgc3dpdGNoZXJzLmZvckVhY2goc3dpdGNoZXIgPT4ge1xuICAgICAgICBjb25zdCBidXR0b25zID0gc3dpdGNoZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG4gICAgICAgIFxuICAgICAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbkxhbmcgPSBidXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmd1YWdlJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChidXR0b25MYW5nID09PSBsYW5ndWFnZUNvZGUpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgbGFuZ3VhZ2Ugc3lzdGVtXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0TGFuZ3VhZ2VTeXN0ZW0oKTogUHJvbWlzZTxMYW5ndWFnZUNvZGU+IHtcbiAgICAvLyBEZXRlY3QgdXNlcidzIGxhbmd1YWdlXG4gICAgY29uc3QgZGV0ZWN0ZWRMYW5ndWFnZSA9IGF3YWl0IGRldGVjdFVzZXJMYW5ndWFnZSgpO1xuICAgIFxuICAgIC8vIFNldCBpbml0aWFsIGxhbmd1YWdlXG4gICAgc2V0TGFuZ3VhZ2UoZGV0ZWN0ZWRMYW5ndWFnZSk7XG4gICAgXG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyBmb3IgbGFuZ3VhZ2Ugc3dpdGNoZXIgYnV0dG9uc1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgY29uc3QgbGFuZ0J1dHRvbiA9IHRhcmdldC5jbG9zZXN0KCdbZGF0YS1sYW5ndWFnZV0nKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgXG4gICAgICAgIGlmIChsYW5nQnV0dG9uKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdMYW5ndWFnZSA9IGxhbmdCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmd1YWdlJykgYXMgTGFuZ3VhZ2VDb2RlO1xuICAgICAgICAgICAgc2V0TGFuZ3VhZ2UobmV3TGFuZ3VhZ2UpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGRldGVjdGVkTGFuZ3VhZ2U7XG59XG5cbi8vIEV4cG9ydCBwdWJsaWMgQVBJXG5leHBvcnQgeyBMYW5ndWFnZXMsIGdldEN1cnJlbnRMYW5ndWFnZSwgc2V0TGFuZ3VhZ2UgfTtcbiIsIi8qKlxuICogTmF2aWdhdGlvbiBNb2R1bGVcbiAqIEhhbmRsZXMgbmF2aWdhdGlvbiBmdW5jdGlvbmFsaXR5IGluY2x1ZGluZyBtb2JpbGUgbWVudSB0b2dnbGUgYW5kIHNtb290aCBzY3JvbGxpbmdcbiAqL1xuXG4vKipcbiAqIEluaXRpYWxpemUgbmF2aWdhdGlvbiBmdW5jdGlvbmFsaXR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0TmF2aWdhdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBuYXZMaW5rczogTm9kZUxpc3RPZjxIVE1MQW5jaG9yRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LWxpbmsnKTtcbiAgICBjb25zdCBtb2JpbGVNZW51VG9nZ2xlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9iaWxlLW1lbnUtdG9nZ2xlJyk7XG4gICAgY29uc3QgbmF2TWVudTogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rcycpO1xuICAgIFxuICAgIC8vIE1vYmlsZSBtZW51IHRvZ2dsZVxuICAgIGlmIChtb2JpbGVNZW51VG9nZ2xlICYmIG5hdk1lbnUpIHtcbiAgICAgICAgbW9iaWxlTWVudVRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIG5hdk1lbnUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICBtb2JpbGVNZW51VG9nZ2xlLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgbmF2aWdhdGlvbiBsaW5rc1xuICAgIG5hdkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDbG9zZSBtb2JpbGUgbWVudSBpZiBvcGVuXG4gICAgICAgICAgICBpZiAobmF2TWVudSAmJiBuYXZNZW51LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICBuYXZNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGlmIChtb2JpbGVNZW51VG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZU1lbnVUb2dnbGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJZDogc3RyaW5nIHwgbnVsbCA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRTZWN0aW9uOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldElkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2VjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0YXJnZXRTZWN0aW9uLm9mZnNldFRvcCAtIDgwLCAvLyBPZmZzZXQgZm9yIGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQWRkIGFjdGl2ZSBjbGFzcyB0byBuYXYgbGlua3MgYmFzZWQgb24gc2Nyb2xsIHBvc2l0aW9uXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGhpZ2hsaWdodE5hdk9uU2Nyb2xsKTtcbn1cblxuLyoqXG4gKiBIaWdobGlnaHQgbmF2aWdhdGlvbiBsaW5rcyBiYXNlZCBvbiBzY3JvbGwgcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24gaGlnaGxpZ2h0TmF2T25TY3JvbGwoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VjdGlvbnM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VjdGlvbicpO1xuICAgIGNvbnN0IG5hdkxpbmtzOiBOb2RlTGlzdE9mPEhUTUxBbmNob3JFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtbGluaycpO1xuICAgIFxuICAgIGxldCBjdXJyZW50U2VjdGlvbjogc3RyaW5nID0gJyc7XG4gICAgXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzZWN0aW9uID0+IHtcbiAgICAgICAgY29uc3Qgc2VjdGlvblRvcDogbnVtYmVyID0gc2VjdGlvbi5vZmZzZXRUb3AgLSAxMDA7XG4gICAgICAgIGNvbnN0IHNlY3Rpb25IZWlnaHQ6IG51bWJlciA9IHNlY3Rpb24uY2xpZW50SGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+PSBzZWN0aW9uVG9wICYmIHdpbmRvdy5wYWdlWU9mZnNldCA8IHNlY3Rpb25Ub3AgKyBzZWN0aW9uSGVpZ2h0KSB7XG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uSWQ6IHN0cmluZyB8IG51bGwgPSBzZWN0aW9uLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICAgIGlmIChzZWN0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2VjdGlvbiA9IHNlY3Rpb25JZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIG5hdkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgIGxpbmsuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIGNvbnN0IGhyZWY6IHN0cmluZyB8IG51bGwgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICBpZiAoaHJlZiA9PT0gYCMke2N1cnJlbnRTZWN0aW9ufWApIHtcbiAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIi8qKlxuICogUHJvamVjdHMgTW9kdWxlXG4gKiBIYW5kbGVzIHByb2plY3QgZmlsdGVyaW5nIGFuZCBpbnRlcmFjdGlvbnNcbiAqL1xuXG5pbXBvcnQgeyBQcm9qZWN0IH0gZnJvbSAnLi4vLi4vdHlwZXMvaW5kZXgnO1xuXG4vKipcbiAqIEluaXRpYWxpemUgcHJvamVjdCBmaWx0ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0UHJvamVjdEZpbHRlcnMoKTogdm9pZCB7XG4gICAgY29uc3QgZmlsdGVyQnV0dG9uczogTm9kZUxpc3RPZjxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXItYnRuJyk7XG4gICAgY29uc3QgcHJvamVjdENhcmRzOiBOb2RlTGlzdE9mPEVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2plY3QtY2FyZCcpO1xuICAgIFxuICAgIC8vIEluaXRpYWxpemUgd2l0aCBcIkFsbFwiIGZpbHRlciBhY3RpdmVcbiAgICBmaWx0ZXJQcm9qZWN0cygnYWxsJyk7XG4gICAgXG4gICAgLy8gQWRkIGNsaWNrIGV2ZW50IHRvIGZpbHRlciBidXR0b25zXG4gICAgZmlsdGVyQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhY3RpdmUgY2xhc3MgZnJvbSBhbGwgYnV0dG9uc1xuICAgICAgICAgICAgZmlsdGVyQnV0dG9ucy5mb3JFYWNoKGJ0biA9PiBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBZGQgYWN0aXZlIGNsYXNzIHRvIGNsaWNrZWQgYnV0dG9uXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBmaWx0ZXIgdmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlclZhbHVlOiBzdHJpbmcgfCBudWxsID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXInKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gRmlsdGVyIHByb2plY3RzXG4gICAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJQcm9qZWN0cyhmaWx0ZXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIGZ1bmN0aW9uIGZpbHRlclByb2plY3RzKGNhdGVnb3J5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgcHJvamVjdENhcmRzLmZvckVhY2goY2FyZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0Q2F0ZWdvcnk6IHN0cmluZyB8IG51bGwgPSBjYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeScpO1xuICAgICAgICAgICAgY29uc3QgY2FyZEVsZW1lbnQgPSBjYXJkIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBIaWRlIGFsbCBwcm9qZWN0cyBmaXJzdFxuICAgICAgICAgICAgY2FyZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gU2hvdyBwcm9qZWN0cyBiYXNlZCBvbiBmaWx0ZXJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ2FsbCcgfHwgcHJvamVjdENhdGVnb3J5ID09PSBjYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIGNhcmRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbmltYXRpb25cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgICAgICAgICAgICAgY2FyZEVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhcmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICAgICAgICAgICAgY2FyZEVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMjBweCknO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIGhvdmVyIGVmZmVjdCB0byBwcm9qZWN0IGNhcmRzXG4gICAgcHJvamVjdENhcmRzLmZvckVhY2goY2FyZCA9PiB7XG4gICAgICAgIGNvbnN0IGNhcmRFbGVtZW50ID0gY2FyZCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGNhcmRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0LW92ZXJsYXknKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgY29uc3QgcHJvamVjdEluZm8gPSBjYXJkRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1pbmZvJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIFxuICAgICAgICBpZiAob3ZlcmxheSAmJiBwcm9qZWN0SW5mbykge1xuICAgICAgICAgICAgY2FyZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICBvdmVybGF5LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgICAgICAgICAgcHJvamVjdEluZm8uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhcmRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3ZlcmxheS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICAgICAgICAgIHByb2plY3RJbmZvLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKDIwcHgpJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCIvKipcbiAqIFRlc3RpbW9uaWFscyBNb2R1bGVcbiAqIEhhbmRsZXMgdGVzdGltb25pYWwgc2xpZGVyIGZ1bmN0aW9uYWxpdHlcbiAqL1xuXG5pbXBvcnQgeyBUZXN0aW1vbmlhbCwgQ29tcG9uZW50TG9hZGVkRXZlbnREZXRhaWwgfSBmcm9tICcuLi8uLi90eXBlcy9pbmRleCc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0ZXN0aW1vbmlhbCBzbGlkZXJcbiAqIFNldHMgdXAgdGhlIHRlc3RpbW9uaWFsIHNsaWRlciB3aXRoIG5hdmlnYXRpb24sIGF1dG8tc2xpZGluZywgYW5kIGV2ZW50IGxpc3RlbmVyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFRlc3RpbW9uaWFsU2xpZGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcudGVzdGltb25pYWwtc2xpZGUnKTtcbiAgICBjb25zdCBkb3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5kb3QnKTtcbiAgICBjb25zdCBwcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5wcmV2LWJ0bicpO1xuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm5leHQtYnRuJyk7XG4gICAgXG4gICAgaWYgKCFzbGlkZXMubGVuZ3RoKSByZXR1cm47XG4gICAgXG4gICAgbGV0IGN1cnJlbnRTbGlkZSA9IDA7XG4gICAgY29uc3Qgc2xpZGVDb3VudCA9IHNsaWRlcy5sZW5ndGg7XG4gICAgXG4gICAgLy8gSW5pdGlhbGl6ZSBzbGlkZXJcbiAgICBzaG93U2xpZGUoY3VycmVudFNsaWRlKTtcbiAgICBcbiAgICAvLyBQcmV2aW91cyBidXR0b24gY2xpY2tcbiAgICBpZiAocHJldkJ0bikge1xuICAgICAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSAtIDEgKyBzbGlkZUNvdW50KSAlIHNsaWRlQ291bnQ7XG4gICAgICAgICAgICBzaG93U2xpZGUoY3VycmVudFNsaWRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIE5leHQgYnV0dG9uIGNsaWNrXG4gICAgaWYgKG5leHRCdG4pIHtcbiAgICAgICAgbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRTbGlkZSA9IChjdXJyZW50U2xpZGUgKyAxKSAlIHNsaWRlQ291bnQ7XG4gICAgICAgICAgICBzaG93U2xpZGUoY3VycmVudFNsaWRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERvdCBuYXZpZ2F0aW9uXG4gICAgZG90cy5mb3JFYWNoKChkb3QsIGluZGV4KSA9PiB7XG4gICAgICAgIGRvdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRTbGlkZSA9IGluZGV4O1xuICAgICAgICAgICAgc2hvd1NsaWRlKGN1cnJlbnRTbGlkZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEF1dG8gc2xpZGUgKG9wdGlvbmFsKVxuICAgIGxldCBzbGlkZUludGVydmFsOiBudW1iZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjdXJyZW50U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSBzbGlkZUNvdW50O1xuICAgICAgICBzaG93U2xpZGUoY3VycmVudFNsaWRlKTtcbiAgICB9LCA1MDAwKTtcbiAgICBcbiAgICAvLyBQYXVzZSBhdXRvIHNsaWRlIG9uIGhvdmVyXG4gICAgY29uc3QgdGVzdGltb25pYWxTbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLnRlc3RpbW9uaWFsLXNsaWRlcicpO1xuICAgIGlmICh0ZXN0aW1vbmlhbFNsaWRlcikge1xuICAgICAgICB0ZXN0aW1vbmlhbFNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChzbGlkZUludGVydmFsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0ZXN0aW1vbmlhbFNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgc2xpZGVJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgc2xpZGVDb3VudDtcbiAgICAgICAgICAgICAgICBzaG93U2xpZGUoY3VycmVudFNsaWRlKTtcbiAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2hvdyBhIHNwZWNpZmljIHNsaWRlIGJ5IGluZGV4XG4gICAgICogQHBhcmFtIGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBzbGlkZSB0byBzaG93XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2hvd1NsaWRlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgLy8gSGlkZSBhbGwgc2xpZGVzXG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKHNsaWRlID0+IHtcbiAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlbW92ZSBhY3RpdmUgY2xhc3MgZnJvbSBhbGwgZG90c1xuICAgICAgICBkb3RzLmZvckVhY2goZG90ID0+IHtcbiAgICAgICAgICAgIGRvdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBTaG93IGN1cnJlbnQgc2xpZGVcbiAgICAgICAgc2xpZGVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBhY3RpdmUgY2xhc3MgdG8gY3VycmVudCBkb3RcbiAgICAgICAgaWYgKGRvdHNbaW5kZXhdKSB7XG4gICAgICAgICAgICBkb3RzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gTGlzdGVuIGZvciBsYW5ndWFnZSBjaGFuZ2UgZXZlbnRzIHRvIHJlaW5pdGlhbGl6ZSB0aGUgdGVzdGltb25pYWwgc2xpZGVyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsYW5ndWFnZTpjaGFuZ2VkJywgKCkgPT4ge1xuICAgIC8vIFdhaXQgZm9yIGNvbXBvbmVudHMgdG8gYmUgcmVsb2FkZWQgYmVmb3JlIGluaXRpYWxpemluZyB0aGUgc2xpZGVyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9uZW50czphbGwtbG9hZGVkJywgKCkgPT4ge1xuICAgICAgICBpbml0VGVzdGltb25pYWxTbGlkZXIoKTtcbiAgICB9LCB7IG9uY2U6IHRydWUgfSk7XG59KTtcblxuLy8gQWxzbyBsaXN0ZW4gZm9yIGluZGl2aWR1YWwgY29tcG9uZW50IGxvYWRzXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb21wb25lbnQ6bG9hZGVkJywgKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IGN1c3RvbUV2ZW50ID0gZXZlbnQgYXMgQ3VzdG9tRXZlbnQ8Q29tcG9uZW50TG9hZGVkRXZlbnREZXRhaWw+O1xuICAgIC8vIENoZWNrIGlmIHRoZSBsb2FkZWQgY29tcG9uZW50IGlzIHRoZSB0ZXN0aW1vbmlhbHMgY29tcG9uZW50XG4gICAgaWYgKGN1c3RvbUV2ZW50LmRldGFpbC5uYW1lID09PSAndGVzdGltb25pYWxzJykge1xuICAgICAgICBpbml0VGVzdGltb25pYWxTbGlkZXIoKTtcbiAgICB9XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG5cdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZltrZXldKGNodW5rSWQsIHByb21pc2VzKTtcblx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdH0sIFtdKSk7XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmJ1bmRsZS5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwidmFyIGluUHJvZ3Jlc3MgPSB7fTtcbnZhciBkYXRhV2VicGFja1ByZWZpeCA9IFwidmVsb3JhLXRlY2gtd2Vic2l0ZTpcIjtcbi8vIGxvYWRTY3JpcHQgZnVuY3Rpb24gdG8gbG9hZCBhIHNjcmlwdCB2aWEgc2NyaXB0IHRhZ1xuX193ZWJwYWNrX3JlcXVpcmVfXy5sID0gKHVybCwgZG9uZSwga2V5LCBjaHVua0lkKSA9PiB7XG5cdGlmKGluUHJvZ3Jlc3NbdXJsXSkgeyBpblByb2dyZXNzW3VybF0ucHVzaChkb25lKTsgcmV0dXJuOyB9XG5cdHZhciBzY3JpcHQsIG5lZWRBdHRhY2g7XG5cdGlmKGtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHMgPSBzY3JpcHRzW2ldO1xuXHRcdFx0aWYocy5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgPT0gdXJsIHx8IHMuZ2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIpID09IGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KSB7IHNjcmlwdCA9IHM7IGJyZWFrOyB9XG5cdFx0fVxuXHR9XG5cdGlmKCFzY3JpcHQpIHtcblx0XHRuZWVkQXR0YWNoID0gdHJ1ZTtcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuXHRcdHNjcmlwdC5jaGFyc2V0ID0gJ3V0Zi04Jztcblx0XHRzY3JpcHQudGltZW91dCA9IDEyMDtcblx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5uYykge1xuXHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIF9fd2VicGFja19yZXF1aXJlX18ubmMpO1xuXHRcdH1cblx0XHRzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIsIGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KTtcblxuXHRcdHNjcmlwdC5zcmMgPSB1cmw7XG5cdH1cblx0aW5Qcm9ncmVzc1t1cmxdID0gW2RvbmVdO1xuXHR2YXIgb25TY3JpcHRDb21wbGV0ZSA9IChwcmV2LCBldmVudCkgPT4ge1xuXHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cblx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR2YXIgZG9uZUZucyA9IGluUHJvZ3Jlc3NbdXJsXTtcblx0XHRkZWxldGUgaW5Qcm9ncmVzc1t1cmxdO1xuXHRcdHNjcmlwdC5wYXJlbnROb2RlICYmIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0ZG9uZUZucyAmJiBkb25lRm5zLmZvckVhY2goKGZuKSA9PiAoZm4oZXZlbnQpKSk7XG5cdFx0aWYocHJldikgcmV0dXJuIHByZXYoZXZlbnQpO1xuXHR9XG5cdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgdW5kZWZpbmVkLCB7IHR5cGU6ICd0aW1lb3V0JywgdGFyZ2V0OiBzY3JpcHQgfSksIDEyMDAwMCk7XG5cdHNjcmlwdC5vbmVycm9yID0gb25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHNjcmlwdC5vbmVycm9yKTtcblx0c2NyaXB0Lm9ubG9hZCA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25sb2FkKTtcblx0bmVlZEF0dGFjaCAmJiBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59OyIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiOyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5mLmogPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0XHQvLyBKU09OUCBjaHVuayBsb2FkaW5nIGZvciBqYXZhc2NyaXB0XG5cdFx0dmFyIGluc3RhbGxlZENodW5rRGF0YSA9IF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpID8gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdIDogdW5kZWZpbmVkO1xuXHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSAhPT0gMCkgeyAvLyAwIG1lYW5zIFwiYWxyZWFkeSBpbnN0YWxsZWRcIi5cblxuXHRcdFx0Ly8gYSBQcm9taXNlIG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cblx0XHRcdGlmKGluc3RhbGxlZENodW5rRGF0YSkge1xuXHRcdFx0XHRwcm9taXNlcy5wdXNoKGluc3RhbGxlZENodW5rRGF0YVsyXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0XHRcdC8vIHNldHVwIFByb21pc2UgaW4gY2h1bmsgY2FjaGVcblx0XHRcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IChpbnN0YWxsZWRDaHVua0RhdGEgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbcmVzb2x2ZSwgcmVqZWN0XSkpO1xuXHRcdFx0XHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ2h1bmtEYXRhWzJdID0gcHJvbWlzZSk7XG5cblx0XHRcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG5cdFx0XHRcdFx0dmFyIHVybCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKTtcblx0XHRcdFx0XHQvLyBjcmVhdGUgZXJyb3IgYmVmb3JlIHN0YWNrIHVud291bmQgdG8gZ2V0IHVzZWZ1bCBzdGFja3RyYWNlIGxhdGVyXG5cdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKCk7XG5cdFx0XHRcdFx0dmFyIGxvYWRpbmdFbmRlZCA9IChldmVudCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkpIHtcblx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuXHRcdFx0XHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEgIT09IDApIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVhbFNyYyA9IGV2ZW50ICYmIGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuc3JjO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSAnTG9hZGluZyBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLlxcbignICsgZXJyb3JUeXBlICsgJzogJyArIHJlYWxTcmMgKyAnKSc7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IubmFtZSA9ICdDaHVua0xvYWRFcnJvcic7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IudHlwZSA9IGVycm9yVHlwZTtcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5yZXF1ZXN0ID0gcmVhbFNyYztcblx0XHRcdFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua0RhdGFbMV0oZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmwodXJsLCBsb2FkaW5nRW5kZWQsIFwiY2h1bmstXCIgKyBjaHVua0lkLCBjaHVua0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cbn07XG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmt2ZWxvcmFfdGVjaF93ZWJzaXRlXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3ZlbG9yYV90ZWNoX3dlYnNpdGVcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIi8qKlxuICogTWFpbiBBcHBsaWNhdGlvbiBFbnRyeSBQb2ludFxuICogSW1wb3J0cyBhbmQgaW5pdGlhbGl6ZXMgYWxsIG1vZHVsZXNcbiAqL1xuXG4vLyBJbXBvcnQgbW9kdWxlc1xuaW1wb3J0IHsgaW5pdE5hdmlnYXRpb24gfSBmcm9tICcuL21vZHVsZXMvbmF2aWdhdGlvbic7XG5pbXBvcnQgeyBpbml0Q3Vyc29yRWZmZWN0IH0gZnJvbSAnLi9tb2R1bGVzL2N1cnNvcic7XG5pbXBvcnQgeyBpbml0U2Nyb2xsQW5pbWF0aW9uLCBpbml0Q291bnRlcnMgfSBmcm9tICcuL21vZHVsZXMvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBpbml0UHJvamVjdEZpbHRlcnMgfSBmcm9tICcuL21vZHVsZXMvcHJvamVjdHMnO1xuaW1wb3J0IHsgaW5pdFRlc3RpbW9uaWFsU2xpZGVyIH0gZnJvbSAnLi9tb2R1bGVzL3Rlc3RpbW9uaWFscyc7XG5pbXBvcnQgeyBpbml0Q29udGFjdEZvcm0gfSBmcm9tICcuL21vZHVsZXMvY29udGFjdCc7XG5pbXBvcnQgeyBsb2FkQ29tcG9uZW50cyB9IGZyb20gJy4vbW9kdWxlcy9jb21wb25lbnQtbG9hZGVyJztcbmltcG9ydCB7IGluaXRMYW5ndWFnZVN5c3RlbSB9IGZyb20gJy4vbW9kdWxlcy9sYW5ndWFnZS1tYW5hZ2VyJztcblxuLy8gQ2hlY2sgaWYgd2UncmUgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xuXG4vLyBJbml0aWFsaXplIGFsbCBtb2R1bGVzIHdoZW4gRE9NIGlzIGxvYWRlZFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBZGQgbm9pc2Ugb3ZlcmxheVxuICAgIGNvbnN0IG5vaXNlT3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vaXNlT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdub2lzZS1vdmVybGF5Jyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub2lzZU92ZXJsYXkpO1xuICAgIFxuICAgIC8vIEluaXRpYWxpemUgbGFuZ3VhZ2Ugc3lzdGVtIGZpcnN0XG4gICAgYXdhaXQgaW5pdExhbmd1YWdlU3lzdGVtKCk7XG4gICAgXG4gICAgLy8gTG9hZCBjb21wb25lbnRzIGFmdGVyIGxhbmd1YWdlIGlzIHNldFxuICAgIGF3YWl0IGxvYWRDb21wb25lbnRzKCk7XG4gICAgXG4gICAgLy8gSW5pdGlhbGl6ZSBtb2R1bGVzIGFmdGVyIGNvbXBvbmVudHMgYXJlIGxvYWRlZFxuICAgIGluaXROYXZpZ2F0aW9uKCk7XG4gICAgaW5pdEN1cnNvckVmZmVjdCgpO1xuICAgIGluaXRTY3JvbGxBbmltYXRpb24oKTtcbiAgICBpbml0Q291bnRlcnMoKTtcbiAgICBpbml0UHJvamVjdEZpbHRlcnMoKTtcbiAgICBpbml0VGVzdGltb25pYWxTbGlkZXIoKTtcbiAgICBpbml0Q29udGFjdEZvcm0oKTtcbiAgICBcbiAgICAvLyBEaXNwYXRjaCBldmVudCB0aGF0IGFsbCBjb21wb25lbnRzIGFyZSBsb2FkZWQgYW5kIGluaXRpYWxpemVkXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NvbXBvbmVudHM6YWxsLWxvYWRlZCcpKTtcbiAgICBcbiAgICAvLyBMYXp5IGxvYWQgYW5kIGluaXRpYWxpemUgdGhlIFNwbGluZSB2aWV3ZXIgb25seSB3aGVuIG5lZWRlZFxuICAgIGNvbnN0IHNwbGluZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGxpbmUtY2FudmFzLWNvbnRhaW5lcicpO1xuICAgIGlmIChzcGxpbmVDb250YWluZXIpIHtcbiAgICAgICAgLy8gU2hvdyBsb2FkaW5nIGluZGljYXRvciBpbW1lZGlhdGVseVxuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtbG9hZGluZycpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAobG9hZGluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGxvYWRpbmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgICAgICAgICBsb2FkaW5nRWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIExhenkgbG9hZCB0aGUgU3BsaW5lIHZpZXdlciBtb2R1bGVcbiAgICAgICAgaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwic3BsaW5lLW1vZHVsZVwiICovICcuL21vZHVsZXMvc3BsaW5lLXZpZXdlcicpXG4gICAgICAgICAgICAudGhlbihtb2R1bGUgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIFNwbGluZSB2aWV3ZXJcbiAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdFNwbGluZVZpZXdlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIFNwbGluZSB2aWV3ZXIgbW9kdWxlOicsIGVycik7XG4gICAgICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIGluZGljYXRvciBvbiBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChsb2FkaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNob3cgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtZXJyb3InKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBSdW4gdGVzdHMgaW4gZGV2ZWxvcG1lbnQgbW9kZVxuICAgIGlmIChpc0RldmVsb3BtZW50KSB7XG4gICAgICAgIGltcG9ydCgnLi90ZXN0LXJ1bm5lcicpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Rlc3QgcnVubmVyIGxvYWRlZCcpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgdGVzdCBydW5uZXI6JywgZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKCdWZWxvcmEgVGVjaCBhcHBsaWNhdGlvbiBpbml0aWFsaXplZCcpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
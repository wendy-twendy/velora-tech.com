/**
 * Contact Module
 * Handles contact form validation and submission
 */

import { ContactFormData } from '../../types/index';

/**
 * Initialize contact form
 * Sets up form validation, submission handling, and UI interactions
 */
export function initContactForm(): void {
    const contactForm = document.querySelector<HTMLFormElement>('.contact-form');
    
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
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
            } else {
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
    contactForm.addEventListener('submit', (e: Event) => {
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
            const submitBtn = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
            if (!submitBtn) return;
            
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
    function validateInput(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
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
        } else if (value !== '') {
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
        } else {
            input.parentElement?.classList.add('error');
        }
        
        return isValid;
    }
    
    /**
     * Show error message for an input
     * @param input - The input element with an error
     * @param message - The error message to display
     */
    function showError(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string): void {
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
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param phone - The phone number to validate
     * @returns boolean indicating if the phone number is valid
     */
    function isValidPhone(phone: string): boolean {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }
}

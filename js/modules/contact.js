/**
 * Contact Module
 * Handles contact form validation and submission
 */

export function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    
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
        });
        
        // Handle focus
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        // Handle blur
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            validateInput(input);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
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
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                formInputs.forEach(input => {
                    input.classList.remove('has-value');
                    input.parentElement.classList.remove('error');
                });
                
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
    
    // Validate input function
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        
        // Remove previous error message
        const errorElement = input.parentElement.querySelector('.error-message');
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
            input.parentElement.classList.remove('error');
        } else {
            input.parentElement.classList.add('error');
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        input.parentElement.appendChild(errorElement);
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation
    function isValidPhone(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }
}

/**
 * Test utilities for Velora Tech website
 * Used to verify TypeScript migration functionality
 */

/**
 * Test all core functionality of the website
 * @returns Object with test results
 */
export function runFunctionalTests(): Record<string, boolean> {
  const results: Record<string, boolean> = {};
  
  // Test navigation functionality
  results['navigation'] = testNavigation();
  
  // Test cursor effect
  results['cursor'] = testCursorEffect();
  
  // Test animations
  results['animations'] = testAnimations();
  
  // Test project filters
  results['projects'] = testProjectFilters();
  
  // Test testimonial slider
  results['testimonials'] = testTestimonialSlider();
  
  // Test contact form
  results['contact'] = testContactForm();
  
  // Test language switching
  results['language'] = testLanguageSwitching();
  
  // Test component loading
  results['components'] = testComponentLoading();
  
  return results;
}

/**
 * Test navigation functionality
 */
function testNavigation(): boolean {
  try {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!header || !hamburger || !navLinks) {
      console.error('Navigation elements not found');
      return false;
    }
    
    // Test scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Test hamburger click
    hamburger.dispatchEvent(new MouseEvent('click'));
    const mobileMenuActive = navLinks.classList.contains('active');
    hamburger.dispatchEvent(new MouseEvent('click'));
    
    return true;
  } catch (error) {
    console.error('Navigation test failed:', error);
    return false;
  }
}

/**
 * Test cursor effect
 */
function testCursorEffect(): boolean {
  try {
    const cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;
    
    if (!cursorGlow) {
      console.error('Cursor glow element not found');
      return false;
    }
    
    // Test mouse movement
    document.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100
    }));
    
    return cursorGlow.style.opacity !== '';
  } catch (error) {
    console.error('Cursor effect test failed:', error);
    return false;
  }
}

/**
 * Test animations
 */
function testAnimations(): boolean {
  try {
    // Test scroll animations
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Check if any elements have the 'revealed' class
    const revealedElements = document.querySelectorAll('.revealed');
    
    return revealedElements.length > 0;
  } catch (error) {
    console.error('Animations test failed:', error);
    return false;
  }
}

/**
 * Test project filters
 */
function testProjectFilters(): boolean {
  try {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length === 0) {
      console.error('Project filter buttons not found');
      return false;
    }
    
    // Test clicking each filter button
    let success = true;
    filterBtns.forEach(btn => {
      btn.dispatchEvent(new MouseEvent('click'));
      if (!btn.classList.contains('active')) {
        success = false;
      }
    });
    
    return success;
  } catch (error) {
    console.error('Project filters test failed:', error);
    return false;
  }
}

/**
 * Test testimonial slider
 */
function testTestimonialSlider(): boolean {
  try {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const nextBtn = document.querySelector('.testimonial-next');
    const prevBtn = document.querySelector('.testimonial-prev');
    
    if (!testimonialSlider || !nextBtn || !prevBtn) {
      console.error('Testimonial slider elements not found');
      return false;
    }
    
    // Test next button
    nextBtn.dispatchEvent(new MouseEvent('click'));
    
    // Test previous button
    prevBtn.dispatchEvent(new MouseEvent('click'));
    
    return true;
  } catch (error) {
    console.error('Testimonial slider test failed:', error);
    return false;
  }
}

/**
 * Test contact form
 */
function testContactForm(): boolean {
  try {
    const contactForm = document.querySelector('form.contact-form');
    
    if (!contactForm) {
      console.error('Contact form not found');
      return false;
    }
    
    // Test form submission with empty fields (should fail validation)
    const submitEvent = new Event('submit', { cancelable: true });
    const submitted = contactForm.dispatchEvent(submitEvent);
    
    // If the event was cancelled, validation worked
    return !submitted;
  } catch (error) {
    console.error('Contact form test failed:', error);
    return false;
  }
}

/**
 * Test language switching
 */
function testLanguageSwitching(): boolean {
  try {
    const languageSwitcher = document.querySelector('.language-switcher');
    
    if (!languageSwitcher) {
      console.error('Language switcher not found');
      return false;
    }
    
    // Get current language
    const currentLang = document.documentElement.lang;
    
    // Trigger language change event
    document.dispatchEvent(new CustomEvent('language:changed'));
    
    return true;
  } catch (error) {
    console.error('Language switching test failed:', error);
    return false;
  }
}

/**
 * Test component loading
 */
function testComponentLoading(): boolean {
  try {
    const components = document.querySelectorAll('[data-component]');
    
    if (components.length === 0) {
      console.error('No components found');
      return false;
    }
    
    // Check if components have content
    let allLoaded = true;
    components.forEach(component => {
      if (component.children.length === 0) {
        allLoaded = false;
      }
    });
    
    return allLoaded;
  } catch (error) {
    console.error('Component loading test failed:', error);
    return false;
  }
}

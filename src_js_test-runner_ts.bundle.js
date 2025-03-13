"use strict";
(self["webpackChunkvelora_tech_website"] = self["webpackChunkvelora_tech_website"] || []).push([["src_js_test-runner_ts"],{

/***/ "./src/js/test-runner.ts":
/*!*******************************!*\
  !*** ./src/js/test-runner.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test-utils */ "./src/js/test-utils.ts");
/**
 * Test Runner for Velora Tech Website
 * Used to verify TypeScript migration functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for components to be loaded before running tests
    document.addEventListener('components:all-loaded', () => {
        console.log('Running TypeScript migration tests...');
        // Run all functional tests
        const testResults = (0,_test_utils__WEBPACK_IMPORTED_MODULE_0__.runFunctionalTests)();
        // Display test results
        console.log('Test Results:');
        console.table(testResults);
        // Check if all tests passed
        const allPassed = Object.values(testResults).every(result => result === true);
        if (allPassed) {
            console.log('%c All tests passed! TypeScript migration successful.', 'color: green; font-weight: bold;');
        }
        else {
            console.log('%c Some tests failed. Check the results table for details.', 'color: red; font-weight: bold;');
            // Log failed tests
            const failedTests = Object.entries(testResults)
                .filter(([_, result]) => result === false)
                .map(([name]) => name);
            console.log('Failed tests:', failedTests);
        }
    });
});


/***/ }),

/***/ "./src/js/test-utils.ts":
/*!******************************!*\
  !*** ./src/js/test-utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runFunctionalTests: () => (/* binding */ runFunctionalTests)
/* harmony export */ });
/**
 * Test utilities for Velora Tech website
 * Used to verify TypeScript migration functionality
 */
/**
 * Test all core functionality of the website
 * @returns Object with test results
 */
function runFunctionalTests() {
    const results = {};
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
function testNavigation() {
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
    }
    catch (error) {
        console.error('Navigation test failed:', error);
        return false;
    }
}
/**
 * Test cursor effect
 */
function testCursorEffect() {
    try {
        const cursorGlow = document.querySelector('.cursor-glow');
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
    }
    catch (error) {
        console.error('Cursor effect test failed:', error);
        return false;
    }
}
/**
 * Test animations
 */
function testAnimations() {
    try {
        // Test scroll animations
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
        // Check if any elements have the 'revealed' class
        const revealedElements = document.querySelectorAll('.revealed');
        return revealedElements.length > 0;
    }
    catch (error) {
        console.error('Animations test failed:', error);
        return false;
    }
}
/**
 * Test project filters
 */
function testProjectFilters() {
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
    }
    catch (error) {
        console.error('Project filters test failed:', error);
        return false;
    }
}
/**
 * Test testimonial slider
 */
function testTestimonialSlider() {
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
    }
    catch (error) {
        console.error('Testimonial slider test failed:', error);
        return false;
    }
}
/**
 * Test contact form
 */
function testContactForm() {
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
    }
    catch (error) {
        console.error('Contact form test failed:', error);
        return false;
    }
}
/**
 * Test language switching
 */
function testLanguageSwitching() {
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
    }
    catch (error) {
        console.error('Language switching test failed:', error);
        return false;
    }
}
/**
 * Test component loading
 */
function testComponentLoading() {
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
    }
    catch (error) {
        console.error('Component loading test failed:', error);
        return false;
    }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Z0M7UUFDaEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFFNUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxvQkFBb0I7SUFDM0IsSUFBSSxDQUFDO1FBQ0gsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFakUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxtQ0FBbUM7UUFDbkMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUNwQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvdGVzdC1ydW5uZXIudHMiLCJ3ZWJwYWNrOi8vdmVsb3JhLXRlY2gtd2Vic2l0ZS8uL3NyYy9qcy90ZXN0LXV0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdCBSdW5uZXIgZm9yIFZlbG9yYSBUZWNoIFdlYnNpdGVcbiAqIFVzZWQgdG8gdmVyaWZ5IFR5cGVTY3JpcHQgbWlncmF0aW9uIGZ1bmN0aW9uYWxpdHlcbiAqL1xuXG5pbXBvcnQgeyBydW5GdW5jdGlvbmFsVGVzdHMgfSBmcm9tICcuL3Rlc3QtdXRpbHMnO1xuXG4vLyBXYWl0IGZvciB0aGUgRE9NIHRvIGJlIGZ1bGx5IGxvYWRlZFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgLy8gV2FpdCBmb3IgY29tcG9uZW50cyB0byBiZSBsb2FkZWQgYmVmb3JlIHJ1bm5pbmcgdGVzdHNcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9uZW50czphbGwtbG9hZGVkJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdSdW5uaW5nIFR5cGVTY3JpcHQgbWlncmF0aW9uIHRlc3RzLi4uJyk7XG4gICAgXG4gICAgLy8gUnVuIGFsbCBmdW5jdGlvbmFsIHRlc3RzXG4gICAgY29uc3QgdGVzdFJlc3VsdHMgPSBydW5GdW5jdGlvbmFsVGVzdHMoKTtcbiAgICBcbiAgICAvLyBEaXNwbGF5IHRlc3QgcmVzdWx0c1xuICAgIGNvbnNvbGUubG9nKCdUZXN0IFJlc3VsdHM6Jyk7XG4gICAgY29uc29sZS50YWJsZSh0ZXN0UmVzdWx0cyk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgYWxsIHRlc3RzIHBhc3NlZFxuICAgIGNvbnN0IGFsbFBhc3NlZCA9IE9iamVjdC52YWx1ZXModGVzdFJlc3VsdHMpLmV2ZXJ5KHJlc3VsdCA9PiByZXN1bHQgPT09IHRydWUpO1xuICAgIFxuICAgIGlmIChhbGxQYXNzZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCclYyBBbGwgdGVzdHMgcGFzc2VkISBUeXBlU2NyaXB0IG1pZ3JhdGlvbiBzdWNjZXNzZnVsLicsICdjb2xvcjogZ3JlZW47IGZvbnQtd2VpZ2h0OiBib2xkOycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnJWMgU29tZSB0ZXN0cyBmYWlsZWQuIENoZWNrIHRoZSByZXN1bHRzIHRhYmxlIGZvciBkZXRhaWxzLicsICdjb2xvcjogcmVkOyBmb250LXdlaWdodDogYm9sZDsnKTtcbiAgICAgIFxuICAgICAgLy8gTG9nIGZhaWxlZCB0ZXN0c1xuICAgICAgY29uc3QgZmFpbGVkVGVzdHMgPSBPYmplY3QuZW50cmllcyh0ZXN0UmVzdWx0cylcbiAgICAgICAgLmZpbHRlcigoW18sIHJlc3VsdF0pID0+IHJlc3VsdCA9PT0gZmFsc2UpXG4gICAgICAgIC5tYXAoKFtuYW1lXSkgPT4gbmFtZSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdGVzdHM6JywgZmFpbGVkVGVzdHMpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIi8qKlxuICogVGVzdCB1dGlsaXRpZXMgZm9yIFZlbG9yYSBUZWNoIHdlYnNpdGVcbiAqIFVzZWQgdG8gdmVyaWZ5IFR5cGVTY3JpcHQgbWlncmF0aW9uIGZ1bmN0aW9uYWxpdHlcbiAqL1xuXG4vKipcbiAqIFRlc3QgYWxsIGNvcmUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgd2Vic2l0ZVxuICogQHJldHVybnMgT2JqZWN0IHdpdGggdGVzdCByZXN1bHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5GdW5jdGlvbmFsVGVzdHMoKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xuICBjb25zdCByZXN1bHRzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuICBcbiAgLy8gVGVzdCBuYXZpZ2F0aW9uIGZ1bmN0aW9uYWxpdHlcbiAgcmVzdWx0c1snbmF2aWdhdGlvbiddID0gdGVzdE5hdmlnYXRpb24oKTtcbiAgXG4gIC8vIFRlc3QgY3Vyc29yIGVmZmVjdFxuICByZXN1bHRzWydjdXJzb3InXSA9IHRlc3RDdXJzb3JFZmZlY3QoKTtcbiAgXG4gIC8vIFRlc3QgYW5pbWF0aW9uc1xuICByZXN1bHRzWydhbmltYXRpb25zJ10gPSB0ZXN0QW5pbWF0aW9ucygpO1xuICBcbiAgLy8gVGVzdCBwcm9qZWN0IGZpbHRlcnNcbiAgcmVzdWx0c1sncHJvamVjdHMnXSA9IHRlc3RQcm9qZWN0RmlsdGVycygpO1xuICBcbiAgLy8gVGVzdCB0ZXN0aW1vbmlhbCBzbGlkZXJcbiAgcmVzdWx0c1sndGVzdGltb25pYWxzJ10gPSB0ZXN0VGVzdGltb25pYWxTbGlkZXIoKTtcbiAgXG4gIC8vIFRlc3QgY29udGFjdCBmb3JtXG4gIHJlc3VsdHNbJ2NvbnRhY3QnXSA9IHRlc3RDb250YWN0Rm9ybSgpO1xuICBcbiAgLy8gVGVzdCBsYW5ndWFnZSBzd2l0Y2hpbmdcbiAgcmVzdWx0c1snbGFuZ3VhZ2UnXSA9IHRlc3RMYW5ndWFnZVN3aXRjaGluZygpO1xuICBcbiAgLy8gVGVzdCBjb21wb25lbnQgbG9hZGluZ1xuICByZXN1bHRzWydjb21wb25lbnRzJ10gPSB0ZXN0Q29tcG9uZW50TG9hZGluZygpO1xuICBcbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbi8qKlxuICogVGVzdCBuYXZpZ2F0aW9uIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZnVuY3Rpb24gdGVzdE5hdmlnYXRpb24oKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZGVyJyk7XG4gICAgY29uc3QgaGFtYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlcicpO1xuICAgIGNvbnN0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1saW5rcycpO1xuICAgIFxuICAgIGlmICghaGVhZGVyIHx8ICFoYW1idXJnZXIgfHwgIW5hdkxpbmtzKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdOYXZpZ2F0aW9uIGVsZW1lbnRzIG5vdCBmb3VuZCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IHNjcm9sbCBldmVudFxuICAgIGNvbnN0IHNjcm9sbEV2ZW50ID0gbmV3IEV2ZW50KCdzY3JvbGwnKTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChzY3JvbGxFdmVudCk7XG4gICAgXG4gICAgLy8gVGVzdCBoYW1idXJnZXIgY2xpY2tcbiAgICBoYW1idXJnZXIuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snKSk7XG4gICAgY29uc3QgbW9iaWxlTWVudUFjdGl2ZSA9IG5hdkxpbmtzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJyk7XG4gICAgaGFtYnVyZ2VyLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJykpO1xuICAgIFxuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ05hdmlnYXRpb24gdGVzdCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgY3Vyc29yIGVmZmVjdFxuICovXG5mdW5jdGlvbiB0ZXN0Q3Vyc29yRWZmZWN0KCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIGNvbnN0IGN1cnNvckdsb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLWdsb3cnKSBhcyBIVE1MRWxlbWVudDtcbiAgICBcbiAgICBpZiAoIWN1cnNvckdsb3cpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0N1cnNvciBnbG93IGVsZW1lbnQgbm90IGZvdW5kJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgbW91c2UgbW92ZW1lbnRcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KCdtb3VzZW1vdmUnLCB7XG4gICAgICBjbGllbnRYOiAxMDAsXG4gICAgICBjbGllbnRZOiAxMDBcbiAgICB9KSk7XG4gICAgXG4gICAgcmV0dXJuIGN1cnNvckdsb3cuc3R5bGUub3BhY2l0eSAhPT0gJyc7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignQ3Vyc29yIGVmZmVjdCB0ZXN0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogVGVzdCBhbmltYXRpb25zXG4gKi9cbmZ1bmN0aW9uIHRlc3RBbmltYXRpb25zKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFRlc3Qgc2Nyb2xsIGFuaW1hdGlvbnNcbiAgICBjb25zdCBzY3JvbGxFdmVudCA9IG5ldyBFdmVudCgnc2Nyb2xsJyk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoc2Nyb2xsRXZlbnQpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIGFueSBlbGVtZW50cyBoYXZlIHRoZSAncmV2ZWFsZWQnIGNsYXNzXG4gICAgY29uc3QgcmV2ZWFsZWRFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXZlYWxlZCcpO1xuICAgIFxuICAgIHJldHVybiByZXZlYWxlZEVsZW1lbnRzLmxlbmd0aCA+IDA7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignQW5pbWF0aW9ucyB0ZXN0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogVGVzdCBwcm9qZWN0IGZpbHRlcnNcbiAqL1xuZnVuY3Rpb24gdGVzdFByb2plY3RGaWx0ZXJzKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbHRlckJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyLWJ0bicpO1xuICAgIFxuICAgIGlmIChmaWx0ZXJCdG5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS5lcnJvcignUHJvamVjdCBmaWx0ZXIgYnV0dG9ucyBub3QgZm91bmQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gVGVzdCBjbGlja2luZyBlYWNoIGZpbHRlciBidXR0b25cbiAgICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gICAgZmlsdGVyQnRucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICBidG4uZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snKSk7XG4gICAgICBpZiAoIWJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQcm9qZWN0IGZpbHRlcnMgdGVzdCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgdGVzdGltb25pYWwgc2xpZGVyXG4gKi9cbmZ1bmN0aW9uIHRlc3RUZXN0aW1vbmlhbFNsaWRlcigpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0ZXN0aW1vbmlhbFNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0aW1vbmlhbC1zbGlkZXInKTtcbiAgICBjb25zdCBuZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3RpbW9uaWFsLW5leHQnKTtcbiAgICBjb25zdCBwcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3RpbW9uaWFsLXByZXYnKTtcbiAgICBcbiAgICBpZiAoIXRlc3RpbW9uaWFsU2xpZGVyIHx8ICFuZXh0QnRuIHx8ICFwcmV2QnRuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXN0aW1vbmlhbCBzbGlkZXIgZWxlbWVudHMgbm90IGZvdW5kJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIC8vIFRlc3QgbmV4dCBidXR0b25cbiAgICBuZXh0QnRuLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJykpO1xuICAgIFxuICAgIC8vIFRlc3QgcHJldmlvdXMgYnV0dG9uXG4gICAgcHJldkJ0bi5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KCdjbGljaycpKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdUZXN0aW1vbmlhbCBzbGlkZXIgdGVzdCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgY29udGFjdCBmb3JtXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250YWN0Rm9ybSgpOiBib29sZWFuIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb250YWN0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0uY29udGFjdC1mb3JtJyk7XG4gICAgXG4gICAgaWYgKCFjb250YWN0Rm9ybSkge1xuICAgICAgY29uc29sZS5lcnJvcignQ29udGFjdCBmb3JtIG5vdCBmb3VuZCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBUZXN0IGZvcm0gc3VibWlzc2lvbiB3aXRoIGVtcHR5IGZpZWxkcyAoc2hvdWxkIGZhaWwgdmFsaWRhdGlvbilcbiAgICBjb25zdCBzdWJtaXRFdmVudCA9IG5ldyBFdmVudCgnc3VibWl0JywgeyBjYW5jZWxhYmxlOiB0cnVlIH0pO1xuICAgIGNvbnN0IHN1Ym1pdHRlZCA9IGNvbnRhY3RGb3JtLmRpc3BhdGNoRXZlbnQoc3VibWl0RXZlbnQpO1xuICAgIFxuICAgIC8vIElmIHRoZSBldmVudCB3YXMgY2FuY2VsbGVkLCB2YWxpZGF0aW9uIHdvcmtlZFxuICAgIHJldHVybiAhc3VibWl0dGVkO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnRhY3QgZm9ybSB0ZXN0IGZhaWxlZDonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogVGVzdCBsYW5ndWFnZSBzd2l0Y2hpbmdcbiAqL1xuZnVuY3Rpb24gdGVzdExhbmd1YWdlU3dpdGNoaW5nKCk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIGNvbnN0IGxhbmd1YWdlU3dpdGNoZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZ3VhZ2Utc3dpdGNoZXInKTtcbiAgICBcbiAgICBpZiAoIWxhbmd1YWdlU3dpdGNoZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0xhbmd1YWdlIHN3aXRjaGVyIG5vdCBmb3VuZCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBHZXQgY3VycmVudCBsYW5ndWFnZVxuICAgIGNvbnN0IGN1cnJlbnRMYW5nID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XG4gICAgXG4gICAgLy8gVHJpZ2dlciBsYW5ndWFnZSBjaGFuZ2UgZXZlbnRcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbGFuZ3VhZ2U6Y2hhbmdlZCcpKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdMYW5ndWFnZSBzd2l0Y2hpbmcgdGVzdCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgY29tcG9uZW50IGxvYWRpbmdcbiAqL1xuZnVuY3Rpb24gdGVzdENvbXBvbmVudExvYWRpbmcoKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudF0nKTtcbiAgICBcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIGNvbXBvbmVudHMgZm91bmQnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgY29tcG9uZW50cyBoYXZlIGNvbnRlbnRcbiAgICBsZXQgYWxsTG9hZGVkID0gdHJ1ZTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50ID0+IHtcbiAgICAgIGlmIChjb21wb25lbnQuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsbExvYWRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBhbGxMb2FkZWQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignQ29tcG9uZW50IGxvYWRpbmcgdGVzdCBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
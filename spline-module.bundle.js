"use strict";
(self["webpackChunkvelora_tech_website"] = self["webpackChunkvelora_tech_website"] || []).push([["spline-module"],{

/***/ "./src/js/modules/spline-viewer.ts":
/*!*****************************************!*\
  !*** ./src/js/modules/spline-viewer.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initSplineViewer: () => (/* binding */ initSplineViewer)
/* harmony export */ });
/* harmony import */ var _splinetool_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @splinetool/runtime */ "./node_modules/@splinetool/runtime/build/runtime.js");
/**
 * Spline Viewer Module
 * Specialized module for handling the WebGL-based Spline 3D scene viewer
 */

// Scene URLs
// Updated scene URLs to use more reliable scenes
const PRIMARY_SCENE_URL = 'https://prod.spline.design/cj6GSivfEQ9lqQqm/scene.splinecode';
const FALLBACK_SCENE_URL = 'https://prod.spline.design/PeK7bqAMQsRjbTZN/scene.splinecode';
// Timeout in milliseconds for scene loading
const LOAD_TIMEOUT = 30000;
// Track if Spline has been loaded already to prevent reloading on language changes
let splineInitialized = false;
/**
 * Initialize the Spline viewer after components are loaded
 */
function initSplineViewer() {
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSplineViewer);
    }
    else {
        setupSplineViewer();
    }
    // Listen for language changes to show the correct loading message but NOT reinitialize the scene
    document.addEventListener('language:changed', () => {
        console.log('Language changed, updating Spline loading message only');
        updateSplineLoadingMessage();
    });
}
/**
 * Update Spline loading message text without reinitializing the scene
 */
function updateSplineLoadingMessage() {
    // Only update the loading message text, don't reload the scene
    const loadingElements = document.querySelectorAll('.spline-loading');
    loadingElements.forEach(element => {
        // If scene is already loaded, we don't need to do anything
        if (splineInitialized)
            return;
        // Update visibility but don't reinitialize the Spline scene
        const parentContainer = element.closest('.spline-scene');
        if (parentContainer) {
            const loadingText = element.querySelector('p');
            if (loadingText) {
                // Keep the loading message visible until Spline is fully initialized
                if (!splineInitialized) {
                    element.classList.add('visible');
                }
            }
        }
    });
}
/**
 * Set up the Spline viewer
 */
function setupSplineViewer() {
    // Skip initialization if Spline has already been loaded
    if (splineInitialized) {
        console.log('Spline viewer already initialized, skipping setup');
        return;
    }
    // Wait for all components to be loaded
    setTimeout(() => {
        const container = document.getElementById('spline-canvas-container');
        if (!container) {
            console.error('Spline canvas container not found');
            return;
        }
        console.log('Setting up Spline viewer');
        // Show loading spinner immediately
        const loadingElement = document.querySelector('.spline-loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.classList.add('visible');
        }
        loadSplineScene(container, PRIMARY_SCENE_URL);
    }, 1000); // Give extra time for DOM to be fully rendered
}
/**
 * Load the Spline scene with proper error handling
 * @param container - The container element for the Spline scene
 * @param sceneUrl - URL of the Spline scene to load
 */
function loadSplineScene(container, sceneUrl) {
    try {
        console.log(`Loading Spline scene from: ${sceneUrl}`);
        // Show loading indicator
        const loadingElement = container.parentElement?.querySelector('.spline-loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.classList.add('visible');
        }
        // Hide error message if visible
        const errorElement = container.parentElement?.querySelector('.spline-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        // Create canvas with explicit dimensions
        const canvas = document.createElement('canvas');
        // Make sure canvas has dimensions before WebGL context creation
        setExplicitCanvasDimensions(canvas, container);
        // Add canvas to container
        container.innerHTML = '';
        container.appendChild(canvas);
        // Initialize the Spline application
        const app = new _splinetool_runtime__WEBPACK_IMPORTED_MODULE_0__.Application(canvas);
        // Set background color to match website
        app.setBackgroundColor('#080815'); // Match --darker-bg variable
        // Load the scene with timeout
        const loadPromise = app.load(sceneUrl);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Scene loading timed out')), LOAD_TIMEOUT);
        });
        // Handle loading with timeout
        Promise.race([loadPromise, timeoutPromise])
            .then(() => {
            console.log('Spline scene loaded successfully');
            // Hide loading indicator
            if (loadingElement) {
                loadingElement.style.display = 'none';
                loadingElement.classList.remove('visible');
            }
            // Mark as initialized to prevent reloading
            splineInitialized = true;
        })
            .catch((error) => {
            console.error('Error loading Spline scene:', error);
            // Try fallback URL if we weren't already using it
            if (sceneUrl !== FALLBACK_SCENE_URL) {
                console.log('Trying fallback Spline scene');
                loadSplineScene(container, FALLBACK_SCENE_URL);
            }
            else {
                // If both primary and fallback fail, try a static fallback
                tryStaticFallback(container);
            }
        });
    }
    catch (error) {
        console.error('Failed to initialize Spline scene:', error);
        tryStaticFallback(container);
    }
}
/**
 * Try to load a static fallback when both Spline scenes fail
 * @param container - The container element
 */
function tryStaticFallback(container) {
    console.log('Both Spline scenes failed, showing static fallback');
    // Hide loading indicator
    const loadingElement = container.parentElement?.querySelector('.spline-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
        loadingElement.classList.remove('visible');
    }
    // Show static fallback
    const fallbackElement = container.parentElement?.querySelector('.spline-fallback');
    if (fallbackElement) {
        fallbackElement.style.display = 'block';
    }
    else {
        // Show error message if fallback is not available
        showErrorMessage(container);
    }
    // Mark as initialized to prevent reload attempts
    splineInitialized = true;
}
/**
 * Set explicit dimensions on canvas to prevent WebGL errors
 * @param canvas - The canvas element
 * @param container - The container element
 */
function setExplicitCanvasDimensions(canvas, container) {
    // Get container dimensions
    const containerWidth = container.clientWidth || container.offsetWidth;
    const containerHeight = container.clientHeight || container.offsetHeight;
    // Set minimum dimensions if container is too small
    const width = Math.max(containerWidth, 400);
    const height = Math.max(containerHeight, 400);
    // Set canvas style dimensions (for display)
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // Set canvas actual dimensions (for WebGL context)
    canvas.width = width;
    canvas.height = height;
    console.log(`Canvas dimensions set to: ${width}x${height}`);
}
/**
 * Show error message when scene fails to load
 * @param container - The container element
 */
function showErrorMessage(container) {
    // Hide loading indicator
    const loadingElement = container.parentElement?.querySelector('.spline-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
        loadingElement.classList.remove('visible');
    }
    // Show error message
    const errorElement = container.parentElement?.querySelector('.spline-error');
    if (errorElement) {
        errorElement.style.display = 'flex';
    }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q25ELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTlDLDRDQUE0QztJQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7SUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBRTdCLG1EQUFtRDtJQUNuRCxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUV2QixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixLQUFLLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxTQUFzQjtJQUM1Qyx5QkFBeUI7SUFDekIsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsaUJBQWlCLENBQWdCLENBQUM7SUFDaEcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQixjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHFCQUFxQjtJQUNyQixNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxlQUFlLENBQWdCLENBQUM7SUFDNUYsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNmLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN4QyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZlbG9yYS10ZWNoLXdlYnNpdGUvLi9zcmMvanMvbW9kdWxlcy9zcGxpbmUtdmlld2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3BsaW5lIFZpZXdlciBNb2R1bGVcbiAqIFNwZWNpYWxpemVkIG1vZHVsZSBmb3IgaGFuZGxpbmcgdGhlIFdlYkdMLWJhc2VkIFNwbGluZSAzRCBzY2VuZSB2aWV3ZXJcbiAqL1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ0BzcGxpbmV0b29sL3J1bnRpbWUnO1xuXG4vLyBTY2VuZSBVUkxzXG4vLyBVcGRhdGVkIHNjZW5lIFVSTHMgdG8gdXNlIG1vcmUgcmVsaWFibGUgc2NlbmVzXG5jb25zdCBQUklNQVJZX1NDRU5FX1VSTCA9ICdodHRwczovL3Byb2Quc3BsaW5lLmRlc2lnbi9jajZHU2l2ZkVROWxxUXFtL3NjZW5lLnNwbGluZWNvZGUnO1xuY29uc3QgRkFMTEJBQ0tfU0NFTkVfVVJMID0gJ2h0dHBzOi8vcHJvZC5zcGxpbmUuZGVzaWduL1BlSzdicUFNUXNSamJUWk4vc2NlbmUuc3BsaW5lY29kZSc7XG5cbi8vIFRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIGZvciBzY2VuZSBsb2FkaW5nXG5jb25zdCBMT0FEX1RJTUVPVVQgPSAzMDAwMDtcblxuLy8gVHJhY2sgaWYgU3BsaW5lIGhhcyBiZWVuIGxvYWRlZCBhbHJlYWR5IHRvIHByZXZlbnQgcmVsb2FkaW5nIG9uIGxhbmd1YWdlIGNoYW5nZXNcbmxldCBzcGxpbmVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIFNwbGluZSB2aWV3ZXIgYWZ0ZXIgY29tcG9uZW50cyBhcmUgbG9hZGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U3BsaW5lVmlld2VyKCk6IHZvaWQge1xuICAgIC8vIFdhaXQgZm9yIHRoZSBET00gdG8gYmUgZnVsbHkgbG9hZGVkXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgc2V0dXBTcGxpbmVWaWV3ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldHVwU3BsaW5lVmlld2VyKCk7XG4gICAgfVxuICAgIFxuICAgIC8vIExpc3RlbiBmb3IgbGFuZ3VhZ2UgY2hhbmdlcyB0byBzaG93IHRoZSBjb3JyZWN0IGxvYWRpbmcgbWVzc2FnZSBidXQgTk9UIHJlaW5pdGlhbGl6ZSB0aGUgc2NlbmVcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsYW5ndWFnZTpjaGFuZ2VkJywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnTGFuZ3VhZ2UgY2hhbmdlZCwgdXBkYXRpbmcgU3BsaW5lIGxvYWRpbmcgbWVzc2FnZSBvbmx5Jyk7XG4gICAgICAgIHVwZGF0ZVNwbGluZUxvYWRpbmdNZXNzYWdlKCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogVXBkYXRlIFNwbGluZSBsb2FkaW5nIG1lc3NhZ2UgdGV4dCB3aXRob3V0IHJlaW5pdGlhbGl6aW5nIHRoZSBzY2VuZVxuICovXG5mdW5jdGlvbiB1cGRhdGVTcGxpbmVMb2FkaW5nTWVzc2FnZSgpOiB2b2lkIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgbG9hZGluZyBtZXNzYWdlIHRleHQsIGRvbid0IHJlbG9hZCB0aGUgc2NlbmVcbiAgICBjb25zdCBsb2FkaW5nRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3BsaW5lLWxvYWRpbmcnKTtcbiAgICBcbiAgICBsb2FkaW5nRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgLy8gSWYgc2NlbmUgaXMgYWxyZWFkeSBsb2FkZWQsIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmdcbiAgICAgICAgaWYgKHNwbGluZUluaXRpYWxpemVkKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICAvLyBVcGRhdGUgdmlzaWJpbGl0eSBidXQgZG9uJ3QgcmVpbml0aWFsaXplIHRoZSBTcGxpbmUgc2NlbmVcbiAgICAgICAgY29uc3QgcGFyZW50Q29udGFpbmVyID0gZWxlbWVudC5jbG9zZXN0KCcuc3BsaW5lLXNjZW5lJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmIChwYXJlbnRDb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRpbmdUZXh0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdwJyk7XG4gICAgICAgICAgICBpZiAobG9hZGluZ1RleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBLZWVwIHRoZSBsb2FkaW5nIG1lc3NhZ2UgdmlzaWJsZSB1bnRpbCBTcGxpbmUgaXMgZnVsbHkgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICBpZiAoIXNwbGluZUluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqIFNldCB1cCB0aGUgU3BsaW5lIHZpZXdlclxuICovXG5mdW5jdGlvbiBzZXR1cFNwbGluZVZpZXdlcigpOiB2b2lkIHtcbiAgICAvLyBTa2lwIGluaXRpYWxpemF0aW9uIGlmIFNwbGluZSBoYXMgYWxyZWFkeSBiZWVuIGxvYWRlZFxuICAgIGlmIChzcGxpbmVJbml0aWFsaXplZCkge1xuICAgICAgICBjb25zb2xlLmxvZygnU3BsaW5lIHZpZXdlciBhbHJlYWR5IGluaXRpYWxpemVkLCBza2lwcGluZyBzZXR1cCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vIFdhaXQgZm9yIGFsbCBjb21wb25lbnRzIHRvIGJlIGxvYWRlZFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BsaW5lLWNhbnZhcy1jb250YWluZXInKTtcbiAgICAgICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NwbGluZSBjYW52YXMgY29udGFpbmVyIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZygnU2V0dGluZyB1cCBTcGxpbmUgdmlld2VyJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBTaG93IGxvYWRpbmcgc3Bpbm5lciBpbW1lZGlhdGVseVxuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtbG9hZGluZycpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAobG9hZGluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGxvYWRpbmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgICAgICAgICBsb2FkaW5nRWxlbWVudC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxvYWRTcGxpbmVTY2VuZShjb250YWluZXIsIFBSSU1BUllfU0NFTkVfVVJMKTtcbiAgICB9LCAxMDAwKTsgLy8gR2l2ZSBleHRyYSB0aW1lIGZvciBET00gdG8gYmUgZnVsbHkgcmVuZGVyZWRcbn1cblxuLyoqXG4gKiBMb2FkIHRoZSBTcGxpbmUgc2NlbmUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcbiAqIEBwYXJhbSBjb250YWluZXIgLSBUaGUgY29udGFpbmVyIGVsZW1lbnQgZm9yIHRoZSBTcGxpbmUgc2NlbmVcbiAqIEBwYXJhbSBzY2VuZVVybCAtIFVSTCBvZiB0aGUgU3BsaW5lIHNjZW5lIHRvIGxvYWRcbiAqL1xuZnVuY3Rpb24gbG9hZFNwbGluZVNjZW5lKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHNjZW5lVXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhgTG9hZGluZyBTcGxpbmUgc2NlbmUgZnJvbTogJHtzY2VuZVVybH1gKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNob3cgbG9hZGluZyBpbmRpY2F0b3JcbiAgICAgICAgY29uc3QgbG9hZGluZ0VsZW1lbnQgPSBjb250YWluZXIucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLnNwbGluZS1sb2FkaW5nJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmIChsb2FkaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgbG9hZGluZ0VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgICAgIGxvYWRpbmdFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gSGlkZSBlcnJvciBtZXNzYWdlIGlmIHZpc2libGVcbiAgICAgICAgY29uc3QgZXJyb3JFbGVtZW50ID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtZXJyb3InKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKGVycm9yRWxlbWVudCkge1xuICAgICAgICAgICAgZXJyb3JFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBjYW52YXMgd2l0aCBleHBsaWNpdCBkaW1lbnNpb25zXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBcbiAgICAgICAgLy8gTWFrZSBzdXJlIGNhbnZhcyBoYXMgZGltZW5zaW9ucyBiZWZvcmUgV2ViR0wgY29udGV4dCBjcmVhdGlvblxuICAgICAgICBzZXRFeHBsaWNpdENhbnZhc0RpbWVuc2lvbnMoY2FudmFzLCBjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWRkIGNhbnZhcyB0byBjb250YWluZXJcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIFNwbGluZSBhcHBsaWNhdGlvblxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oY2FudmFzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNldCBiYWNrZ3JvdW5kIGNvbG9yIHRvIG1hdGNoIHdlYnNpdGVcbiAgICAgICAgYXBwLnNldEJhY2tncm91bmRDb2xvcignIzA4MDgxNScpOyAvLyBNYXRjaCAtLWRhcmtlci1iZyB2YXJpYWJsZVxuICAgICAgICBcbiAgICAgICAgLy8gTG9hZCB0aGUgc2NlbmUgd2l0aCB0aW1lb3V0XG4gICAgICAgIGNvbnN0IGxvYWRQcm9taXNlID0gYXBwLmxvYWQoc2NlbmVVcmwpO1xuICAgICAgICBjb25zdCB0aW1lb3V0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChfLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcignU2NlbmUgbG9hZGluZyB0aW1lZCBvdXQnKSksIExPQURfVElNRU9VVCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gSGFuZGxlIGxvYWRpbmcgd2l0aCB0aW1lb3V0XG4gICAgICAgIFByb21pc2UucmFjZShbbG9hZFByb21pc2UsIHRpbWVvdXRQcm9taXNlXSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3BsaW5lIHNjZW5lIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAvLyBIaWRlIGxvYWRpbmcgaW5kaWNhdG9yXG4gICAgICAgICAgICAgICAgaWYgKGxvYWRpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gTWFyayBhcyBpbml0aWFsaXplZCB0byBwcmV2ZW50IHJlbG9hZGluZ1xuICAgICAgICAgICAgICAgIHNwbGluZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBTcGxpbmUgc2NlbmU6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRyeSBmYWxsYmFjayBVUkwgaWYgd2Ugd2VyZW4ndCBhbHJlYWR5IHVzaW5nIGl0XG4gICAgICAgICAgICAgICAgaWYgKHNjZW5lVXJsICE9PSBGQUxMQkFDS19TQ0VORV9VUkwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RyeWluZyBmYWxsYmFjayBTcGxpbmUgc2NlbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFNwbGluZVNjZW5lKGNvbnRhaW5lciwgRkFMTEJBQ0tfU0NFTkVfVVJMKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBib3RoIHByaW1hcnkgYW5kIGZhbGxiYWNrIGZhaWwsIHRyeSBhIHN0YXRpYyBmYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICB0cnlTdGF0aWNGYWxsYmFjayhjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgU3BsaW5lIHNjZW5lOicsIGVycm9yKTtcbiAgICAgICAgdHJ5U3RhdGljRmFsbGJhY2soY29udGFpbmVyKTtcbiAgICB9XG59XG5cbi8qKlxuICogVHJ5IHRvIGxvYWQgYSBzdGF0aWMgZmFsbGJhY2sgd2hlbiBib3RoIFNwbGluZSBzY2VuZXMgZmFpbFxuICogQHBhcmFtIGNvbnRhaW5lciAtIFRoZSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiB0cnlTdGF0aWNGYWxsYmFjayhjb250YWluZXI6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ0JvdGggU3BsaW5lIHNjZW5lcyBmYWlsZWQsIHNob3dpbmcgc3RhdGljIGZhbGxiYWNrJyk7XG4gICAgXG4gICAgLy8gSGlkZSBsb2FkaW5nIGluZGljYXRvclxuICAgIGNvbnN0IGxvYWRpbmdFbGVtZW50ID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtbG9hZGluZycpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChsb2FkaW5nRWxlbWVudCkge1xuICAgICAgICBsb2FkaW5nRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBsb2FkaW5nRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFNob3cgc3RhdGljIGZhbGxiYWNrXG4gICAgY29uc3QgZmFsbGJhY2tFbGVtZW50ID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtZmFsbGJhY2snKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoZmFsbGJhY2tFbGVtZW50KSB7XG4gICAgICAgIGZhbGxiYWNrRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTaG93IGVycm9yIG1lc3NhZ2UgaWYgZmFsbGJhY2sgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICBzaG93RXJyb3JNZXNzYWdlKGNvbnRhaW5lcik7XG4gICAgfVxuICAgIFxuICAgIC8vIE1hcmsgYXMgaW5pdGlhbGl6ZWQgdG8gcHJldmVudCByZWxvYWQgYXR0ZW1wdHNcbiAgICBzcGxpbmVJbml0aWFsaXplZCA9IHRydWU7XG59XG5cbi8qKlxuICogU2V0IGV4cGxpY2l0IGRpbWVuc2lvbnMgb24gY2FudmFzIHRvIHByZXZlbnQgV2ViR0wgZXJyb3JzXG4gKiBAcGFyYW0gY2FudmFzIC0gVGhlIGNhbnZhcyBlbGVtZW50XG4gKiBAcGFyYW0gY29udGFpbmVyIC0gVGhlIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHNldEV4cGxpY2l0Q2FudmFzRGltZW5zaW9ucyhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjb250YWluZXI6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgLy8gR2V0IGNvbnRhaW5lciBkaW1lbnNpb25zXG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGggfHwgY29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5jbGllbnRIZWlnaHQgfHwgY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICBcbiAgICAvLyBTZXQgbWluaW11bSBkaW1lbnNpb25zIGlmIGNvbnRhaW5lciBpcyB0b28gc21hbGxcbiAgICBjb25zdCB3aWR0aCA9IE1hdGgubWF4KGNvbnRhaW5lcldpZHRoLCA0MDApO1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGgubWF4KGNvbnRhaW5lckhlaWdodCwgNDAwKTtcbiAgICBcbiAgICAvLyBTZXQgY2FudmFzIHN0eWxlIGRpbWVuc2lvbnMgKGZvciBkaXNwbGF5KVxuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIFxuICAgIC8vIFNldCBjYW52YXMgYWN0dWFsIGRpbWVuc2lvbnMgKGZvciBXZWJHTCBjb250ZXh0KVxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgXG4gICAgY29uc29sZS5sb2coYENhbnZhcyBkaW1lbnNpb25zIHNldCB0bzogJHt3aWR0aH14JHtoZWlnaHR9YCk7XG59XG5cbi8qKlxuICogU2hvdyBlcnJvciBtZXNzYWdlIHdoZW4gc2NlbmUgZmFpbHMgdG8gbG9hZFxuICogQHBhcmFtIGNvbnRhaW5lciAtIFRoZSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBzaG93RXJyb3JNZXNzYWdlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAvLyBIaWRlIGxvYWRpbmcgaW5kaWNhdG9yXG4gICAgY29uc3QgbG9hZGluZ0VsZW1lbnQgPSBjb250YWluZXIucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignLnNwbGluZS1sb2FkaW5nJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKGxvYWRpbmdFbGVtZW50KSB7XG4gICAgICAgIGxvYWRpbmdFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGxvYWRpbmdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlXG4gICAgY29uc3QgZXJyb3JFbGVtZW50ID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5zcGxpbmUtZXJyb3InKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoZXJyb3JFbGVtZW50KSB7XG4gICAgICAgIGVycm9yRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
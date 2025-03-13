/**
 * Spline Viewer Module
 * Specialized module for handling the WebGL-based Spline 3D scene viewer
 */

import { Application } from '@splinetool/runtime';

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
export function initSplineViewer(): void {
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSplineViewer);
    } else {
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
function updateSplineLoadingMessage(): void {
    // Only update the loading message text, don't reload the scene
    const loadingElements = document.querySelectorAll('.spline-loading');
    
    loadingElements.forEach(element => {
        // If scene is already loaded, we don't need to do anything
        if (splineInitialized) return;
        
        // Update visibility but don't reinitialize the Spline scene
        const parentContainer = element.closest('.spline-scene') as HTMLElement;
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
function setupSplineViewer(): void {
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
        const loadingElement = document.querySelector('.spline-loading') as HTMLElement;
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
function loadSplineScene(container: HTMLElement, sceneUrl: string): void {
    try {
        console.log(`Loading Spline scene from: ${sceneUrl}`);
        
        // Show loading indicator
        const loadingElement = container.parentElement?.querySelector('.spline-loading') as HTMLElement;
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.classList.add('visible');
        }
        
        // Hide error message if visible
        const errorElement = container.parentElement?.querySelector('.spline-error') as HTMLElement;
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
        const app = new Application(canvas);
        
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
                } else {
                    // If both primary and fallback fail, try a static fallback
                    tryStaticFallback(container);
                }
            });
            
    } catch (error) {
        console.error('Failed to initialize Spline scene:', error);
        tryStaticFallback(container);
    }
}

/**
 * Try to load a static fallback when both Spline scenes fail
 * @param container - The container element
 */
function tryStaticFallback(container: HTMLElement): void {
    console.log('Both Spline scenes failed, showing static fallback');
    
    // Hide loading indicator
    const loadingElement = container.parentElement?.querySelector('.spline-loading') as HTMLElement;
    if (loadingElement) {
        loadingElement.style.display = 'none';
        loadingElement.classList.remove('visible');
    }
    
    // Show static fallback
    const fallbackElement = container.parentElement?.querySelector('.spline-fallback') as HTMLElement;
    if (fallbackElement) {
        fallbackElement.style.display = 'block';
    } else {
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
function setExplicitCanvasDimensions(canvas: HTMLCanvasElement, container: HTMLElement): void {
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
function showErrorMessage(container: HTMLElement): void {
    // Hide loading indicator
    const loadingElement = container.parentElement?.querySelector('.spline-loading') as HTMLElement;
    if (loadingElement) {
        loadingElement.style.display = 'none';
        loadingElement.classList.remove('visible');
    }
    
    // Show error message
    const errorElement = container.parentElement?.querySelector('.spline-error') as HTMLElement;
    if (errorElement) {
        errorElement.style.display = 'flex';
    }
}

/**
 * Spline Scene Module
 * Handles loading and rendering of 3D Spline scenes
 */

import { Application } from '@splinetool/runtime';
import '@splinetool/react-spline';
import { mountSplineComponent } from './spline-adapter';

// Fallback scene URL to use if the primary scene fails to load
// Updated scene URLs to use more reliable scenes
const PRIMARY_SCENE_URL = 'https://prod.spline.design/cj6GSivfEQ9lqQqm/scene.splinecode';
const FALLBACK_SCENE_URL = 'https://prod.spline.design/PeK7bqAMQsRjbTZN/scene.splinecode';

/**
 * Initialize Spline Scene in the hero section
 * @param containerId - ID of the container element where the Spline scene will be rendered
 * @param splineUrl - URL to the Spline scene
 */
export function initSplineScene(containerId: string = 'spline-container', splineUrl: string = PRIMARY_SCENE_URL): void {
    const containerElement = document.getElementById(containerId);
    
    if (!containerElement) {
        console.error(`Spline container element with ID "${containerId}" not found`);
        return;
    }
    
    // Ensure container has visible dimensions before initializing
    ensureContainerDimensions(containerElement);
    
    try {
        console.log(`Initializing Spline scene in container #${containerId} with URL: ${splineUrl}`);
        
        // Create a clean container for the Spline scene
        containerElement.innerHTML = '';
        
        // First try runtime API approach (more reliable for WebGL context)
        initWithRuntimeAPI(containerElement, splineUrl);
    } catch (error) {
        console.error('Failed to use runtime API approach, trying React component:', error);
        // Fallback to React component approach
        mountSplineComponent(containerId, splineUrl);
    }
}

/**
 * Ensure container has proper dimensions to avoid WebGL errors
 * @param container - The container element
 */
function ensureContainerDimensions(container: HTMLElement): void {
    // Force a reflow to get accurate dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    console.log(`Container dimensions: ${width}x${height}`);
    
    // Set minimum dimensions if necessary
    if (width < 300 || height < 300) {
        container.style.width = '500px';
        container.style.height = '500px';
        container.style.minWidth = '500px';
        container.style.minHeight = '500px';
        
        // Force another reflow to apply the new dimensions
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;
        
        console.log(`Updated container dimensions: ${newWidth}x${newHeight}`);
    }
    
    // Make container visible if it's not
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    
    // Add a class to make it easier to debug visually
    container.classList.add('spline-container-ready');
}

/**
 * Initialize Spline scene using the runtime API (primary approach)
 * @param containerElement - The container element
 * @param splineUrl - URL to the Spline scene
 */
function initWithRuntimeAPI(containerElement: HTMLElement, splineUrl: string): void {
    try {
        // Create a canvas element for Spline
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = containerElement.offsetWidth;  // Set explicit pixel dimensions
        canvas.height = containerElement.offsetHeight; // Set explicit pixel dimensions
        containerElement.appendChild(canvas);
        
        // Add loading indicator
        const loader = document.createElement('div');
        loader.className = 'spline-loader';
        loader.innerHTML = '<span class="loader"></span>';
        containerElement.appendChild(loader);
        
        console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
        
        // Create a new Spline Application instance with the canvas
        const spline = new Application(canvas);
        
        // Load the Spline scene with error handling and retries
        loadSplineScene(spline, splineUrl, containerElement, loader)
            .catch(error => {
                console.error('Failed to load primary Spline scene, trying fallback:', error);
                // Try fallback scene if primary fails
                return loadSplineScene(spline, FALLBACK_SCENE_URL, containerElement, loader);
            })
            .catch(error => {
                console.error('All Spline scene loading attempts failed:', error);
                handleSplineError(containerElement);
            });
    } catch (error) {
        console.error('Failed to initialize Spline scene:', error);
        handleSplineError(containerElement);
    }
}

/**
 * Load a Spline scene with proper error handling
 * @param spline - The Spline Application instance
 * @param sceneUrl - URL to the Spline scene
 * @param container - The container element
 * @param loader - The loader element to remove when loaded
 */
async function loadSplineScene(
    spline: Application, 
    sceneUrl: string, 
    container: HTMLElement,
    loader: HTMLElement
): Promise<void> {
    try {
        console.log(`Loading Spline scene from URL: ${sceneUrl}`);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Spline scene loading timed out')), 20000);
        });
        
        // Race between loading and timeout
        await Promise.race([
            spline.load(sceneUrl),
            timeoutPromise
        ]);
        
        // Remove loader when loaded
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        
        // Add loaded class to container for CSS transitions
        container.classList.add('loaded');
        
        // Hide the fallback content
        const fallback = container.parentElement?.querySelector('.spline-fallback');
        if (fallback) {
            (fallback as HTMLElement).style.display = 'none';
        }
        
        console.log('Spline scene loaded successfully');
    } catch (error) {
        // Clean up on error
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        throw error; // Re-throw to allow for fallback handling
    }
}

/**
 * Handle errors when loading Spline scene
 * @param container - The container element
 */
function handleSplineError(container: HTMLElement): void {
    // Add error class to container
    container.classList.add('error');
    
    // Show fallback content
    const fallback = container.parentElement?.querySelector('.spline-fallback');
    if (fallback) {
        (fallback as HTMLElement).style.display = 'block';
    } else {
        // Create fallback content if it doesn't exist
        const fallbackContent = document.createElement('div');
        fallbackContent.className = 'spline-fallback';
        fallbackContent.innerHTML = `
            <div class="fallback-content">
                <h3>Interactive 3D Experience</h3>
                <p>We're experiencing issues loading the 3D scene. Please try refreshing the page.</p>
            </div>
        `;
        container.parentElement?.appendChild(fallbackContent);
    }
}

// Listen for language changes to reinitialize the scene if needed
document.addEventListener('language:changed', () => {
    // The scene will be reinitialized when components are reloaded
    console.log('Language changed, Spline scene will be reinitialized');
});

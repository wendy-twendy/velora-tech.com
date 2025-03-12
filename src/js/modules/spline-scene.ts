/**
 * Spline Scene Module
 * Handles loading and rendering of 3D Spline scenes
 */

import { Application } from '@splinetool/runtime';

/**
 * Initialize Spline Scene in the hero section
 * @param containerId - ID of the container element where the Spline scene will be rendered
 * @param splineUrl - URL to the Spline scene
 */
export function initSplineScene(containerId: string = 'spline-container', splineUrl: string = 'https://prod.spline.design/your-scene-id/scene.splinecode'): void {
    document.addEventListener('components:all-loaded', () => {
        const containerElement = document.getElementById(containerId);
        
        if (!containerElement) {
            console.error(`Spline container element with ID "${containerId}" not found`);
            return;
        }
        
        try {
            // Create a canvas element for Spline
            const canvas = document.createElement('canvas');
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            containerElement.appendChild(canvas);
            
            // Create a new Spline Application instance with the canvas
            const spline = new Application(canvas);
            
            // Load the Spline scene
            spline.load(splineUrl).then(() => {
                // Add loaded class to container for CSS transitions
                containerElement.classList.add('loaded');
                
                // Hide the fallback content
                const fallback = containerElement.parentElement?.querySelector('.spline-fallback');
                if (fallback) {
                    (fallback as HTMLElement).style.display = 'none';
                }
                
                console.log('Spline scene loaded successfully');
            }).catch((error) => {
                console.error('Error loading Spline scene:', error);
                handleSplineError(containerElement);
            });
        } catch (error) {
            console.error('Failed to initialize Spline scene:', error);
            handleSplineError(containerElement);
        }
    });
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
    }
}

// Listen for language changes to reinitialize the scene if needed
document.addEventListener('language:changed', () => {
    // The scene will be reinitialized when components are reloaded
    console.log('Language changed, Spline scene will be reinitialized');
});

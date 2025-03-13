/**
 * Spline Adapter Module
 * Provides a bridge between the TypeScript application and React components
 */

import React from 'react';
import * as ReactDOM from 'react-dom/client';

// Define a simplified interface for the SplineScene component
// This avoids importing from outside the rootDir
interface SplineSceneProps {
    scene: string;
    className?: string;
}

/**
 * Mount a React Spline component to a DOM element
 * @param containerId - ID of the container element where the Spline scene will be rendered
 * @param sceneUrl - URL to the Spline scene
 */
export function mountSplineComponent(containerId: string, sceneUrl: string): void {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container element with ID "${containerId}" not found`);
        return;
    }
    
    // Ensure container has explicit dimensions
    if (container.clientWidth === 0 || container.clientHeight === 0) {
        // Force minimum dimensions to avoid WebGL errors
        container.style.minWidth = '300px';
        container.style.minHeight = '300px';
        console.log(`Setting minimum dimensions for Spline container: ${container.clientWidth}x${container.clientHeight}`);
    }
    
    try {
        // Clear any existing content
        container.innerHTML = '';
        
        // Create a wrapper div for React
        const reactRoot = document.createElement('div');
        reactRoot.className = 'spline-react-root';
        reactRoot.style.width = '100%';
        reactRoot.style.height = '100%';
        container.appendChild(reactRoot);
        
        // Dynamically import the SplineScene component
        import('@splinetool/react-spline').then((SplineModule) => {
            const Spline = SplineModule.default;
            
            // Create a root using the new createRoot API
            const root = ReactDOM.createRoot(reactRoot);
            
            // Render the Spline component directly
            root.render(
                React.createElement(
                    'div',
                    { className: 'w-full h-full' },
                    React.createElement(
                        React.Suspense,
                        { 
                            fallback: React.createElement(
                                'div', 
                                { className: 'w-full h-full flex items-center justify-center' },
                                React.createElement('span', { className: 'loader' })
                            ) 
                        },
                        React.createElement(Spline, {
                            scene: sceneUrl,
                            className: 'w-full h-full'
                        })
                    )
                )
            );
            
            console.log('Spline React component mounted successfully');
        }).catch(error => {
            console.error('Failed to load Spline component:', error);
            handleSplineFallback(container);
        });
    } catch (error) {
        console.error('Failed to mount Spline React component:', error);
        handleSplineFallback(container);
    }
}

/**
 * Handle fallback when Spline component fails to load
 * @param container - The container element
 */
function handleSplineFallback(container: HTMLElement): void {
    // Show fallback content
    container.innerHTML = `
        <div class="spline-fallback">
            <div class="fallback-content">
                <h3>Interactive 3D Experience</h3>
                <p>We're experiencing issues loading the 3D scene. Please try refreshing the page.</p>
            </div>
        </div>
    `;
}

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SplineSceneBasic } from '../../components/spline-scene-basic';
import { ComponentLoadedEventDetail } from '../../types/index';

/**
 * ReactComponentBridge
 * 
 * This module serves as a bridge between the traditional component system
 * and React components. It renders React components into specified DOM elements.
 */
export class ReactComponentBridge {
  private static initialized = false;
  private static componentMap: Record<string, React.ComponentType<any>> = {
    'spline-scene': SplineSceneBasic,
    'spline-scene-basic': SplineSceneBasic
  };
  private static roots: Map<string, any> = new Map();
  private static debug = {
    splineLoaded: false,
    splineError: null as Error | null,
    componentsMounted: [] as string[]
  };

  /**
   * Initialize the React component bridge
   */
  public static init(): void {
    if (this.initialized) {
      console.log('[ReactComponentBridge] React component bridge already initialized, skipping');
      return;
    }

    console.log('[ReactComponentBridge] Initializing React component bridge');
    
    // Make debug object available globally for troubleshooting
    (window as any).__reactComponentBridgeDebug = this.debug;
    
    // Force the browser to show the console for debugging
    setTimeout(() => {
      console.log('[ReactComponentBridge] DEBUG CHECK - If you can see this message, console logging is working');
      console.log('[ReactComponentBridge] Browser information:', navigator.userAgent);
      console.log('[ReactComponentBridge] Available React components:', Object.keys(this.componentMap));
    }, 1000);

    // Check if React is available
    if (!React || !createRoot) {
      console.error('[ReactComponentBridge] React or createRoot is not available. Cannot initialize React component bridge.');
      return;
    }

    // Check if SplineSceneBasic is available
    if (!SplineSceneBasic) {
      console.error('[ReactComponentBridge] SplineSceneBasic component is not available. Spline scenes will not render.');
    } else {
      console.log('[ReactComponentBridge] SplineSceneBasic component is available');

      // Manually check for spline scene placeholders
      const splinePlaceholders = document.querySelectorAll('[data-component="spline-scene"], [data-component="spline-scene-basic"]');
      console.log(`[ReactComponentBridge] Found ${splinePlaceholders.length} spline scene placeholders`);
      
      if (splinePlaceholders.length === 0) {
        console.log('[ReactComponentBridge] No spline scene placeholders found, checking hero section');
        
        // Check if we need to add a placeholder in the hero section
        const heroSection = document.querySelector('.hero-image');
        if (heroSection && !heroSection.querySelector('[data-component="spline-scene"]')) {
          console.log('[ReactComponentBridge] Creating spline scene placeholder in hero section');
          const placeholder = document.createElement('div');
          placeholder.setAttribute('data-component', 'spline-scene');
          placeholder.id = 'spline-scene-container';
          placeholder.style.width = '100%';
          placeholder.style.height = '400px';
          placeholder.style.position = 'relative';
          heroSection.prepend(placeholder);
          
          // Trigger component loaded event for the new placeholder
          this.handleComponentLoaded({
            detail: {
              name: 'spline-scene',
              element: placeholder as HTMLElement
            }
          });
        }
      }

      // Add a check for late registration
      setTimeout(() => {
        // Check if the spline scene is present in the DOM
        const splineElement = document.querySelector('[data-component="spline-scene"]');
        if (splineElement) {
          console.log('[ReactComponentBridge] Spline scene element exists in DOM after 3 seconds');
          
          // Check if it has been mounted
          if (!splineElement.hasAttribute('data-react-mounted')) {
            console.log('[ReactComponentBridge] Spline scene element exists but is not mounted - attempting to render it');
            this.renderComponent('spline-scene', splineElement as HTMLElement);
          }
        } else {
          console.error('[ReactComponentBridge] Spline scene element does not exist in DOM after 3 seconds');
        }
      }, 3000);

      // Find all elements with data-component attribute that are for React components
      const componentElements = document.querySelectorAll('[data-component]');
      console.log(`[ReactComponentBridge] Found ${componentElements.length} component placeholders`);
      
      componentElements.forEach(element => {
        const componentName = element.getAttribute('data-component');
        if (componentName && this.componentMap[componentName]) {
          console.log(`[ReactComponentBridge] Found React component placeholder: ${componentName}`);
          this.renderComponent(componentName, element as HTMLElement);
        }
      });

      // Listen for component:loaded events to handle React components as they're identified
      document.addEventListener('component:loaded', ((event: Event) => {
        const customEvent = event as CustomEvent<ComponentLoadedEventDetail>;
        const { name, element } = customEvent.detail;
        console.log(`[ReactComponentBridge] Component loaded event received for: ${name}`);
        if (name && this.componentMap[name] && element) {
          this.renderComponent(name, element);
        }
      }) as EventListener);

      // Log all existing DOM elements with data-component for debugging
      const allElements = document.querySelectorAll('[data-component]');
      console.log('[ReactComponentBridge] All elements with data-component attribute:');
      allElements.forEach((el, index) => {
        console.log(`[ReactComponentBridge] Element ${index}:`, el.getAttribute('data-component'), el);
      });

      // Add a mutation observer to detect dynamically added components
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node instanceof Element) {
                // Check if this node has data-component
                if (node.hasAttribute('data-component')) {
                  const componentName = node.getAttribute('data-component');
                  console.log(`[ReactComponentBridge] Mutation observer detected new component: ${componentName}`);
                  if (componentName && this.componentMap[componentName]) {
                    this.renderComponent(componentName, node as HTMLElement);
                  }
                }
                
                // Also check children of this node
                const childComponents = node.querySelectorAll('[data-component]');
                childComponents.forEach(child => {
                  const childComponentName = child.getAttribute('data-component');
                  console.log(`[ReactComponentBridge] Mutation observer detected new child component: ${childComponentName}`);
                  if (childComponentName && this.componentMap[childComponentName]) {
                    this.renderComponent(childComponentName, child as HTMLElement);
                  }
                });
              }
            });
          }
        });
      });
      
      // Start observing the document for added nodes
      observer.observe(document.body, { childList: true, subtree: true });
      console.log('[ReactComponentBridge] Mutation observer started');

      this.initialized = true;
      console.log('[ReactComponentBridge] React component bridge initialized');
    }
  }

  /**
   * Render a React component into a DOM element
   * 
   * @param componentName - The name of the component to render
   * @param container - The DOM element to render the component into
   */
  private static renderComponent(componentName: string, container: HTMLElement): void {
    try {
      console.log(`[ReactComponentBridge] Rendering React component: ${componentName}`);
      
      const Component = this.componentMap[componentName];
      if (!Component) {
        console.error(`[ReactComponentBridge] Component "${componentName}" not found in component map`);
        this.handleRenderError(componentName, container, 'Component not found in component map');
        return;
      }

      // Check if container already has a React root
      if (container.hasAttribute('data-react-mounted')) {
        console.log(`[ReactComponentBridge] Component "${componentName}" already mounted, skipping`);
        return;
      }

      // Clear any existing content
      console.log(`[ReactComponentBridge] Clearing existing content for ${componentName}`);
      container.innerHTML = '';
      
      // Create a unique ID for this container if it doesn't have one
      const containerId = container.id || `react-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (!container.id) {
        container.id = containerId;
      }
      
      console.log(`[ReactComponentBridge] Creating React root for container: ${containerId}`);
      
      try {
        // Add a loading indicator while React is initializing
        container.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
            <div class="loader"></div>
          </div>
        `;
        
        // Create the React root
        const root = createRoot(container);
        this.roots.set(containerId, root);
        
        // Clear the loading indicator
        console.log(`[ReactComponentBridge] Clearing loading indicator for ${componentName}`);
        container.innerHTML = '';
        
        console.log(`[ReactComponentBridge] Rendering component ${componentName} into container ${containerId}`);
        
        // Add specific debugging for Spline
        if (componentName === 'spline-scene') {
          console.log('[ReactComponentBridge] Rendering Spline scene component with special handling');
          
          // Debug what's in our Spline component
          console.log('[ReactComponentBridge] SplineSceneBasic component:', SplineSceneBasic);
          
          // Add a class to help with styling and debugging
          container.classList.add('spline-container');
          
          // Make sure the container has adequate height
          container.style.minHeight = '300px';
          container.style.display = 'block';
          
          // Add a data attribute to track the component state
          container.setAttribute('data-spline-state', 'loading');
          
          // Force any CSS to take effect before rendering
          setTimeout(() => {
            // Check if we're still mounted at this point
            if (document.body.contains(container)) {
              console.log('[ReactComponentBridge] About to render Spline component...');
              // Render the component
              root.render(React.createElement(Component));
              
              // Mark as mounted
              container.setAttribute('data-react-mounted', 'true');
              
              console.log('[ReactComponentBridge] Spline scene rendered, observing container for changes');
              
              // Observe for rendering issues
              setTimeout(() => {
                if (document.body.contains(container)) {
                  const hasContent = container.querySelector('canvas');
                  console.log('[ReactComponentBridge] Checking for Spline canvas:', hasContent ? 'Found' : 'Not Found');
                }
              }, 3000);
            } else {
              console.error('[ReactComponentBridge] Container was removed from DOM before rendering');
            }
          }, 0);
          
          return; // Return early for special spline handling
        }
        
        // Render the component
        root.render(React.createElement(Component));
        
        // Mark as mounted
        container.setAttribute('data-react-mounted', 'true');
        
        // Hide the fallback if it exists
        const fallbackElement = container.parentElement?.querySelector('.static-hero-visual');
        if (fallbackElement) {
          console.log('[ReactComponentBridge] Hiding fallback element');
          fallbackElement.setAttribute('style', 'display: none;');
        }
        
        console.log(`[ReactComponentBridge] React component "${componentName}" rendered successfully`);
      } catch (renderError) {
        console.error(`[ReactComponentBridge] Error rendering React component:`, renderError);
        this.handleRenderError(componentName, container, renderError instanceof Error ? renderError.message : 'Unknown error');
      }
    } catch (error) {
      console.error(`[ReactComponentBridge] Error setting up React component "${componentName}":`, error);
      this.handleRenderError(componentName, container, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Handle errors when rendering a React component
   */
  private static handleRenderError(componentName: string, container: HTMLElement, errorMessage: string = ''): void {
    console.error(`[ReactComponentBridge] Error rendering ${componentName}: ${errorMessage}`);
    
    // Show error message in container
    container.innerHTML = `
      <div style="color: red; padding: 20px; text-align: center;">
        Error loading ${componentName} component${errorMessage ? ': ' + errorMessage : ''}
        <div style="font-size: 12px; margin-top: 10px;">
          Check the console for more details.
        </div>
      </div>
    `;
    
    // Add error class for styling
    container.classList.add('react-error');
    
    // Add data attribute for error state
    container.setAttribute('data-react-error', 'true');
    
    // If this is a Spline component, update its state
    if (componentName === 'spline-scene') {
      container.setAttribute('data-spline-state', 'error');
    }
    
    // Show the fallback if it exists
    const fallbackElement = container.parentElement?.querySelector('.static-hero-visual');
    if (fallbackElement) {
      console.log('[ReactComponentBridge] Showing fallback element due to error');
      fallbackElement.setAttribute('style', 'display: block;');
    }
  }

  /**
   * Register a new React component
   * 
   * @param name - The name to register the component under
   * @param component - The React component to register
   */
  public static registerComponent(name: string, component: React.ComponentType<any>): void {
    this.componentMap[name] = component;
    console.log(`[ReactComponentBridge] Registered React component: ${name}`);
    
    // If we're already initialized, look for elements with this component name
    if (this.initialized) {
      const elements = document.querySelectorAll(`[data-component="${name}"]`);
      console.log(`[ReactComponentBridge] Found ${elements.length} existing elements for newly registered component ${name}`);
      elements.forEach(element => {
        this.renderComponent(name, element as HTMLElement);
      });
    }
  }

  /**
   * Handle component loaded event
   * 
   * @param event - The event object
   */
  private static handleComponentLoaded(event: { detail: ComponentLoadedEventDetail }): void {
    const { name, element } = event.detail;
    console.log(`[ReactComponentBridge] Component loaded event received for: ${name}`);
    if (name && this.componentMap[name] && element) {
      this.renderComponent(name, element);
    }
  }
}

/**
 * Effects and state management for SplineSceneBasic component
 */

import { useEffect, RefObject } from 'react';

/**
 * Effect to initialize WebGL and check browser compatibility
 */
export function useWebGLInitialization(
  mountedRef: RefObject<boolean>,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  setIsClient: (isClient: boolean) => void
) {
  useEffect(() => {
    console.log("SplineSceneBasic component effect running");

    mountedRef.current = true;

    if (typeof window === 'undefined') {
      console.error("Not in browser environment, cannot render Spline scene");
      setError("Not in browser environment");
      return;
    }

    console.log("Browser environment detected");
    console.log("User Agent:", navigator.userAgent);
    console.log("Window dimensions:", window.innerWidth, "x", window.innerHeight);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        console.error("WebGL not supported in this browser");
        setError("WebGL not supported");
        setIsLoading(false);
        return;
      }

      const webgl = gl as WebGLRenderingContext;
      console.log("WebGL supported:", 
        webgl.getParameter(webgl.VERSION), 
        "Renderer:", 
        webgl.getParameter(webgl.RENDERER)
      );
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setError("Error checking WebGL");
      setIsLoading(false);
      return;
    }

    console.log("Window is defined in SplineSceneBasic");

    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        console.warn("Spline is taking too long to load. This might indicate a problem.");
      }
    }, 10000);

    import('@splinetool/react-spline').then(() => {
      console.log("@splinetool/react-spline module imported successfully in SplineSceneBasic");
      if (mountedRef.current) {
        setIsClient(true);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("Error importing @splinetool/react-spline in SplineSceneBasic:", err);
      if (mountedRef.current) {
        setError(`Error loading Spline: ${err.message}`);
        setIsLoading(false);
      }
    });

    if (document.readyState === 'loading') {
      console.log("Document still loading, waiting for DOMContentLoaded");
      const domLoadedHandler = () => {
        console.log("DOMContentLoaded fired, setting isClient to true");
        if (mountedRef.current) {
          setIsClient(true);
        }
      };

      document.addEventListener('DOMContentLoaded', domLoadedHandler);
      return () => {
        document.removeEventListener('DOMContentLoaded', domLoadedHandler);
        clearTimeout(timeoutId);
        mountedRef.current = false;
      };
    } else {
      console.log("Document already loaded, setting isClient to true");
      setIsClient(true);
    }

    return () => {
      clearTimeout(timeoutId);
      mountedRef.current = false;
      console.log("SplineSceneBasic component unmounted");
    };
  }, [mountedRef, setError, setIsLoading, setIsClient]);
}

/**
 * Effect to handle responsive dimensions
 */
export function useResponsiveDimensions(
  isClient: boolean,
  containerRef: RefObject<HTMLDivElement>,
  splineRef: RefObject<any>,
  setContainerHeight: (height: string) => void,
  setContainerWidth: (width: string) => void,
  adjustSplineScene: () => void
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      const heroSection = document.querySelector('.hero') as HTMLElement;
      const heroContent = document.querySelector('.hero-content') as HTMLElement;
      const heroImage = document.querySelector('.hero-image') as HTMLElement;
      
      if (heroSection && heroContent && heroImage) {
        // Get the hero section and hero content dimensions
        const heroHeight = heroSection.offsetHeight;
        const heroWidth = heroSection.offsetWidth;
        const heroContentHeight = heroContent.offsetHeight;
        const heroImageHeight = heroImage.offsetHeight;
        
        console.log("Hero section dimensions:", heroWidth, "x", heroHeight);
        console.log("Hero content dimensions:", heroContent.offsetWidth, "x", heroContentHeight);
        console.log("Hero image dimensions:", heroImage.offsetWidth, "x", heroImageHeight);

        // Use fixed height for desktop to ensure robot is fully visible
        if (window.innerWidth >= 992) {
          // On desktop: Use larger fixed height to make robot more prominent
          setContainerHeight('600px');
        } else {
          // On mobile: Use larger height to ensure visibility
          setContainerHeight('500px');
        }
        
        // Calculate width based on screen size
        if (window.innerWidth >= 992) {
          // On desktop: Spline scene should take 60% of the hero width
          // The container is already in a div that's 60% of the hero width
          // So we use 100% of that container
          setContainerWidth('100%');
        } else {
          // On mobile: Spline scene should take full width
          setContainerWidth('100%');
        }
      } else {
        // Fallback dimensions if elements aren't found
        setContainerHeight('600px');
        setContainerWidth('100%');
      }

      if (splineRef.current) {
        adjustSplineScene();
      }
      
      // Apply styles to the canvas element directly
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          console.log("Found canvas element during resize, applying styles directly");
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.minHeight = '100%';
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.display = 'block';
          canvas.style.objectFit = 'cover';
          
          // Force the canvas to match container dimensions
          if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            canvas.width = containerWidth;
            canvas.height = containerHeight;
          }
        }
      }
    };

    // Initial update
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    
    // Also update dimensions after a short delay to ensure everything is rendered
    const timeoutId = setTimeout(updateDimensions, 500);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeoutId);
    };
  }, [isClient, containerRef, splineRef, setContainerHeight, setContainerWidth, adjustSplineScene]);
}
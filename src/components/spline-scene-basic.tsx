'use client'

import React, { useState, useEffect, useRef } from 'react';
import { SplineScene } from "./ui/spline";
import { Card } from "./ui/card"
import { Spotlight } from "./ui/spotlight"
import type Spline from '@splinetool/react-spline';

export function SplineSceneBasic() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [containerWidth, setContainerWidth] = useState('100%');
  const mountedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

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
      if (mountedRef.current && isLoading) {
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
  }, [isLoading]);

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
          // On desktop: Use fixed height of 450px
          setContainerHeight('450px');
        } else {
          // On mobile: Use auto height with minimum to ensure visibility
          setContainerHeight('400px');
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
        setContainerHeight('450px');
        setContainerWidth('100%');
      }

      if (splineRef.current) {
        adjustSplineScene();
      }
    };

    // Initial update
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isClient]);

  const onSplineLoad = (spline: any) => {
    console.log("Spline scene loaded", spline);
    splineRef.current = spline;
    
    // Adjust the scene once it's loaded
    adjustSplineScene();
    
    // Set loading state to false
    setIsLoading(false);
  };


  const adjustSplineScene = () => {
    if (!splineRef.current) return;

    try {
      const robotObject = splineRef.current.findObjectByName('Robot');

      if (robotObject) {
        console.log("Found robot object:", robotObject);

        // Center the robot horizontally and vertically
        robotObject.position.x = 0;
        
        // Get the hero section and container dimensions for proper positioning
        const heroSection = document.querySelector('.hero') as HTMLElement;
        const heroContent = document.querySelector('.hero-content') as HTMLElement;
        const splineContainer = containerRef.current;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Log dimensions for debugging
        console.log("Viewport dimensions:", viewportWidth, "x", viewportHeight);
        if (heroSection) {
          console.log("Hero dimensions:", heroSection.offsetWidth, "x", heroSection.offsetHeight);
        }
        if (splineContainer) {
          console.log("Spline container dimensions:", splineContainer.offsetWidth, "x", splineContainer.offsetHeight);
        }
        
        // Get the camera for adjustments
        const camera = splineRef.current.findObjectByName('Camera');
        
        // Adjust robot position based on screen size
        if (viewportWidth < 640) {
          // Mobile view - make robot more prominent
          robotObject.position.y = 0.5; // Lower position to show legs
          robotObject.position.z = 0;
          
          // Adjust camera for better view on small screens
          if (camera) {
            // Pull camera back to show more of the robot
            camera.position.z += 4.0; // Pull back more
            camera.position.y -= 0.5; // Look up at the robot
          }
        } else if (viewportWidth < 1024) {
          // Tablet view
          robotObject.position.y = 0.2; // Lower position to show legs
          robotObject.position.z = 0;
          
          // Adjust camera for better view on medium screens
          if (camera) {
            camera.position.z += 3.5; // Pull back more
            camera.position.y -= 0.2; // Look up at the robot
          }
        } else {
          // Desktop view - position for optimal visibility
          robotObject.position.y = 0; // Center position to show full robot including legs
          robotObject.position.z = 0;
          
          // Adjust camera for optimal view on large screens
          if (camera) {
            // Adjust camera to frame the robot properly
            camera.position.z += 2.5; // Pull back more to show full robot
            camera.position.y -= 0.1; // Slight adjustment to look up
          }
        }

        // Force the scene to update with new positions
        splineRef.current.runtime?.update();
      } else {
        console.warn("Robot object not found in Spline scene");
      }
    } catch (err) {
      console.error("Error adjusting Spline scene:", err);
    }
  };

  console.log("SplineSceneBasic rendering, isClient:", isClient, "error:", error, "isLoading:", isLoading, 
    "containerHeight:", containerHeight, "containerWidth:", containerWidth);

  if (!isClient) {
    return (
      <Card className="w-full bg-black/[0.96] relative overflow-hidden" style={{ height: containerHeight }}>
        <div className="flex h-full items-center justify-center">
          <div className="loader"></div>
          <span className="ml-3 text-white text-sm">Initializing 3D scene...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-black/[0.96] relative overflow-hidden" style={{ height: containerHeight }}>
        <div className="flex h-full items-center justify-center">
          <div className="text-red-500 text-center p-4">
            <p>Failed to load 3D scene</p>
            <p className="text-sm mt-2">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="w-full bg-black/[0.96] relative overflow-hidden" 
      style={{ height: containerHeight }}
    >
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full justify-center">
        <div 
          ref={containerRef}
          className="relative flex items-center justify-center mx-auto" 
          style={{
            width: containerWidth,
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
            // Remove fixed max-width to allow proper responsive sizing
          }}
          data-debug="spline-container"
        >
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
            onLoad={onSplineLoad}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </Card>
  )
}

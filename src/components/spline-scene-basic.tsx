'use client'

import React, { useState, useEffect, useRef } from 'react';
import { SplineScene } from "./ui/spline";
import { Card } from "./ui/card"
import { Spotlight } from "./ui/spotlight"
 
export function SplineSceneBasic() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(false);
  
  // This ensures the component only renders on the client side
  useEffect(() => {
    console.log("SplineSceneBasic component effect running");
    
    // Mark this component as mounted
    mountedRef.current = true;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.error("Not in browser environment, cannot render Spline scene");
      setError("Not in browser environment");
      return;
    }
    
    // Log important environment information
    console.log("Browser environment detected");
    console.log("User Agent:", navigator.userAgent);
    console.log("Window dimensions:", window.innerWidth, "x", window.innerHeight);
    
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.error("WebGL not supported in this browser");
        setError("WebGL not supported");
        setIsLoading(false);
        return;
      }
      
      // Type assertion to WebGLRenderingContext to fix TypeScript errors
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
    
    // Add debugging to check if Spline is available
    console.log("Window is defined in SplineSceneBasic");
    
    // Set a timeout to check if the component is still loading after 10 seconds
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && isLoading) {
        console.warn("Spline is taking too long to load. This might indicate a problem.");
        // Don't set error yet, just log a warning
      }
    }, 10000);
    
    // Check if the Spline module was loaded correctly
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
    
    // Add a DOM content loaded event listener 
    // This might help if the component is trying to render before the DOM is fully prepared
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

  // Rendering debug log
  console.log("SplineSceneBasic rendering, isClient:", isClient, "error:", error, "isLoading:", isLoading);

  // Show a loading state when not client-side
  if (!isClient) {
    return (
      <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
        <div className="flex h-full items-center justify-center">
          <div className="loader"></div>
          <span className="ml-3 text-white text-sm">Initializing 3D scene...</span>
        </div>
      </Card>
    );
  }
  
  // Show an error state
  if (error) {
    return (
      <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
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

  // Normal render with the Spline component - only showing the robot, no text
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full">
        {/* Full-width container for the 3D scene */}
        <div 
          className="w-full relative" 
          style={{ minHeight: '400px' }}
          data-debug="spline-container"
        >
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}

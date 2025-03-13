'use client'

import React, { useState, useRef } from 'react';
import { SplineScene } from "./ui/spline";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";
import { useWebGLInitialization, useResponsiveDimensions } from './spline/scene-effects';
import { adjustSplineScene, handleSplineLoad as onSplineLoadHandler } from './spline/scene-adjustments';

/**
 * SplineSceneBasic component renders a 3D Spline scene with responsive adjustments
 * for different screen sizes. It handles loading states, errors, and WebGL compatibility.
 */
export function SplineSceneBasic() {
  // State for component rendering
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [containerWidth, setContainerWidth] = useState('100%');
  
  // Refs for tracking component lifecycle and elements
  const mountedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  // Initialize WebGL and check browser compatibility
  useWebGLInitialization(
    mountedRef,
    setError,
    setIsLoading,
    setIsClient
  );

  // Handle responsive dimensions
  useResponsiveDimensions(
    isClient,
    containerRef as React.RefObject<HTMLDivElement>,
    splineRef,
    setContainerHeight,
    setContainerWidth,
    () => adjustSplineScene(splineRef, containerRef)
  );

  // Handler for when the Spline scene is loaded
  const onSplineLoad = (spline: any) => {
    onSplineLoadHandler(spline, splineRef, setIsLoading);
  };

  console.log("SplineSceneBasic rendering, isClient:", isClient, "error:", error, "isLoading:", isLoading, 
    "containerHeight:", containerHeight, "containerWidth:", containerWidth);

  // Loading state
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

  // Error state
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

  // Render the Spline scene
  return (
    <Card
      className="w-full bg-black/[0.96] relative overflow-hidden"
      style={{
        height: containerHeight,
        minHeight: '600px', // Ensure minimum height
        display: 'block'
      }}
    >
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full justify-center">
        <div
          ref={containerRef}
          className="relative flex items-center justify-center mx-auto spline-container"
          style={{
            width: containerWidth,
            height: '600px', // Fixed height to ensure proper rendering
            position: 'relative',
            overflow: 'hidden',
            display: 'block', // Ensure block display
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
            scale={1.0} // Ensure proper scaling
          />
        </div>
      </div>
    </Card>
  );
}

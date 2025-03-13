'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { SplineSceneProps } from './spline/types';
import { 
  loadSplineModule, 
  debounce, 
  checkWebGLSupport, 
  isWindowAvailable,
  initializeDebugObject
} from './spline/utils';
import { 
  applyScreenSizeAdjustments
} from './spline/screen-adjustments';

// Create a lazy-loaded Spline component
const LazySpline = React.lazy(() => loadSplineModule());

export function SplineScene({
  scene,
  className = '',
  width = '100%',
  height = '100%',
  scale = 1,
  onLoad
}: SplineSceneProps) {
  const [domReady, setDomReady] = useState(false);
  const [webGLSupported] = useState(() => checkWebGLSupport());
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Report user agent for debugging
  useEffect(() => {
    console.log('[SplineComponent] Browser User Agent:', navigator.userAgent);
    console.log('[SplineComponent] Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    
    // Create a global debug object
    initializeDebugObject(webGLSupported, scene);
    
    return () => {
      // Cleanup
      mountedRef.current = false;
    };
  }, [webGLSupported, scene]);
  
  // Check for DOM readiness
  useEffect(() => {
    console.log('[SplineComponent] SplineScene component mounted with scene:', scene);
    console.log('[SplineComponent] Document readyState:', document.readyState);
    
    // Check if the document is already complete
    if (document.readyState === 'complete') {
      console.log('[SplineComponent] Document already complete, setting domReady to true');
      setDomReady(true);
      if (isWindowAvailable) {
        (window as any).__SPLINE_DEBUG?.setDomReady(true);
      }
    } else {
      console.log('[SplineComponent] Document not ready yet, waiting for load and DOMContentLoaded events');
      
      const handleContentLoaded = () => {
        console.log('[SplineComponent] DOMContentLoaded event fired');
        if (mountedRef.current) {
          setDomReady(true);
          if (isWindowAvailable) {
            (window as any).__SPLINE_DEBUG?.setDomReady(true);
          }
        }
      };
      
      const handleLoad = () => {
        console.log('[SplineComponent] Window load event fired');
        if (mountedRef.current) {
          setDomReady(true);
          if (isWindowAvailable) {
            (window as any).__SPLINE_DEBUG?.setDomReady(true);
          }
        }
      };
      
      // Listen for both events to be safe
      document.addEventListener('DOMContentLoaded', handleContentLoaded);
      window.addEventListener('load', handleLoad);
      
      return () => {
        document.removeEventListener('DOMContentLoaded', handleContentLoaded);
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [scene]);
  
  // Handle Spline loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (domReady && webGLSupported) {
      console.log('[SplineComponent] DOM is ready and WebGL is supported, attempting to load Spline');
      
      // Set a timeout to detect loading issues
      timeoutId = setTimeout(() => {
        if (mountedRef.current && loading) {
          console.warn('[SplineComponent] Spline is taking too long to load, may be an issue');
          
          if (containerRef.current && !containerRef.current.querySelector('canvas')) {
            console.warn('[SplineComponent] No canvas detected after loading timeout');
            if (retryCount < 3) {
              console.log('[SplineComponent] Attempting retry', retryCount + 1);
              setRetryCount(retryCount + 1);
              setLoading(true);
            } else {
              setError('Timeout loading Spline scene');
              setLoading(false);
            }
          }
        }
      }, 10000);
    } else {
      console.log('[SplineComponent] Not ready to load Spline yet:',
                  'DOM ready:', domReady,
                  'WebGL supported:', webGLSupported);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [domReady, webGLSupported, loading, retryCount]);
  
  // Function to handle Spline errors - correctly typed for React events
  const handleSplineError = (event: React.SyntheticEvent) => {
    console.error('[SplineComponent] Error in Spline component:', event);
    // Try to extract more useful information
    const errorMessage = event && (event as any).message ? (event as any).message : 'Unknown error';
    setError(`Spline error: ${errorMessage}`);
    setLoading(false);
    
    if (isWindowAvailable) {
      (window as any).__SPLINE_DEBUG?.addError({
        event,
        message: errorMessage,
        time: new Date().toISOString()
      });
    }
  };
  
  // Function to handle Spline load events with improved mobile handling
  const handleSplineLoad = (spline: any) => {
    console.log('[SplineComponent] Spline scene loaded successfully!');
    setLoading(false);
    if (isWindowAvailable) {
      (window as any).__SPLINE_DEBUG?.setLoaded(true);
    }
    
    // Verify that the canvas was created and apply styles directly
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      console.log('[SplineComponent] Canvas element after load:', canvas);
      if (!canvas) {
        console.warn('[SplineComponent] Canvas not found after successful load event');
      } else {
        // Add a class to the canvas for styling
        canvas.classList.add('spline-canvas-fullsize');
        
        // Get the viewport width for responsive adjustments
        const viewportWidth = window.innerWidth;
        
        // Apply screen-size specific adjustments using a more granular approach
        applyScreenSizeAdjustments(spline, canvas, viewportWidth);
        
        // Pass the loaded spline instance to the onLoad prop if provided
        if (onLoad) {
          onLoad(spline);
        }
        
        // Set up a debounced resize handler to stabilize responsive behavior
        const handleResize = debounce(() => {
          const currentWidth = window.innerWidth;
          console.log('[SplineComponent] Debounced resize event, width:', currentWidth);
          applyScreenSizeAdjustments(spline, canvas, currentWidth);
        }, 150); // 150ms debounce time
        
        // Add the debounced resize listener
        window.addEventListener('resize', handleResize);
        
        // Store the handler reference for cleanup
        (canvas as any)._resizeHandler = handleResize;
      }
    }
  };
  
  // Early return if no WebGL
  if (!webGLSupported) {
    return (
      <div 
        ref={containerRef}
        className={`spline-error ${className}`} 
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="spline-error-message" style={{ textAlign: 'center', color: 'red' }}>
          <p>WebGL is not supported in your browser</p>
          <p>Please try using a different browser or device</p>
        </div>
      </div>
    );
  }
  
  // Handle loading state if DOM not ready
  if (!domReady) {
    return (
      <div 
        ref={containerRef}
        className={`spline-loading ${className}`} 
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="spline-loader" style={{ textAlign: 'center' }}>
          <div className="spline-spinner" style={{ 
            width: '30px', 
            height: '30px', 
            border: '5px solid rgba(255,255,255,0.1)', 
            borderRadius: '50%',
            borderTop: '5px solid #fff',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Preparing 3D scene...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // Once DOM is ready, try to load the Spline component
  return (
    <div
      ref={containerRef}
      className={`spline-container ${className}`}
      style={{
        width: width,
        height: height,
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        overflow: 'hidden', // Add overflow hidden to prevent content from spilling out
        display: 'block', // Ensure block display
        minHeight: '100%' // Ensure minimum height
      }}
      data-retry-count={retryCount}
    >
      <Suspense fallback={
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              margin: '0 auto',
              border: '5px solid rgba(255,255,255,0.1)', 
              borderRadius: '50%',
              borderTop: '5px solid #fff',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '10px' }}>Loading Spline...</p>
          </div>
        </div>
      }>
        {error ? (
          <div className="spline-error" style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: 'red' }}>Error loading Spline scene: {error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  setRetryCount(retryCount + 1);
                }}
                style={{
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <LazySpline
            scene={scene}
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{
              width: '100% !important',
              height: '100% !important',
              objectFit: 'contain', // Change from 'cover' to 'contain' to ensure full robot visibility
              display: 'block', // Ensure block display
              position: 'absolute', // Position absolutely to fill container
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            renderOnDemand={false}
            className="spline-canvas-fullsize" // Add class for styling
          />
        )}
      </Suspense>
    </div>
  );
}

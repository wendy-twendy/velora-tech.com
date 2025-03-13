/**
 * Utility functions for Spline components
 */

/**
 * Loads the Spline module dynamically to avoid SSR issues
 */
export const loadSplineModule = () => {
  console.log('[SplineComponent] Starting to load @splinetool/react-spline module...');
  return import('@splinetool/react-spline')
    .then(module => {
      console.log('[SplineComponent] @splinetool/react-spline module loaded successfully:', module);
      return module; // Return the entire module which includes default export
    })
    .catch(error => {
      console.error('[SplineComponent] Failed to load @splinetool/react-spline module:', error);
      throw error;
    });
};

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Check if window is available
 */
export const isWindowAvailable = typeof window !== 'undefined';

/**
 * Check if WebGL is supported in the current browser
 */
export function checkWebGLSupport() {
  if (!isWindowAvailable) return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const isSupported = !!gl;
    
    if (isSupported && gl) {
      const webgl = gl as WebGLRenderingContext;
      console.log('[SplineComponent] WebGL supported:', 
        webgl.getParameter(webgl.VERSION), 
        'Renderer:', 
        webgl.getParameter(webgl.RENDERER)
      );
    } else {
      console.error('[SplineComponent] WebGL not supported in this browser');
    }
    
    return isSupported;
  } catch (e) {
    console.error('[SplineComponent] Error checking WebGL support:', e);
    return false;
  }
}

/**
 * Initialize debug object in window for troubleshooting
 */
export function initializeDebugObject(webGLSupported: boolean, scene: string) {
  if (isWindowAvailable) {
    (window as any).__SPLINE_DEBUG = {
      webGLSupported,
      scene,
      domReady: false,
      loaded: false,
      errors: [],
      addError: (err: any) => {
        (window as any).__SPLINE_DEBUG.errors.push(err);
        console.error('[SplineComponent] Error added to debug:', err);
      },
      setLoaded: (loaded: boolean) => {
        (window as any).__SPLINE_DEBUG.loaded = loaded;
        console.log('[SplineComponent] Debug loaded state:', loaded);
      },
      setDomReady: (ready: boolean) => {
        (window as any).__SPLINE_DEBUG.domReady = ready;
        console.log('[SplineComponent] Debug DOM ready state:', ready);
      }
    };
  }
}
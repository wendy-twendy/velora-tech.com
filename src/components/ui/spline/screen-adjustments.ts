/**
 * Screen adjustment functions for Spline components
 */

import { AdjustmentParams } from './types';

/**
 * Apply screen-size specific adjustments to the Spline scene
 */
export function applyScreenSizeAdjustments(spline: any, canvas: HTMLCanvasElement, viewportWidth: number) {
  console.log('[SplineComponent] Applying screen size adjustments for width:', viewportWidth);
  
  try {
    // Very small mobile devices (320px and below)
    if (viewportWidth <= 320) {
      console.log('[SplineComponent] Applying very small mobile adjustments');
      adjustCameraAndRobot(spline, {
        fov: 110,
        cameraZ: 18.0,
        cameraY: -1.5,
        zoom: 0.35,
        robotScale: 0.65,
        robotY: 2.0,
        robotZ: -3.0
      });
    }
    // Extra small mobile devices (375px and below)
    else if (viewportWidth <= 375) {
      console.log('[SplineComponent] Applying extra small mobile adjustments');
      adjustCameraAndRobot(spline, {
        fov: 105,
        cameraZ: 16.0,
        cameraY: -1.2,
        zoom: 0.4,
        robotScale: 0.7,
        robotY: 1.8,
        robotZ: -2.5
      });
    }
    // Medium-small mobile devices (480px and below)
    else if (viewportWidth <= 480) {
      console.log('[SplineComponent] Applying medium-small mobile adjustments');
      adjustCameraAndRobot(spline, {
        fov: 100,
        cameraZ: 15.0,
        cameraY: -1.0,
        zoom: 0.45,
        robotScale: 0.75,
        robotY: 1.6,
        robotZ: -2.0
      });
    }
    // Small mobile devices (640px and below)
    else if (viewportWidth <= 640) {
      console.log('[SplineComponent] Applying small mobile adjustments');
      adjustCameraAndRobot(spline, {
        fov: 95,
        cameraZ: 14.0,
        cameraY: -0.8,
        zoom: 0.5,
        robotScale: 0.8,
        robotY: 1.5,
        robotZ: -1.5
      });
    }
    // Tablet devices (992px and below)
    else if (viewportWidth <= 992) {
      console.log('[SplineComponent] Applying tablet adjustments');
      adjustCameraAndRobot(spline, {
        fov: 75,
        cameraZ: 7.0,
        cameraY: -0.5,
        zoom: 0.65,
        robotScale: 0.9,
        robotY: 0.8,
        robotZ: -0.5
      });
    }
    // Desktop (above 992px)
    else {
      console.log('[SplineComponent] Applying desktop adjustments');
      adjustCameraAndRobot(spline, {
        fov: 60,
        cameraZ: 7.0, // Increased pull back to show more of the robot
        cameraY: -0.5, // More aggressive vertical adjustment
        zoom: 0.9, // Slight scaling down to ensure full visibility
        robotScale: 1.0,
        robotY: -0.3, // Lower position to prevent head from being cropped
        robotZ: 0
      });
      
      // Force a canvas update to ensure proper rendering
      if (canvas) {
        canvas.style.objectFit = 'contain'; // Use contain to ensure the full robot is visible
        setTimeout(() => {
          // Force a redraw
          canvas.style.display = 'none';
          setTimeout(() => {
            canvas.style.display = 'block';
          }, 10);
        }, 50);
      }
    }
    
    // Apply base styles for all screen sizes
    applyCanvasStyles(canvas, viewportWidth);
    
  } catch (e) {
    console.warn('[SplineComponent] Error applying screen size adjustments:', e);
  }
}

/**
 * Apply styles to the canvas element based on screen size
 */
export function applyCanvasStyles(canvas: HTMLCanvasElement, viewportWidth: number) {
  // Apply base styles for all screen sizes
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.minHeight = '100%';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.display = 'block';
  
  // Set minimum width to prevent canvas from becoming too narrow
  canvas.style.minWidth = '280px';
  
  // Add transition for smoother visual changes
  canvas.style.transition = 'transform 0.3s ease-out, margin 0.3s ease-out';
  
  // Apply object-fit based on screen size
  if (viewportWidth < 640) {
    // For mobile, use 'contain' to ensure the full robot is visible
    canvas.style.objectFit = 'contain';
    
    // Add mobile-specific canvas adjustments
    canvas.style.transformOrigin = 'center center';
    canvas.style.transform = 'scale(1.0)'; // Ensure no additional scaling is applied
    
    // Add a slight offset to center the content better
    canvas.style.marginTop = '-20px';
  } else {
    // For desktop view, also use 'contain' to ensure the full robot is visible
    // This is a change from the previous 'cover' setting
    canvas.style.objectFit = 'contain';
    
    // Reset any adjustments for larger screens
    canvas.style.transform = 'none';
    canvas.style.marginTop = '0';
    
    // Add desktop-specific canvas adjustments
    if (viewportWidth >= 992) {
      // Ensure the canvas is properly centered
      canvas.style.transformOrigin = 'center center';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.right = '0';
      canvas.style.bottom = '0';
      canvas.style.margin = 'auto';
    }
  }
}

/**
 * Adjust camera and robot with consistent parameters
 */
export function adjustCameraAndRobot(spline: any, params: AdjustmentParams) {
  if (!spline || !spline.runtime) return;
  
  try {
    const runtime = spline.runtime;
    
    // Adjust camera if available
    if (runtime.camera) {
      console.log('[SplineComponent] Adjusting camera with params:',
        'FOV:', params.fov,
        'Z:', params.cameraZ,
        'Y:', params.cameraY
      );
      
      runtime.camera.fov = params.fov;
      runtime.camera.position.z += params.cameraZ;
      runtime.camera.position.y += params.cameraY;
      runtime.camera.updateProjectionMatrix();
    }
    
    // Apply zoom if available
    if (typeof runtime.setZoom === 'function') {
      console.log('[SplineComponent] Setting zoom:', params.zoom);
      runtime.setZoom(params.zoom);
    }
    
    // Find and adjust robot object
    const robotObject = spline.findObjectByName('Robot');
    if (robotObject) {
      console.log('[SplineComponent] Adjusting robot with params:',
        'Scale:', params.robotScale,
        'Y:', params.robotY,
        'Z:', params.robotZ
      );
      
      robotObject.scale.set(params.robotScale, params.robotScale, params.robotScale);
      robotObject.position.y = params.robotY;
      robotObject.position.z = params.robotZ;
      robotObject.position.x = 0; // Center horizontally
      
      // Log the robot's position for debugging
      console.log('[SplineComponent] Robot position after adjustment:',
        'X:', robotObject.position.x,
        'Y:', robotObject.position.y,
        'Z:', robotObject.position.z
      );
    } else {
      console.log('[SplineComponent] Robot object not found by name, trying scene traversal');
      
      // Try to find robot through scene traversal
      if (runtime.scene) {
        runtime.scene.traverse((object: any) => {
          // Look for objects that might be the robot (by name pattern or type)
          if (object.name && (
              object.name.toLowerCase().includes('robot') ||
              object.name.toLowerCase().includes('character') ||
              object.name.toLowerCase().includes('model')
          )) {
            console.log('[SplineComponent] Found potential robot object:', object.name);
            // Apply the same adjustments with absolute positioning
            object.scale.set(params.robotScale, params.robotScale, params.robotScale);
            object.position.y = params.robotY; // Set absolute position instead of adding
            object.position.z = params.robotZ; // Set absolute position instead of adding
            object.position.x = 0; // Center horizontally
            
            // Log the object's position for debugging
            console.log('[SplineComponent] Potential robot object position after adjustment:',
              'Name:', object.name,
              'X:', object.position.x,
              'Y:', object.position.y,
              'Z:', object.position.z
            );
          }
        });
      }
    }
    
    // Force update the scene
    runtime.update();
  } catch (e) {
    console.warn('[SplineComponent] Error in adjustCameraAndRobot:', e);
  }
}
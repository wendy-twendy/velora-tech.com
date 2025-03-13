/**
 * Scene adjustment utilities for SplineSceneBasic component
 */

import React from 'react';

/**
 * Adjusts the Spline scene based on viewport size
 */
export function adjustSplineScene(splineRef: React.RefObject<any>, containerRef: React.RefObject<HTMLDivElement | null>) {
  if (!splineRef.current) return;

  try {
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
    
    // Try to find the robot object
    const robotObject = splineRef.current.findObjectByName('Robot');
    
    // Get the camera for adjustments
    const camera = splineRef.current.findObjectByName('Camera');
    
    // Get the Spline runtime for direct scene manipulation
    const runtime = splineRef.current.runtime;
    
    // FALLBACK APPROACH: If we can't find the camera or robot, we'll use direct canvas and runtime manipulation
    // This ensures the scene is properly displayed even when objects can't be found
    
    // Apply direct scene adjustments based on viewport size
    if (runtime) {
      console.log("Found Spline runtime, applying direct scene adjustments");
      
      // Adjust the field of view (FOV) to show more of the scene on mobile
      if (viewportWidth < 640) {
        // Mobile view - pull back the view significantly
        try {
          // Try to adjust the scene's default camera FOV
          if (runtime.camera) {
            console.log("Adjusting camera FOV for mobile");
            // Increase FOV to see more of the scene (like zooming out)
            runtime.camera.fov = 90; // Much wider FOV for mobile (default is usually around 50-60)
            runtime.camera.updateProjectionMatrix();
            
            // Try to adjust camera position directly through runtime
            runtime.camera.position.z += 10.0; // Pull back significantly more
            runtime.camera.position.y -= 1.0; // Look up more to center the view
            runtime.camera.updateProjectionMatrix();
          }
          
          // Apply a global scale to the scene to make everything more visible
          if (typeof runtime.setZoom === 'function') {
            runtime.setZoom(0.5); // Scale down more aggressively to show more content
          }
          
          // Try to access the scene directly
          if (runtime.scene) {
            console.log("Traversing scene to find and adjust robot objects");
            // Try to find the robot in the scene hierarchy
            runtime.scene.traverse((object: any) => {
              // Look for objects that might be the robot (by name pattern or type)
              if (object.name && (
                  object.name.toLowerCase().includes('robot') ||
                  object.name.toLowerCase().includes('character') ||
                  object.name.toLowerCase().includes('model')
              )) {
                console.log("Found potential robot object by name pattern:", object.name);
                // Scale it down and adjust position
                object.scale.set(0.7, 0.7, 0.7);
                object.position.y += 1.5;
                object.position.z -= 2.0;
                object.position.x = 0; // Ensure horizontal centering
              }
              
              // Also look for mesh objects that might be the main model
              if (object.type === 'Mesh' && object.geometry) {
                // Check if this is a significant object by its name or properties
                const isSignificant =
                  object.name.toLowerCase().includes('main') ||
                  object.name.toLowerCase().includes('body') ||
                  object.name.toLowerCase().includes('model') ||
                  // Check if it has a significant scale
                  (object.scale &&
                   (object.scale.x > 1 || object.scale.y > 1 || object.scale.z > 1));
                
                if (isSignificant) {
                  console.log("Found significant mesh object that might be the robot:", object.name);
                  // Scale it down
                  object.scale.set(
                    object.scale.x * 0.7,
                    object.scale.y * 0.7,
                    object.scale.z * 0.7
                  );
                  // Center it horizontally
                  object.position.x = 0;
                }
              }
            });
          }
        } catch (e) {
          console.warn("Error adjusting camera FOV:", e);
        }
      } else if (viewportWidth < 1024) {
        // Tablet view - moderate adjustments
        try {
          if (runtime.camera) {
            runtime.camera.fov = 75; // Wider FOV for tablet
            runtime.camera.position.z += 7.0; // Pull back more
            runtime.camera.position.y -= 0.5; // Look up more
            runtime.camera.updateProjectionMatrix();
          }
          
          if (typeof runtime.setZoom === 'function') {
            runtime.setZoom(0.65); // More aggressive scaling for tablet
          }
        } catch (e) {
          console.warn("Error adjusting camera FOV:", e);
        }
      } else {
        // Desktop view - standard view with improved positioning
        try {
          if (runtime.camera) {
            console.log("Adjusting camera FOV for desktop");
            runtime.camera.fov = 60; // Standard FOV
            runtime.camera.position.z += 6.0; // Significant pull back to show more of the robot
            runtime.camera.position.y -= 0.5; // Look up more to center the view
            runtime.camera.updateProjectionMatrix();
          }
          
          if (typeof runtime.setZoom === 'function') {
            runtime.setZoom(0.9); // Slight scaling down to ensure full visibility
          }
          
          // Try to access the scene directly for desktop view
          if (runtime.scene) {
            console.log("Traversing scene to find and adjust robot objects for desktop view");
            runtime.scene.traverse((object: any) => {
              // Look for objects that might be the robot (by name pattern or type)
              if (object.name && (
                  object.name.toLowerCase().includes('robot') ||
                  object.name.toLowerCase().includes('character') ||
                  object.name.toLowerCase().includes('model')
              )) {
                console.log("Found potential robot object for desktop view:", object.name);
                // Set absolute position for desktop view
                object.scale.set(1.0, 1.0, 1.0);
                object.position.y = -0.3; // Lower position to prevent head from being cropped
                object.position.z = 0;
                object.position.x = 0; // Ensure perfect horizontal centering
              }
              
              // Also look for mesh objects that might be the main model
              if (object.type === 'Mesh' && object.geometry) {
                // Check if this is a significant object by its name or properties
                const isSignificant =
                  object.name.toLowerCase().includes('main') ||
                  object.name.toLowerCase().includes('body') ||
                  object.name.toLowerCase().includes('model') ||
                  // Check if it has a significant scale
                  (object.scale &&
                   (object.scale.x > 1 || object.scale.y > 1 || object.scale.z > 1));
                
                if (isSignificant) {
                  console.log("Found significant mesh object for desktop view:", object.name);
                  // Center it horizontally
                  object.position.x = 0;
                }
              }
            });
          }
        } catch (e) {
          console.warn("Error adjusting camera FOV:", e);
        }
      }
      
      // Force the scene to update with new settings
      runtime.update();
    }
    
    // If we found the camera object, make additional adjustments
    if (camera) {
      console.log("Found camera object:", camera);
      
      // Adjust camera position based on screen size
      if (viewportWidth < 640) {
        // Mobile view
        camera.position.z += 7.0; // Pull back significantly more for full view
        camera.position.y -= 0.5; // Look up more to center the robot
      } else if (viewportWidth < 1024) {
        // Tablet view
        camera.position.z += 5.5; // Pull back more for full view
        camera.position.y -= 0.3; // Look up slightly more
      } else {
        // Desktop view
        camera.position.z += 5.0; // Pull back significantly more to show full scene
        camera.position.y -= 0.2; // Slight vertical adjustment to center the view
      }
    } else {
      console.warn("Camera object not found in Spline scene, using fallback adjustments");
    }
    
    // If robot object is found, adjust its position
    if (robotObject) {
      console.log("Found robot object:", robotObject);

      // Center the robot horizontally and vertically
      robotObject.position.x = 0;
      
      // Adjust robot position based on screen size
      if (viewportWidth < 640) {
        // Mobile view - make robot more prominent and fully visible
        robotObject.position.y = 1.2; // Raise position significantly to center in taller container
        robotObject.position.z = -1.0; // Move forward slightly to be more visible
        // Scale the robot down slightly to ensure it fits in the viewport
        robotObject.scale.set(0.85, 0.85, 0.85);
      } else if (viewportWidth < 1024) {
        // Tablet view
        robotObject.position.y = 0.8; // Raise position to center in taller container
        robotObject.position.z = -0.5; // Move forward slightly
        robotObject.scale.set(0.9, 0.9, 0.9);
      } else {
        // Desktop view - position for optimal visibility
        robotObject.position.y = -0.3; // Lower position to prevent head from being cropped
        robotObject.position.z = 0;
        robotObject.position.x = 0; // Ensure perfect horizontal centering
        robotObject.scale.set(1.0, 1.0, 1.0); // Original scale
      }
    } else {
      console.warn("Robot object not found in Spline scene, using fallback adjustments only");
    }

    // Force the scene to update with new positions
    splineRef.current.runtime?.update();
    
    // Apply styles to the canvas element directly
    if (splineContainer) {
      const canvas = splineContainer.querySelector('canvas');
      if (canvas) {
        console.log("Found canvas element, applying styles directly");
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.minHeight = '100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.display = 'block';
        canvas.style.objectFit = 'cover';
        
        // Force the canvas to match container dimensions
        const containerWidth = splineContainer.offsetWidth;
        const containerHeight = splineContainer.offsetHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        // Add mobile-specific canvas adjustments
        if (viewportWidth < 640) {
          // For mobile, ensure the canvas is properly centered and scaled
          canvas.style.transformOrigin = 'center center';
          canvas.style.transform = 'scale(1.0)'; // Ensure no additional scaling is applied
          
          // Add a slight offset to center the content better
          canvas.style.marginTop = '-20px';
        } else {
          // Reset any adjustments for larger screens
          canvas.style.transform = 'none';
          canvas.style.marginTop = '0';
        }
      }
    }
  } catch (err) {
    console.error("Error adjusting Spline scene:", err);
  }
}

/**
 * Handles the Spline scene load event
 */
export function handleSplineLoad(
  spline: any,
  splineRef: React.RefObject<any>,
  setIsLoading: (loading: boolean) => void
) {
  console.log("Spline scene loaded", spline);
  splineRef.current = spline;
  
  // Force a resize event immediately to ensure proper initialization
  window.dispatchEvent(new Event('resize'));
  
  // Adjust the scene once it's loaded
  adjustSplineScene(splineRef, { current: document.querySelector('.spline-container') });
  
  // Set loading state to false
  setIsLoading(false);
  
  // Add a small delay and adjust again to ensure everything is properly sized
  setTimeout(() => {
    if (splineRef.current) {
      // Force another resize event
      window.dispatchEvent(new Event('resize'));
      adjustSplineScene(splineRef, { current: document.querySelector('.spline-container') });
    }
  }, 100);
  
  // Apply immediate desktop-specific adjustments if on desktop
  if (window.innerWidth >= 992 && splineRef.current && splineRef.current.runtime) {
    try {
      // Apply desktop-specific adjustments immediately
      const runtime = splineRef.current.runtime;
      if (runtime.camera) {
        console.log("Applying immediate desktop-specific camera adjustments");
        runtime.camera.position.z += 2.0; // Pull back more to show full robot
        runtime.camera.position.y -= 0.2; // Adjust vertical position
        runtime.camera.updateProjectionMatrix();
      }
      
      // Apply desktop-specific scene traversal
      if (runtime.scene) {
        console.log("Traversing scene to find and adjust robot objects for desktop view");
        runtime.scene.traverse((object: any) => {
          // Look for objects that might be the robot (by name pattern or type)
          if (object.name && (
              object.name.toLowerCase().includes('robot') ||
              object.name.toLowerCase().includes('character') ||
              object.name.toLowerCase().includes('model')
          )) {
            console.log("Found potential robot object for desktop view:", object.name);
            // Set absolute position for desktop view
            object.scale.set(1.0, 1.0, 1.0);
            object.position.y = -0.3; // Lower position to prevent head from being cropped
            object.position.z = 0;
            object.position.x = 0; // Ensure perfect horizontal centering
          }
        });
      }
      
      // Force update
      runtime.update();
    } catch (e) {
      console.warn("Error applying immediate desktop adjustments:", e);
    }
  }
  
  // Trigger a resize event after a longer delay to ensure proper rendering
  // This helps with the issue where resizing the window makes the scene look better
  setTimeout(() => {
    if (splineRef.current) {
      // Dispatch a resize event to trigger responsive adjustments
      window.dispatchEvent(new Event('resize'));
      
      // Make another adjustment after the resize event
      setTimeout(() => {
        if (splineRef.current) {
          adjustSplineScene(splineRef, { current: document.querySelector('.spline-container') });
        }
      }, 50);
    }
  }, 500);
  
  // For mobile devices, add an additional adjustment with more aggressive settings
  if (window.innerWidth < 640) {
    setTimeout(() => {
      if (splineRef.current && splineRef.current.runtime) {
        try {
          // Try more aggressive camera adjustments for mobile
          const runtime = splineRef.current.runtime;
          if (runtime.camera) {
            console.log("Applying additional mobile-specific camera adjustments");
            runtime.camera.fov = 100; // Very wide FOV
            runtime.camera.position.z += 15.0; // Pull back significantly
            runtime.camera.updateProjectionMatrix();
          }
          
          // Apply a more aggressive zoom for mobile
          if (typeof runtime.setZoom === 'function') {
            runtime.setZoom(0.4); // Very aggressive scaling
          }
          
          // Force update
          runtime.update();
        } catch (e) {
          console.warn("Error applying additional mobile adjustments:", e);
        }
      }
    }, 1000);
  }
  // For desktop view, add additional adjustments
  else if (window.innerWidth >= 992) {
    setTimeout(() => {
      if (splineRef.current && splineRef.current.runtime) {
        try {
          // Apply desktop-specific adjustments
          const runtime = splineRef.current.runtime;
          if (runtime.camera) {
            console.log("Applying additional desktop-specific camera adjustments");
            runtime.camera.position.z += 2.0; // Pull back more to show full robot
            runtime.camera.position.y -= 0.2; // Adjust vertical position
            runtime.camera.updateProjectionMatrix();
          }
          
          // Force multiple resize events to ensure proper rendering
          // This helps with the issue where the robot is not properly positioned on initial load
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
              adjustSplineScene(splineRef, { current: document.querySelector('.spline-container') });
            }, i * 300); // Stagger the resize events
          }
          
          // Force update
          runtime.update();
        } catch (e) {
          console.warn("Error applying additional desktop adjustments:", e);
        }
      }
    }, 800);
  }
}
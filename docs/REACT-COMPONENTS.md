# React Components Integration

## Overview

The Velora Tech website integrates React components within the traditional component system to enable advanced interactive features like 3D visualizations. This document outlines the architecture, implementation details, and troubleshooting guidelines for the React component integration.

## Architecture

The React component integration uses a bridge pattern to seamlessly incorporate React components into the existing component system:

1. **React Component Bridge**: A TypeScript class that manages the lifecycle of React components and renders them into specified DOM elements.
2. **Component Registration**: React components are registered in the component map with their corresponding data-component attribute values.
3. **Component Loading**: The traditional component loader identifies React components and delegates their rendering to the React Component Bridge.
4. **Event-based Communication**: Custom events are used to communicate between the traditional component system and React components.

## Spline 3D Integration

The website features a 3D visualization using the Spline tool, which is implemented as a React component:

### Components

1. **SplineSceneBasic**: The main container component that handles loading states, error handling, WebGL support detection, and responsive sizing.
2. **SplineScene**: A wrapper around the Spline React component that manages the loading of the 3D scene and handles canvas rendering.

### Implementation Details

- The Spline scene is lazy-loaded to improve initial page load performance.
- WebGL support is checked before attempting to load the 3D scene to prevent errors on unsupported browsers.
- Comprehensive error handling provides user-friendly fallbacks when the 3D scene cannot be loaded.
- Debug information is available through the global `__reactComponentBridgeDebug` object.
- The component dynamically adjusts its dimensions to match the hero section layout.
- Camera and object positioning are adjusted based on viewport size for optimal viewing on different devices.

### Responsive Behavior

The Spline scene implements responsive behavior to ensure proper display across different screen sizes:

1. **Desktop View (≥992px)**:
   - The hero section uses a side-by-side layout with 40% width for content and 60% width for the Spline scene
   - The robot is positioned to be fully visible with proper camera distance
   - Fixed height (450px) ensures consistent appearance

2. **Tablet View (≥640px and <992px)**:
   - Adjusted camera position to frame the robot properly on medium-sized screens
   - Modified robot positioning for optimal visibility

3. **Mobile View (<640px)**:
   - Stacked layout with the Spline scene below the hero content
   - Full width display with adjusted height
   - Camera pulled back further to show the complete robot

### Sizing and Positioning

The Spline scene implements several techniques to ensure proper sizing and positioning:

1. **Container Sizing**:
   - The container dimensions are calculated based on the hero section and hero content dimensions
   - Height is set to match the content area or use fixed heights for consistent appearance
   - Width is set to 100% of the available space in its container

2. **Object Positioning**:
   - The robot is positioned using 3D coordinates to ensure it's centered and fully visible
   - Camera position is adjusted based on screen size to frame the robot properly
   - Position adjustments are made dynamically when the viewport size changes

3. **Overflow Prevention**:
   - CSS `overflow: hidden` is applied to containers to prevent content from spilling out
   - Object scaling is carefully managed to prevent overflow issues
   - Canvas dimensions are controlled to stay within container boundaries

## Troubleshooting

### Common Issues

1. **Spline Scene Not Loading**:
   - Ensure WebGL is supported in the browser
   - Check for console errors related to the Spline module
   - Verify that the React Component Bridge is properly initialized in app.ts
   - Confirm that the component-loader.ts file includes the Spline component in the REACT_COMPONENTS list

2. **React Component Bridge Not Initializing**:
   - Ensure the ReactComponentBridge.init() method is called after components are loaded in app.ts
   - Check for console errors during initialization
   - Verify that the required dependencies (React, ReactDOM) are properly loaded

3. **TypeScript Errors**:
   - Ensure proper type assertions are used for WebGL context properties
   - Use appropriate event types for custom events
   - Provide proper type definitions for component props

4. **Spline Scene Overflow Issues**:
   - Check container dimensions in the browser inspector
   - Verify that the hero-content and hero-image containers have appropriate sizing
   - Ensure CSS `overflow: hidden` is applied to the appropriate containers
   - Check for fixed width/height values that might be causing overflow
   - Verify that the robot positioning in `adjustSplineScene()` is appropriate for the viewport size

5. **Robot Visibility Issues**:
   - Adjust the robot's Y position to ensure it's fully visible
   - Modify camera position to frame the robot properly
   - Check the container height to ensure it's sufficient to display the full robot
   - Adjust the camera's Z position to pull back and show more of the robot
   - Use browser developer tools to inspect the canvas dimensions and container constraints

### Debugging Tools

- The React Component Bridge exposes a debug object (`window.__reactComponentBridgeDebug`) that tracks:
  - Spline loading status
  - Spline errors
  - Mounted components

- Console logs are prefixed with namespaces (e.g., `[ReactComponentBridge]`, `[SplineScene]`) for easier filtering and identification.

## Best Practices

1. **Component Registration**:
   - Register all React components in the ReactComponentBridge.componentMap
   - Use consistent naming between component files and data-component attributes

2. **Error Handling**:
   - Always provide user-friendly fallbacks for failed component loading
   - Log detailed error information to the console for debugging

3. **Performance Optimization**:
   - Use lazy loading for heavy components like Spline scenes
   - Implement proper cleanup in useEffect hooks to prevent memory leaks

4. **Bilingual Support**:
   - Ensure all React components support both English and Albanian languages
   - Use the language context or getCurrentLanguage() function to access the current language

5. **Responsive 3D Integration**:
   - Use relative units (%, vh, vw) instead of fixed pixel values where possible
   - Implement viewport-specific adjustments for different screen sizes
   - Apply `overflow: hidden` to container elements to prevent content spillover
   - Use media queries to adjust layout and sizing based on viewport dimensions
   - Test on various screen sizes to ensure proper display and functionality

6. **3D Object Positioning**:
   - Position 3D objects dynamically based on container dimensions
   - Adjust camera distance and angle for optimal viewing on different devices
   - Use console logging to debug positioning issues with exact coordinates
   - Implement resize event listeners to adjust positioning when viewport changes
   - Consider using fixed heights for consistent appearance on desktop views

## Future Improvements

- Implement a more robust component registration system
- Add unit tests for React components
- Improve error recovery mechanisms
- Enhance the debugging tools with more detailed information
- Implement a more sophisticated responsive sizing system for 3D scenes
- Create a dedicated configuration system for Spline scene parameters
- Add performance optimizations for mobile devices with limited GPU capabilities
- Develop a fallback system that shows static images when WebGL is not supported
- Implement progressive loading for 3D assets to improve initial load time
- Create a centralized positioning system for 3D objects across different viewport sizes

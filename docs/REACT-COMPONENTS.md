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

1. **SplineSceneBasic**: The main container component that handles loading states, error handling, and WebGL support detection.
2. **SplineScene**: A wrapper around the Spline React component that manages the loading of the 3D scene.

### Implementation Details

- The Spline scene is lazy-loaded to improve initial page load performance.
- WebGL support is checked before attempting to load the 3D scene to prevent errors on unsupported browsers.
- Comprehensive error handling provides user-friendly fallbacks when the 3D scene cannot be loaded.
- Debug information is available through the global `__reactComponentBridgeDebug` object.

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

## Future Improvements

- Implement a more robust component registration system
- Add unit tests for React components
- Improve error recovery mechanisms
- Enhance the debugging tools with more detailed information

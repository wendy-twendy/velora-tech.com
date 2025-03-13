/**
 * Type definitions for Spline components
 */

/**
 * Props for the SplineScene component
 */
export interface SplineSceneProps {
  /** URL of the Spline scene to load */
  scene: string;
  /** Optional CSS class name */
  className?: string;
  /** Width of the scene container */
  width?: string | number;
  /** Height of the scene container */
  height?: string | number;
  /** Scale factor for the scene */
  scale?: number;
  /** Callback function when the scene is loaded */
  onLoad?: (spline: any) => void;
}

/**
 * Parameters for adjusting camera and robot
 */
export interface AdjustmentParams {
  /** Field of view for the camera */
  fov: number;
  /** Camera Z position adjustment */
  cameraZ: number;
  /** Camera Y position adjustment */
  cameraY: number;
  /** Zoom level */
  zoom: number;
  /** Robot scale factor */
  robotScale: number;
  /** Robot Y position */
  robotY: number;
  /** Robot Z position */
  robotZ: number;
}
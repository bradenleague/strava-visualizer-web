/**
 * Configuration for 3D visualization of activity routes
 * This file contains all the customizable parameters for the 3D visualization
 * Artists can modify these values to change the appearance and behavior of the visualization
 */

export interface VisualizationConfig {
  // Canvas settings
  canvas: {
    height: string;
    backgroundColor: string;
    borderRadius: string;
  };
  
  // Lighting settings
  lighting: {
    ambient: {
      intensity: number;
      color: string;
    };
    point: {
      position: [number, number, number];
      intensity: number;
      color: string;
    };
  };
  
  // Camera settings
  camera: {
    initialPosition: [number, number, number];
    fov: number;
    near: number;
    far: number;
    autoFitPadding: number; // Multiplier for distance when auto-fitting the path
  };
  
  // Path settings
  path: {
    lineWidth: number;
    defaultColor: string;
    animate: boolean;
    animation: {
      speed: number; // Speed of color animation (lower is slower)
      saturation: number; // 0-1
      lightness: number; // 0-1
    };
  };
  
  // Coordinate normalization
  coordinates: {
    scale: number; // Base scale factor for the entire visualization
    elevationScale: number; // Multiplier for elevation to make it more visible
    centerAtOrigin: boolean; // Whether to center the path at the origin
  };
  
  // Controls
  controls: {
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    dampingFactor: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
  };
  
  // UI elements
  ui: {
    loadingText: string;
    errorText: string;
    noDataText: string;
    fontSize: number;
    textColor: string;
    errorColor: string;
  };
}

/**
 * Default configuration for 3D visualization
 * Modify these values to change the appearance and behavior of the visualization
 */
const defaultConfig: VisualizationConfig = {
  canvas: {
    height: "500px",
    backgroundColor: "#1a1a2e", // Dark blue background
    borderRadius: "0.5rem",
  },
  
  lighting: {
    ambient: {
      intensity: 0.5,
      color: "#ffffff",
    },
    point: {
      position: [10, 10, 10],
      intensity: 1.0,
      color: "#ffffff",
    },
  },
  
  camera: {
    initialPosition: [0, 5, 10],
    fov: 75,
    near: 0.1,
    far: 1000,
    autoFitPadding: 1.2, // 20% padding around the path
  },
  
  path: {
    lineWidth: 3,
    defaultColor: "hotpink",
    animate: true,
    animation: {
      speed: 0.1,
      saturation: 0.8,
      lightness: 0.5,
    },
  },
  
  coordinates: {
    scale: 10, // Base scale factor
    elevationScale: 0.2, // Scale elevation less to avoid extreme heights
    centerAtOrigin: true,
  },
  
  controls: {
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    dampingFactor: 0.05,
    autoRotate: false,
    autoRotateSpeed: 1.0,
  },
  
  ui: {
    loadingText: "Loading activity data...",
    errorText: "Error: ",
    noDataText: "No route data available",
    fontSize: 0.5,
    textColor: "white",
    errorColor: "red",
  },
};

export default defaultConfig; 
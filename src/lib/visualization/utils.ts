import * as THREE from 'three';
import { VisualizationConfig } from './config';

/**
 * Normalizes GPS coordinates and elevations into 3D space
 * 
 * @param coordinates - Array of [latitude, longitude] pairs
 * @param elevations - Array of elevation values corresponding to each coordinate
 * @param config - Visualization configuration
 * @returns Array of THREE.Vector3 points representing the normalized path
 */
export function normalizeCoordinates(
  coordinates: [number, number][],
  elevations: number[],
  config: VisualizationConfig
): THREE.Vector3[] {
  if (!coordinates.length) return [];

  // Find the min/max values for normalization
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  let minEle = Infinity, maxEle = -Infinity;

  coordinates.forEach(([lat, lng], i) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    
    if (elevations[i] !== undefined) {
      minEle = Math.min(minEle, elevations[i]);
      maxEle = Math.max(maxEle, elevations[i]);
    }
  });

  // Calculate center point if needed
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Calculate scale factors
  const latRange = maxLat - minLat || 1; // Avoid division by zero
  const lngRange = maxLng - minLng || 1;
  const eleRange = maxEle - minEle || 1;
  
  const scale = config.coordinates.scale / Math.max(latRange, lngRange);
  const eleScale = scale * config.coordinates.elevationScale;
  
  // Convert to normalized 3D coordinates
  return coordinates.map(([lat, lng], i) => {
    // If centerAtOrigin is true, center the path at the origin
    // In THREE.js, X is right (east), Z is forward (north), Y is up
    // For a top-down view with north up, we map:
    // - longitude to X (east-west)
    // - latitude to Z (north-south), with POSITIVE Z for NORTH (to make north point up in the view)
    // - elevation to Y (up-down)
    const x = (lng - (config.coordinates.centerAtOrigin ? centerLng : 0)) * scale;
    
    // Map latitude to Z axis so that north is pointing up in the visualization
    // Higher latitude (north) should be positive Z in THREE.js coordinates
    const z = (lat - (config.coordinates.centerAtOrigin ? centerLat : 0)) * scale;
    
    // Calculate elevation (y-axis)
    const y = elevations[i] !== undefined 
      ? ((elevations[i] - minEle) / eleRange) * eleScale 
      : 0;
    
    return new THREE.Vector3(x, y, z);
  });
}

/**
 * Calculates camera position to fit the entire path in view
 * 
 * @param points - Array of 3D points representing the path
 * @param camera - THREE.PerspectiveCamera instance
 * @param config - Visualization configuration
 */
export function fitCameraToPath(
  points: THREE.Vector3[],
  camera: THREE.Camera,
  config: VisualizationConfig
): void {
  if (points.length === 0) return;
  
  // Calculate bounding box
  const box = new THREE.Box3().setFromPoints(points);
  const center = new THREE.Vector3();
  box.getCenter(center);
  
  // Calculate size and distance
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  
  // Position camera based on camera type
  if (camera instanceof THREE.PerspectiveCamera) {
    const fov = camera.fov * (Math.PI / 180);
    const distance = (maxDim / (2 * Math.tan(fov / 2))) * config.camera.autoFitPadding;
    
    // Position camera directly above the path (top-down view with north up)
    // In THREE.js, Y is up, Z is forward/north (positive), X is right/east (positive)
    camera.position.set(
      center.x,  // Same X position as center
      center.y + distance, // Above the path
      center.z   // Same Z position as center
    );
    
    // Set camera to look directly down
    camera.lookAt(center);
    
    // Apply initial position from config if specified
    if (config.camera.initialPosition) {
      // We can use the initialPosition as an offset from the calculated position
      camera.position.x += config.camera.initialPosition[0];
      camera.position.y += config.camera.initialPosition[1];
      camera.position.z += config.camera.initialPosition[2];
    }
    
    // Rotate the camera to ensure north is up in the view
    // This is done by setting the camera's up vector to point in the positive Z direction
    camera.up.set(0, 0, 1);
  } else {
    // Fallback for other camera types
    camera.position.set(
      center.x,
      center.y + maxDim * config.camera.autoFitPadding,
      center.z
    );
    camera.lookAt(center);
  }
} 
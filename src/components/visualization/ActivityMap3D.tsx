'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { StravaStream } from '@/lib/strava/api';
import defaultConfig, { VisualizationConfig } from '@/lib/visualization/config';
import ActivityScene from './ActivityScene';

interface ActivityMap3DProps {
  activityId: number;
  initialData?: {
    latlng?: StravaStream;
    altitude?: StravaStream;
    distance?: StravaStream;
  };
  config?: Partial<VisualizationConfig>;
}

/**
 * Main component for 3D visualization of activity routes
 * 
 * @param activityId - ID of the activity to visualize
 * @param initialData - Optional pre-loaded activity data
 * @param config - Optional configuration overrides
 */
export default function ActivityMap3D({ 
  activityId, 
  initialData,
  config: configOverrides = {}
}: ActivityMap3DProps) {
  // Merge default config with any provided overrides
  const [config] = useState<VisualizationConfig>(() => {
    return {
      ...defaultConfig,
      ...configOverrides,
      // Deep merge nested objects
      canvas: { ...defaultConfig.canvas, ...configOverrides.canvas },
      lighting: { 
        ...defaultConfig.lighting, 
        ...configOverrides.lighting,
        ambient: { ...defaultConfig.lighting.ambient, ...configOverrides.lighting?.ambient },
        point: { ...defaultConfig.lighting.point, ...configOverrides.lighting?.point }
      },
      camera: { ...defaultConfig.camera, ...configOverrides.camera },
      path: { 
        ...defaultConfig.path, 
        ...configOverrides.path,
        animation: { ...defaultConfig.path.animation, ...configOverrides.path?.animation }
      },
      coordinates: { ...defaultConfig.coordinates, ...configOverrides.coordinates },
      controls: { ...defaultConfig.controls, ...configOverrides.controls },
      ui: { ...defaultConfig.ui, ...configOverrides.ui }
    };
  });

  return (
    <div 
      className="overflow-hidden" 
      style={{ 
        width: '100%',
        height: config.canvas.height,
        backgroundColor: config.canvas.backgroundColor,
        borderRadius: config.canvas.borderRadius
      }}
    >
      <Canvas>
        {/* Lighting */}
        <ambientLight 
          intensity={config.lighting.ambient.intensity} 
          color={config.lighting.ambient.color} 
        />
        <pointLight 
          position={config.lighting.point.position} 
          intensity={config.lighting.point.intensity}
          color={config.lighting.point.color}
        />
        
        {/* Camera */}
        <PerspectiveCamera 
          makeDefault 
          position={config.camera.initialPosition}
          fov={config.camera.fov}
          near={config.camera.near}
          far={config.camera.far}
        />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={config.controls.enablePan}
          enableZoom={config.controls.enableZoom}
          enableRotate={config.controls.enableRotate}
          dampingFactor={config.controls.dampingFactor}
          autoRotate={config.controls.autoRotate}
          autoRotateSpeed={config.controls.autoRotateSpeed}
        />
        
        {/* Activity Scene */}
        <ActivityScene 
          activityId={activityId} 
          initialData={initialData}
          config={config}
        />
      </Canvas>
    </div>
  );
} 
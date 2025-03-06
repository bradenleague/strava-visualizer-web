'use client';

import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationConfig } from '@/lib/visualization/config';

interface ActivityPathProps {
  points: THREE.Vector3[];
  config: VisualizationConfig;
}

/**
 * Renders the 3D path of an activity
 * 
 * @param points - Array of 3D points representing the path
 * @param config - Visualization configuration
 */
export default function ActivityPath({ points, config }: ActivityPathProps) {
  const [lineColor, setLineColor] = useState(new THREE.Color(config.path.defaultColor));
  
  // Animate the line color if animation is enabled
  useFrame(({ clock }) => {
    if (config.path.animate) {
      const hue = (clock.getElapsedTime() * config.path.animation.speed) % 1;
      const newColor = new THREE.Color().setHSL(
        hue, 
        config.path.animation.saturation, 
        config.path.animation.lightness
      );
      setLineColor(newColor);
    }
  });

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={config.path.lineWidth}
    />
  );
} 
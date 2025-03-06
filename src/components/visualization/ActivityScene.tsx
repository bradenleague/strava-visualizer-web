'use client';

import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { StravaStream } from '@/lib/strava/api';
import { normalizeCoordinates, fitCameraToPath } from '@/lib/visualization/utils';
import { VisualizationConfig } from '@/lib/visualization/config';
import ActivityPath from './ActivityPath';

interface ActivitySceneProps {
  activityId: number;
  initialData?: {
    latlng?: StravaStream;
    altitude?: StravaStream;
    distance?: StravaStream;
  };
  config: VisualizationConfig;
}

/**
 * Renders the 3D scene for an activity
 * Handles data loading, processing, and rendering
 * 
 * @param activityId - ID of the activity to visualize
 * @param initialData - Optional pre-loaded activity data
 * @param config - Visualization configuration
 */
export default function ActivityScene({ 
  activityId, 
  initialData,
  config
}: ActivitySceneProps) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { camera } = useThree();
  
  // Process activity data and normalize coordinates
  useEffect(() => {
    if (initialData?.latlng && initialData?.altitude) {
      // Process initial data if provided
      const coordinates = initialData.latlng.data as [number, number][];
      const elevations = initialData.altitude.data as number[];
      setPoints(normalizeCoordinates(coordinates, elevations, config));
    } else {
      // Fetch data if not provided
      const fetchActivityData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/strava/activities/${activityId}/streams?types=latlng,altitude,distance`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch activity data: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.latlng && data.altitude) {
            const coordinates = data.latlng.data as [number, number][];
            const elevations = data.altitude.data as number[];
            setPoints(normalizeCoordinates(coordinates, elevations, config));
          } else {
            setError('Activity data does not contain required streams');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
          console.error('Error fetching activity data:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchActivityData();
    }
  }, [activityId, initialData, config]);
  
  // Position camera to fit the entire path
  useEffect(() => {
    if (points.length > 0) {
      fitCameraToPath(points, camera, config);
    }
  }, [points, camera, config]);
  
  // Render loading state
  if (loading) {
    return (
      <Text
        position={[0, 0, 0]}
        color={config.ui.textColor}
        fontSize={config.ui.fontSize}
        anchorX="center"
        anchorY="middle"
      >
        {config.ui.loadingText}
      </Text>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Text
        position={[0, 0, 0]}
        color={config.ui.errorColor}
        fontSize={config.ui.fontSize}
        anchorX="center"
        anchorY="middle"
      >
        {config.ui.errorText}{error}
      </Text>
    );
  }
  
  // Render empty state
  if (points.length === 0) {
    return (
      <Text
        position={[0, 0, 0]}
        color={config.ui.textColor}
        fontSize={config.ui.fontSize}
        anchorX="center"
        anchorY="middle"
      >
        {config.ui.noDataText}
      </Text>
    );
  }
  
  // Render activity path
  return <ActivityPath points={points} config={config} />;
} 
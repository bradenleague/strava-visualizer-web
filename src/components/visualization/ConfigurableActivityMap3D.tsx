'use client';

import React, { useEffect, useState } from 'react';
import { StravaStream } from '@/lib/strava/api';
import ActivityMap3D from './ActivityMap3D';
import { VisualizationConfig } from '@/lib/visualization/config';
import { loadConfigFromFile, loadConfigFromUrl, loadConfigFromYaml } from '@/lib/visualization/configLoader';

interface ConfigurableActivityMap3DProps {
  activityId: number;
  initialData?: {
    latlng?: StravaStream;
    altitude?: StravaStream;
    distance?: StravaStream;
  };
  configSource?: {
    type: 'file' | 'url' | 'yaml';
    source: string;
  };
}

/**
 * A wrapper component that demonstrates how to use the configurable 3D visualization
 * It can load configuration from a file, URL, or YAML string
 * 
 * @param activityId - ID of the activity to visualize
 * @param initialData - Optional pre-loaded activity data
 * @param configSource - Optional configuration source
 */
export default function ConfigurableActivityMap3D({
  activityId,
  initialData,
  configSource
}: ConfigurableActivityMap3DProps) {
  const [config, setConfig] = useState<Partial<VisualizationConfig>>({});
  const [loading, setLoading] = useState<boolean>(!!configSource);
  const [error, setError] = useState<string | null>(null);

  // Load configuration from the specified source
  useEffect(() => {
    if (!configSource) return;

    const loadConfig = async () => {
      try {
        setLoading(true);
        let loadedConfig: Partial<VisualizationConfig> = {};

        switch (configSource.type) {
          case 'file':
            loadedConfig = await loadConfigFromFile(configSource.source);
            break;
          case 'url':
            loadedConfig = await loadConfigFromUrl(configSource.source);
            break;
          case 'yaml':
            loadedConfig = loadConfigFromYaml(configSource.source);
            break;
          default:
            throw new Error(`Invalid configuration source type: ${configSource.type}`);
        }

        setConfig(loadedConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        console.error('Error loading configuration:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [configSource]);

  if (loading) {
    return <div className="p-4 text-center">Loading configuration...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <ActivityMap3D
      activityId={activityId}
      initialData={initialData}
      config={config}
    />
  );
} 
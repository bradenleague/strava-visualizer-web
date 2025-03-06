'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfigurableActivityMap3D from '@/components/visualization/ConfigurableActivityMap3D';
import { StravaActivity, StravaStream } from '@/lib/strava/api';

interface ActivityDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ActivityDetail({ params }: ActivityDetailProps) {
  // Unwrap the params object using React.use()
  const unwrappedParams = use(params);
  const activityId = unwrappedParams.id;
  
  const { status } = useSession();
  const router = useRouter();
  const [activity, setActivity] = useState<StravaActivity | null>(null);
  const [streams, setStreams] = useState<Record<string, StravaStream> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch activity details
      const activityResponse = await fetch(`/api/strava/activities/${activityId}`);
      
      if (!activityResponse.ok) {
        throw new Error(`Failed to fetch activity: ${activityResponse.statusText}`);
      }
      
      const activityData = await activityResponse.json();
      setActivity(activityData);
      
      // Fetch activity streams
      const streamsResponse = await fetch(`/api/strava/activities/${activityId}/streams?types=latlng,altitude,distance,time`);
      
      if (!streamsResponse.ok) {
        throw new Error(`Failed to fetch streams: ${streamsResponse.statusText}`);
      }
      
      const streamsData = await streamsResponse.json();
      setStreams(streamsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
      console.error('Error fetching activity data:', err);
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchActivityData();
    }
  }, [status, activityId, fetchActivityData, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <Link href="/" className="block mt-4 text-blue-500 hover:underline">
          Back to activities
        </Link>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">Activity not found</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Back to activities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to activities
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{activity.name}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(activity.start_date_local).toLocaleString()}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {activity.timezone}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {activity.sport_type}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Distance</h3>
              <p className="text-2xl font-bold">{(activity.distance / 1000).toFixed(2)} km</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Moving Time</h3>
              <p className="text-2xl font-bold">{formatTime(activity.moving_time)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Elevation Gain</h3>
              <p className="text-2xl font-bold">{activity.total_elevation_gain} m</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">3D Visualization</h2>
          
          <ConfigurableActivityMap3D 
            activityId={activity.id} 
            initialData={streams || undefined}
            configSource={{
              type: 'file',
              source: '/api/config/visualization.yaml'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  
  return `${minutes}m ${secs}s`;
} 
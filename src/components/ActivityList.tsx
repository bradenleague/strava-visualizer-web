'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { StravaActivity } from '@/lib/strava/api';

export default function ActivityList() {
  const { status } = useSession();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/strava/activities?page=${page}&per_page=10`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setActivities(prev => page === 1 ? data : [...prev, ...data]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchActivities();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, page, fetchActivities]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">Please sign in with Strava to view your activities</p>
        <Link 
          href="/api/auth/signin"
          className="bg-[#FC4C02] text-white px-6 py-2 rounded-md hover:bg-[#E34402] transition-colors"
        >
          Sign in with Strava
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Activities</h2>
      
      {activities.length === 0 && !loading ? (
        <p className="text-gray-500">No activities found.</p>
      ) : (
        <div className="space-y-4">
          {activities.map(activity => (
            <Link 
              href={`/activities/${activity.id}`} 
              key={activity.id}
              className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{activity.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {new Date(activity.start_date).toLocaleDateString()} • {activity.type}
                  </p>
                  <div className="mt-2 flex space-x-4 text-sm">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {(activity.distance / 1000).toFixed(2)} km
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(activity.moving_time)}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {activity.total_elevation_gain} m
                    </span>
                  </div>
                </div>
                {/* Temporarily commenting out the map display until we have a valid Google Maps API key */}
                {/* {activity.map.summary_polyline && (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <Image 
                      src={`https://maps.googleapis.com/maps/api/staticmap?size=64x64&path=enc:${activity.map.summary_polyline}&key=YOUR_GOOGLE_MAPS_API_KEY`} 
                      alt="Activity map" 
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                )} */}
              </div>
            </Link>
          ))}
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
} 
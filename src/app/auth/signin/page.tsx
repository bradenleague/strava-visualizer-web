'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Strava Visualizer</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with Strava to visualize your workouts in 3D
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <button
            onClick={() => signIn('strava', { callbackUrl: '/' })}
            className="w-full bg-[#FC4C02] text-white py-3 px-4 rounded-md hover:bg-[#E34402] transition-colors flex items-center justify-center"
          >
            <svg 
              className="w-6 h-6 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.04 13.828h4.169" />
            </svg>
            Connect with Strava
          </button>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              By connecting, you allow this application to access your Strava activities data.
              We only read your activity data and never post anything to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityList from '@/components/ActivityList';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Strava Visualizer</h1>
          
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {session?.user?.image && (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-8 h-8 rounded-full mr-2"
                    width={32}
                    height={32}
                  />
                )}
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>
              <Link 
                href="/api/auth/signout"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Sign out
              </Link>
            </div>
          ) : status === 'unauthenticated' ? (
            <Link 
              href="/api/auth/signin"
              className="bg-[#FC4C02] text-white px-4 py-2 rounded-md hover:bg-[#E34402] transition-colors"
            >
              Sign in with Strava
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          )}
        </div>
      </header>

      <main>
        <ActivityList />
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Strava Visualizer &copy; {new Date().getFullYear()} • Built with Next.js and Three.js
        </p>
        <p className="mt-2">
          This app uses the Strava API but is not endorsed or certified by Strava.
        </p>
      </footer>
    </div>
  );
}

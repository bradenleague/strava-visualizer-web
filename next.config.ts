import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dgalywyr863hv.cloudfront.net', 'maps.googleapis.com'], // Strava profile images domain and Google Maps
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
  },
};

export default nextConfig;

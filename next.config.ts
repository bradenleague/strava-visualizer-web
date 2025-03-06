import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dgalywyr863hv.cloudfront.net'], // Strava profile images domain
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
  },
};

export default nextConfig;

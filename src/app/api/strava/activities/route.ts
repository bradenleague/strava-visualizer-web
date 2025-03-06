import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getActivities, refreshStravaToken } from '@/lib/strava/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if token is expired and refresh if needed
    const now = Math.floor(Date.now() / 1000);
    let accessToken = session.accessToken;

    if (session.expiresAt && session.expiresAt < now) {
      if (!session.refreshToken) {
        return NextResponse.json({ error: 'Refresh token not available' }, { status: 401 });
      }

      const refreshedTokens = await refreshStravaToken(session.refreshToken);
      accessToken = refreshedTokens.access_token;
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '30');

    const activities = await getActivities(accessToken, page, perPage);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error in activities API route:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
} 
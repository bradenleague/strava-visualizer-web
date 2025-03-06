import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getActivity, refreshStravaToken } from '@/lib/strava/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Await the params object before accessing its properties
    const params = await context.params;
    const activityId = parseInt(params.id);
    
    if (isNaN(activityId)) {
      return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    const activity = await getActivity(accessToken, activityId);
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error in activity API route:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
} 
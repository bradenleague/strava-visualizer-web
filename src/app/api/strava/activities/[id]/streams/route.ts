import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getActivityStreams, refreshStravaToken, StreamTypes } from '@/lib/strava/api';

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

    // Get query parameters for stream types
    const searchParams = request.nextUrl.searchParams;
    const streamTypesParam = searchParams.get('types');
    
    let streamTypes: StreamTypes[] = ['time', 'latlng', 'distance', 'altitude'];
    
    if (streamTypesParam) {
      const requestedTypes = streamTypesParam.split(',') as StreamTypes[];
      if (requestedTypes.length > 0) {
        streamTypes = requestedTypes;
      }
    }

    const streams = await getActivityStreams(accessToken, activityId, streamTypes);
    return NextResponse.json(streams);
  } catch (error) {
    console.error('Error in activity streams API route:', error);
    return NextResponse.json({ error: 'Failed to fetch activity streams' }, { status: 500 });
  }
} 
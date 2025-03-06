import { Session } from 'next-auth';
import { refreshStravaToken } from './api';

/**
 * Ensures the Strava access token is valid and refreshes it if needed
 */
export async function ensureValidToken(session: Session): Promise<string> {
  if (!session || !session.accessToken) {
    throw new Error('Not authenticated');
  }

  // Check if token is expired and refresh if needed
  const now = Math.floor(Date.now() / 1000);
  let accessToken = session.accessToken;

  if (session.expiresAt && session.expiresAt < now) {
    if (!session.refreshToken) {
      throw new Error('Refresh token not available');
    }

    try {
      const refreshedTokens = await refreshStravaToken(session.refreshToken);
      accessToken = refreshedTokens.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh token');
    }
  }

  return accessToken;
} 
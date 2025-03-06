import axios from 'axios';

const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
}

export interface StravaStream {
  type: string;
  data: number[] | [number, number][];
  series_type: string;
  original_size: number;
  resolution: string;
}

export type StreamTypes = 'time' | 'latlng' | 'distance' | 'altitude' | 'velocity_smooth' | 'heartrate' | 'cadence' | 'watts' | 'temp' | 'moving' | 'grade_smooth';

/**
 * Get activities for the authenticated user
 */
export async function getActivities(accessToken: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
  try {
    const response = await axios.get(`${STRAVA_API_URL}/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}

/**
 * Get detailed activity by ID
 */
export async function getActivity(accessToken: string, activityId: number): Promise<StravaActivity> {
  try {
    const response = await axios.get(`${STRAVA_API_URL}/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity ${activityId}:`, error);
    throw error;
  }
}

/**
 * Get streams for an activity
 */
export async function getActivityStreams(
  accessToken: string, 
  activityId: number, 
  streamTypes: StreamTypes[] = ['time', 'latlng', 'distance', 'altitude']
): Promise<Record<string, StravaStream>> {
  try {
    const response = await axios.get(`${STRAVA_API_URL}/activities/${activityId}/streams`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        keys: streamTypes.join(','),
        key_by_type: true
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching streams for activity ${activityId}:`, error);
    throw error;
  }
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshStravaToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_at: number;
}> {
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
} 
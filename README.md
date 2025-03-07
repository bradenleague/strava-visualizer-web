# Strava Visualizer

A Next.js 14 application that integrates with the Strava API to visualize workout data in 3D using Three.js.

## Features

- **Strava API Integration**: Connect your Strava account to access your workout data.
- **3D Visualization**: View your workout routes in interactive 3D with elevation data.
- **Artist-Friendly Configuration**: Easily customize the 3D visualization through configuration files.
- **Activity List**: Browse through your Strava activities with key metrics.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Three.js**: 3D visualization library
- **React Three Fiber**: React renderer for Three.js
- **NextAuth.js**: Authentication for Next.js
- **Strava API**: Access to workout data
- **YAML**: Configuration for 3D visualization

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Strava account and API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/strava-visualizer-web.git
   cd strava-visualizer-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Strava API
   STRAVA_CLIENT_ID=your-strava-client-id
   STRAVA_CLIENT_SECRET=your-strava-client-secret

   # API Base URL
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Strava API Setup

1. Create a Strava API application at [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2. Set the "Authorization Callback Domain" to your production domain
3. Copy the Client ID and Client Secret to your `.env.local` file

## Development and Production Environment Setup

We've implemented a solution to manage both local development and production environments using the same Strava API application:

### Implementation

The application supports a hybrid authentication approach:

1. **Production Environment**: Uses NextAuth.js for authentication with Strava
2. **Local Development**: Uses a custom OAuth flow that:
   - Authenticates with the production Strava app
   - Redirects back to localhost with tokens in URL parameters
   - Stores tokens in localStorage for API requests

This approach allows us to:
- Use a single Strava API application for both environments
- Avoid having to switch callback domains in the Strava API settings
- Maintain a seamless development workflow

### Environment Files

The project includes two main environment configuration files:

- `.env.local` - Local development configuration
- `.env.production` - Production configuration

## Deployment

This application is ready to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Strava for providing the API
- Three.js community for the excellent 3D visualization tools
- Next.js team for the amazing framework

## 3D Visualization Configuration

The 3D visualization can be easily customized through configuration files. This makes it artist-friendly and allows for quick tweaking without changing the code.

### Configuration Options

The configuration is structured as follows:

```yaml
# Canvas settings
canvas:
  height: "500px"
  backgroundColor: "#1a1a2e"
  borderRadius: "0.5rem"

# Lighting settings
lighting:
  ambient:
    intensity: 0.5
    color: "#ffffff"
  point:
    position: [10, 10, 10]
    intensity: 1.0
    color: "#ffffff"

# Camera settings
camera:
  initialPosition: [0, 5, 10]
  fov: 75
  near: 0.1
  far: 1000
  autoFitPadding: 1.2

# Path settings
path:
  lineWidth: 3
  defaultColor: "hotpink"
  animate: true
  animation:
    speed: 0.1
    saturation: 0.8
    lightness: 0.5

# Coordinate normalization
coordinates:
  scale: 10
  elevationScale: 0.2
  centerAtOrigin: true

# Controls
controls:
  enablePan: true
  enableZoom: true
  enableRotate: true
  dampingFactor: 0.05
  autoRotate: false
  autoRotateSpeed: 1.0

# UI elements
ui:
  loadingText: "Loading activity data..."
  errorText: "Error: "
  noDataText: "No route data available"
  fontSize: 0.5
  textColor: "white"
  errorColor: "red"
```

### Using the Configuration

You can use the configuration in several ways:

1. **Default Configuration**: The visualization comes with sensible defaults.

2. **Inline Configuration**: Override specific settings when using the component:

```tsx
<ActivityMap3D
  activityId={123456789}
  config={{
    path: {
      lineWidth: 5,
      defaultColor: "blue",
    },
    coordinates: {
      elevationScale: 0.5,
    },
  }}
/>
```

3. **YAML Configuration**: Load configuration from a YAML file:

```tsx
<ConfigurableActivityMap3D
  activityId={123456789}
  configSource={{
    type: 'file',
    source: '/config/visualization.yaml',
  }}
/>
```

4. **Remote Configuration**: Load configuration from a URL:

```tsx
<ConfigurableActivityMap3D
  activityId={123456789}
  configSource={{
    type: 'url',
    source: 'https://example.com/visualization-config.yaml',
  }}
/>
```

### Customization Tips

- **Path Appearance**: Adjust `path.lineWidth` and `path.defaultColor` for basic styling.
- **Animation**: Set `path.animate` to `true` or `false` to enable/disable color animation.
- **Elevation Exaggeration**: Increase `coordinates.elevationScale` to make elevation changes more visible.
- **Camera View**: Adjust `camera.initialPosition` and `camera.autoFitPadding` to change the initial view.
- **Controls**: Enable/disable user controls with the `controls` settings.

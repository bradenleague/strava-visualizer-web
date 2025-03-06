import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the config.yaml file from the src/lib/visualization directory
    const configPath = path.join(process.cwd(), 'src', 'lib', 'visualization', 'config.yaml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Return the content with the appropriate content type
    return new NextResponse(configContent, {
      headers: {
        'Content-Type': 'text/yaml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error reading config file:', error);
    return new NextResponse('Error reading configuration file', { status: 500 });
  }
} 
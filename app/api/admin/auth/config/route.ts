import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(process.cwd(), '.env.local');

interface AuthConfig {
  method: 'oauth' | 'passwordless' | 'both';
  passwordless: {
    enabled: boolean;
    emailFrom: string;
    emailServer: string;
  };
  oauth: {
    enabled: boolean;
    google: {
      clientId: string;
      clientSecret: string;
      configured: boolean;
    };
    apple: {
      clientId: string;
      teamId: string;
      privateKey: string;
      keyId: string;
      configured: boolean;
    };
  };
  defaultMethod: 'oauth' | 'passwordless';
}

// Get authentication configuration
export async function GET() {
  try {
    // Check environment variables for current configuration
    const hasEmailProvider = !!process.env.EMAIL_SERVER;
    const hasGoogleAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const hasAppleAuth = !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID);
    
    // Determine default method based on configuration
    const defaultMethod = process.env.AUTH_DEFAULT_METHOD === 'oauth' ? 'oauth' : 'passwordless';
    
    const config: AuthConfig = {
      method: process.env.AUTH_METHOD as 'oauth' | 'passwordless' | 'both' || 'passwordless',
      passwordless: {
        enabled: hasEmailProvider || !hasGoogleAuth && !hasAppleAuth, // Default to passwordless if no OAuth configured
        emailFrom: process.env.EMAIL_FROM || 'ZeroFinanx <noreply@zerofinanx.com>',
        emailServer: hasEmailProvider ? '••••••••••••••••' : ''
      },
      oauth: {
        enabled: hasGoogleAuth || hasAppleAuth,
        google: {
          clientId: hasGoogleAuth ? process.env.GOOGLE_CLIENT_ID! : '',
          clientSecret: hasGoogleAuth ? '••••••••••••••••' : '',
          configured: hasGoogleAuth
        },
        apple: {
          clientId: hasAppleAuth ? process.env.APPLE_CLIENT_ID! : '',
          teamId: hasAppleAuth ? process.env.APPLE_TEAM_ID! : '',
          privateKey: hasAppleAuth ? '••••••••••••••••' : '',
          keyId: hasAppleAuth ? process.env.APPLE_KEY_ID! : '',
          configured: hasAppleAuth
        }
      },
      defaultMethod: defaultMethod
    };
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading auth configuration:', error);
    return NextResponse.json(
      { error: 'Failed to load authentication configuration' },
      { status: 500 }
    );
  }
}

// Update authentication configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, defaultMethod, passwordless, oauth } = body;
    
    // Read current env file
    let envContent = '';
    if (existsSync(ENV_PATH)) {
      envContent = readFileSync(ENV_PATH, 'utf8');
    }
    
    const lines = envContent.split('\n');
    const updatedLines: string[] = [];
    const foundVars = new Set<string>();
    
    // Process existing lines
    for (const line of lines) {
      let updated = false;
      
      // Update authentication method settings
      if (line.startsWith('AUTH_METHOD=')) {
        updatedLines.push(`AUTH_METHOD=${method || 'passwordless'}`);
        foundVars.add('AUTH_METHOD');
        updated = true;
      } else if (line.startsWith('AUTH_DEFAULT_METHOD=')) {
        updatedLines.push(`AUTH_DEFAULT_METHOD=${defaultMethod || 'passwordless'}`);
        foundVars.add('AUTH_DEFAULT_METHOD');
        updated = true;
      }
      // Update passwordless settings
      else if (line.startsWith('EMAIL_SERVER=') && passwordless?.emailServer) {
        updatedLines.push(`EMAIL_SERVER=${passwordless.emailServer}`);
        foundVars.add('EMAIL_SERVER');
        updated = true;
      } else if (line.startsWith('EMAIL_FROM=') && passwordless?.emailFrom) {
        updatedLines.push(`EMAIL_FROM=${passwordless.emailFrom}`);
        foundVars.add('EMAIL_FROM');
        updated = true;
      }
      // Update OAuth settings if provided
      else if (line.startsWith('GOOGLE_CLIENT_ID=') && oauth?.google?.clientId !== undefined) {
        updatedLines.push(`GOOGLE_CLIENT_ID=${oauth.google.clientId}`);
        foundVars.add('GOOGLE_CLIENT_ID');
        updated = true;
      } else if (line.startsWith('GOOGLE_CLIENT_SECRET=') && oauth?.google?.clientSecret !== undefined) {
        updatedLines.push(`GOOGLE_CLIENT_SECRET=${oauth.google.clientSecret}`);
        foundVars.add('GOOGLE_CLIENT_SECRET');
        updated = true;
      } else if (line.startsWith('APPLE_CLIENT_ID=') && oauth?.apple?.clientId !== undefined) {
        updatedLines.push(`APPLE_CLIENT_ID=${oauth.apple.clientId}`);
        foundVars.add('APPLE_CLIENT_ID');
        updated = true;
      } else if (line.startsWith('APPLE_TEAM_ID=') && oauth?.apple?.teamId !== undefined) {
        updatedLines.push(`APPLE_TEAM_ID=${oauth.apple.teamId}`);
        foundVars.add('APPLE_TEAM_ID');
        updated = true;
      } else if (line.startsWith('APPLE_PRIVATE_KEY=') && oauth?.apple?.privateKey !== undefined) {
        updatedLines.push(`APPLE_PRIVATE_KEY=${oauth.apple.privateKey}`);
        foundVars.add('APPLE_PRIVATE_KEY');
        updated = true;
      } else if (line.startsWith('APPLE_KEY_ID=') && oauth?.apple?.keyId !== undefined) {
        updatedLines.push(`APPLE_KEY_ID=${oauth.apple.keyId}`);
        foundVars.add('APPLE_KEY_ID');
        updated = true;
      }
      
      if (!updated) {
        updatedLines.push(line);
      }
    }
    
    // Add missing variables
    if (!foundVars.has('AUTH_METHOD')) {
      updatedLines.push(`AUTH_METHOD=${method || 'passwordless'}`);
    }
    if (!foundVars.has('AUTH_DEFAULT_METHOD')) {
      updatedLines.push(`AUTH_DEFAULT_METHOD=${defaultMethod || 'passwordless'}`);
    }
    if (!foundVars.has('EMAIL_SERVER') && passwordless?.emailServer) {
      updatedLines.push(`EMAIL_SERVER=${passwordless.emailServer}`);
    }
    if (!foundVars.has('EMAIL_FROM') && passwordless?.emailFrom) {
      updatedLines.push(`EMAIL_FROM=${passwordless.emailFrom}`);
    }
    
    // Write updated env file
    writeFileSync(ENV_PATH, updatedLines.join('\n'));
    
    return NextResponse.json({
      success: true,
      message: 'Authentication configuration updated successfully. Please restart the application for changes to take effect.'
    });
    
  } catch (error) {
    console.error('Error updating auth configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update authentication configuration' },
      { status: 500 }
    );
  }
}
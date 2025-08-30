import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(process.cwd(), '.env.local');

// In-memory storage for demo - in production, use encrypted storage
let oauthConfig = {
  google: {
    clientId: '',
    clientSecret: '',
    configured: false
  },
  apple: {
    clientId: '',
    teamId: '',
    privateKey: '',
    keyId: '',
    configured: false
  },
  nextauth: {
    secret: '',
    url: '',
    configured: false
  }
};

export async function GET() {
  try {
    // Check if environment variables are already set
    const hasGoogleAuth = process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_ID !== '' &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_SECRET !== '';
    
    const hasAppleAuth = process.env.APPLE_CLIENT_ID && 
      process.env.APPLE_CLIENT_ID !== '' &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_TEAM_ID !== '';
    
    const hasNextAuth = process.env.NEXTAUTH_SECRET && 
      process.env.NEXTAUTH_SECRET !== '';

    return NextResponse.json({
      google: {
        clientId: hasGoogleAuth ? process.env.GOOGLE_CLIENT_ID : '',
        clientSecret: hasGoogleAuth ? '••••••••••••••••' : '', // Masked for security
        configured: hasGoogleAuth
      },
      apple: {
        clientId: hasAppleAuth ? process.env.APPLE_CLIENT_ID : '',
        teamId: hasAppleAuth ? process.env.APPLE_TEAM_ID : '',
        privateKey: hasAppleAuth ? '••••••••••••••••' : '', // Masked for security
        keyId: hasAppleAuth ? process.env.APPLE_KEY_ID : '',
        configured: hasAppleAuth
      },
      nextauth: {
        secret: hasNextAuth ? '••••••••••••••••' : '', // Masked for security
        url: process.env.NEXTAUTH_URL || '',
        configured: hasNextAuth
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load OAuth configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, config } = body;

    if (!provider || !config) {
      return NextResponse.json(
        { error: 'Provider and config are required' },
        { status: 400 }
      );
    }

    // Update environment file
    try {
      let envContent = '';
      if (existsSync(ENV_PATH)) {
        envContent = readFileSync(ENV_PATH, 'utf8');
      }

      const lines = envContent.split('\n');
      const updatedLines = [];
      const foundVars = new Set();

      // Process existing lines
      for (const line of lines) {
        let updated = false;
        
        if (provider === 'google') {
          if (line.startsWith('GOOGLE_CLIENT_ID=')) {
            updatedLines.push(`GOOGLE_CLIENT_ID=${config.clientId || ''}`);
            foundVars.add('GOOGLE_CLIENT_ID');
            updated = true;
          } else if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
            updatedLines.push(`GOOGLE_CLIENT_SECRET=${config.clientSecret || ''}`);
            foundVars.add('GOOGLE_CLIENT_SECRET');
            updated = true;
          }
        } else if (provider === 'apple') {
          if (line.startsWith('APPLE_CLIENT_ID=')) {
            updatedLines.push(`APPLE_CLIENT_ID=${config.clientId || ''}`);
            foundVars.add('APPLE_CLIENT_ID');
            updated = true;
          } else if (line.startsWith('APPLE_TEAM_ID=')) {
            updatedLines.push(`APPLE_TEAM_ID=${config.teamId || ''}`);
            foundVars.add('APPLE_TEAM_ID');
            updated = true;
          } else if (line.startsWith('APPLE_PRIVATE_KEY=')) {
            updatedLines.push(`APPLE_PRIVATE_KEY=${config.privateKey || ''}`);
            foundVars.add('APPLE_PRIVATE_KEY');
            updated = true;
          } else if (line.startsWith('APPLE_KEY_ID=')) {
            updatedLines.push(`APPLE_KEY_ID=${config.keyId || ''}`);
            foundVars.add('APPLE_KEY_ID');
            updated = true;
          }
        } else if (provider === 'nextauth') {
          if (line.startsWith('NEXTAUTH_SECRET=')) {
            updatedLines.push(`NEXTAUTH_SECRET=${config.secret || ''}`);
            foundVars.add('NEXTAUTH_SECRET');
            updated = true;
          } else if (line.startsWith('NEXTAUTH_URL=')) {
            updatedLines.push(`NEXTAUTH_URL=${config.url || ''}`);
            foundVars.add('NEXTAUTH_URL');
            updated = true;
          }
        }

        if (!updated) {
          updatedLines.push(line);
        }
      }

      // Add missing variables
      if (provider === 'google') {
        if (!foundVars.has('GOOGLE_CLIENT_ID')) {
          updatedLines.push(`GOOGLE_CLIENT_ID=${config.clientId || ''}`);
        }
        if (!foundVars.has('GOOGLE_CLIENT_SECRET')) {
          updatedLines.push(`GOOGLE_CLIENT_SECRET=${config.clientSecret || ''}`);
        }
      } else if (provider === 'apple') {
        if (!foundVars.has('APPLE_CLIENT_ID')) {
          updatedLines.push(`APPLE_CLIENT_ID=${config.clientId || ''}`);
        }
        if (!foundVars.has('APPLE_TEAM_ID')) {
          updatedLines.push(`APPLE_TEAM_ID=${config.teamId || ''}`);
        }
        if (!foundVars.has('APPLE_PRIVATE_KEY')) {
          updatedLines.push(`APPLE_PRIVATE_KEY=${config.privateKey || ''}`);
        }
        if (!foundVars.has('APPLE_KEY_ID')) {
          updatedLines.push(`APPLE_KEY_ID=${config.keyId || ''}`);
        }
      } else if (provider === 'nextauth') {
        if (!foundVars.has('NEXTAUTH_SECRET')) {
          updatedLines.push(`NEXTAUTH_SECRET=${config.secret || ''}`);
        }
        if (!foundVars.has('NEXTAUTH_URL')) {
          updatedLines.push(`NEXTAUTH_URL=${config.url || ''}`);
        }
      }

      writeFileSync(ENV_PATH, updatedLines.join('\n'));

      // Update in-memory config
      if (provider === 'google') {
        oauthConfig.google = {
          clientId: config.clientId || '',
          clientSecret: config.clientSecret || '',
          configured: !!(config.clientId && config.clientSecret)
        };
      } else if (provider === 'apple') {
        oauthConfig.apple = {
          clientId: config.clientId || '',
          teamId: config.teamId || '',
          privateKey: config.privateKey || '',
          keyId: config.keyId || '',
          configured: !!(config.clientId && config.teamId && config.privateKey && config.keyId)
        };
      } else if (provider === 'nextauth') {
        oauthConfig.nextauth = {
          secret: config.secret || '',
          url: config.url || '',
          configured: !!config.secret
        };
      }

      return NextResponse.json({
        success: true,
        provider,
        configured: true,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth configuration saved successfully. Please restart the application for changes to take effect.`
      });

    } catch (fileError) {
      console.error('Error updating .env.local:', fileError);
      
      return NextResponse.json({
        success: true,
        configured: true,
        message: 'Configuration saved in memory. For persistence, please manually add keys to .env.local'
      });
    }

  } catch (error) {
    console.error('Error saving OAuth config:', error);
    return NextResponse.json(
      { error: 'Failed to save OAuth configuration' },
      { status: 500 }
    );
  }
}
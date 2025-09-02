import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

// Send magic link email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Generate a secure JWT token that contains the email and expiration
    const tokenPayload = {
      email,
      type: 'magic-link',
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes from now
      iat: Math.floor(Date.now() / 1000),
      jti: randomBytes(16).toString('hex') // Unique token ID
    };
    
    // Sign the token with the secret
    const token = jwt.sign(
      tokenPayload,
      process.env.NEXTAUTH_SECRET || 'development-secret'
    );
    
    // Generate magic link URL with robust URL construction
    let baseUrl = 'http://localhost:3000'; // Default fallback
    
    // First try NEXTAUTH_URL, clean it if it exists
    if (process.env.NEXTAUTH_URL) {
      baseUrl = process.env.NEXTAUTH_URL.trim();
      // Ensure it doesn't have duplicate protocols
      if (baseUrl.startsWith('https://https://') || baseUrl.startsWith('http://https://')) {
        baseUrl = baseUrl.replace(/^https?:\/\//, '');
      }
      // Ensure it starts with protocol
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }
    } 
    // Fallback to VERCEL_URL if available
    else if (process.env.VERCEL_URL) {
      const vercelUrl = process.env.VERCEL_URL.trim();
      baseUrl = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    }
    
    const magicLink = `${baseUrl}/api/auth/verify-magic-link?token=${token}`;
    
    // For testing/development, always show the magic link in the response
    // In production, you would send this via email instead
    console.log(`Magic link for ${email}: ${magicLink}`);
    
    return NextResponse.json({
      success: true,
      message: 'Magic link generated successfully',
      magicLink: magicLink, // Always return the link for testing
      email: email,
      expiresIn: '15 minutes'
    });
    
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}

// Verify magic link token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Verify and decode the JWT token
    let tokenData;
    try {
      tokenData = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'development-secret'
      ) as { email: string; type: string; exp: number; iat: number; jti: string };
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Check if token is for magic link
    if (tokenData.type !== 'magic-link') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }
    
    // Token is valid, extract email
    const { email } = tokenData;
    
    // Create a JWT session token
    const sessionToken = jwt.sign(
      { email, type: 'passwordless' },
      process.env.NEXTAUTH_SECRET || 'development-secret',
      { expiresIn: '30d' }
    );
    
    // Generate fallback base URL for redirect
    let fallbackBaseUrl = 'https://zerofinanx-website.vercel.app'; // Production fallback
    
    // Try to get base URL from environment
    if (process.env.NEXTAUTH_URL) {
      fallbackBaseUrl = process.env.NEXTAUTH_URL.trim();
      // Clean any duplicate protocols
      if (fallbackBaseUrl.startsWith('https://https://') || fallbackBaseUrl.startsWith('http://https://')) {
        fallbackBaseUrl = fallbackBaseUrl.replace(/^https?:\/\//, '');
      }
      // Ensure it starts with protocol
      if (!fallbackBaseUrl.startsWith('http://') && !fallbackBaseUrl.startsWith('https://')) {
        fallbackBaseUrl = `https://${fallbackBaseUrl}`;
      }
    }
    
    // Redirect to the app with the session
    let redirectUrl;
    try {
      redirectUrl = new URL('/paywall', request.url);
    } catch (error) {
      // Fallback if request.url is malformed
      redirectUrl = new URL('/paywall', fallbackBaseUrl);
    }
    const response = NextResponse.redirect(redirectUrl);
    
    // Set session cookie
    response.cookies.set('passwordless-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.json(
      { error: 'Failed to verify magic link' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
    
    // Redirect to the dashboard after successful authentication
    let redirectUrl;
    try {
      redirectUrl = new URL('/dashboard', request.url);
      redirectUrl.searchParams.set('from', 'magic-link');
    } catch (error) {
      // Fallback if request.url is malformed
      redirectUrl = new URL('/dashboard', fallbackBaseUrl);
      redirectUrl.searchParams.set('from', 'magic-link');
    }
    const response = NextResponse.redirect(redirectUrl);
    
    // Set session cookie with proper domain and path
    response.cookies.set('passwordless-session', sessionToken, {
      httpOnly: false, // Allow client-side access for now to debug
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
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
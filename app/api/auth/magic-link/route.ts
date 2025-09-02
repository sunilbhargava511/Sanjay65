import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

// In production, use a database to store tokens
const magicLinkTokens = new Map<string, { email: string; expires: number }>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of magicLinkTokens.entries()) {
    if (data.expires < now) {
      magicLinkTokens.delete(token);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

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
    
    // Generate a secure token
    const token = randomBytes(32).toString('hex');
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    // Store the token (in production, use a database)
    magicLinkTokens.set(token, { email, expires });
    
    // Generate magic link URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
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
    
    // Check if token exists and is valid
    const tokenData = magicLinkTokens.get(token);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    if (tokenData.expires < Date.now()) {
      magicLinkTokens.delete(token);
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      );
    }
    
    // Token is valid, delete it (one-time use)
    const { email } = tokenData;
    magicLinkTokens.delete(token);
    
    // Create a JWT session token
    const sessionToken = jwt.sign(
      { email, type: 'passwordless' },
      process.env.NEXTAUTH_SECRET || 'development-secret',
      { expiresIn: '30d' }
    );
    
    // Redirect to the app with the session
    const response = NextResponse.redirect(new URL('/paywall', request.url));
    
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
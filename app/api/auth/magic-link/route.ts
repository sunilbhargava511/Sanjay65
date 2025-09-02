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


import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";

// Determine authentication configuration
const authMethod = process.env.AUTH_METHOD || 'passwordless';
const isPasswordlessEnabled = authMethod === 'passwordless' || authMethod === 'both';
const isOAuthEnabled = authMethod === 'oauth' || authMethod === 'both';

// Build providers array
const providers = [];

// Add OAuth providers if enabled and configured
if (isOAuthEnabled && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

if (isOAuthEnabled && process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_PRIVATE_KEY && process.env.APPLE_KEY_ID) {
  providers.push(AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID,
    teamId: process.env.APPLE_TEAM_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    keyId: process.env.APPLE_KEY_ID,
  }));
}

// Add email provider if passwordless is enabled and configured
if (isPasswordlessEnabled && process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    maxAge: 15 * 60, // Magic links expire in 15 minutes
    sendVerificationRequest: async ({ identifier: email, url, provider }) => {
      // Custom email sending logic can be added here
      // For now, use the default NextAuth email sending
      const { server, from } = provider;
      const site = new URL(url).host;
      
      // You can customize the email template here
      console.log(`Magic link sent to ${email}: ${url}`);
    },
  }));
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
  callbacks: {
    async session({ session, token }) {
      // Attach token fields to session if you want
      if (session?.user) {
        // @ts-expect-error
        session.user.sub = token.sub;
        // @ts-expect-error
        session.user.authMethod = token.authMethod || 'oauth';
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        // Store auth method in token
        token.authMethod = account.provider === 'email' ? 'passwordless' : 'oauth';
      }
      return token;
    },
    async signIn({ user, account }) {
      // You can add custom logic here to handle sign-in
      // For example, create user records in your database
      return true;
    },
  },
};
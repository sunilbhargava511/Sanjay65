import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      teamId: process.env.APPLE_TEAM_ID ?? "",
      privateKey: (process.env.APPLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
      keyId: process.env.APPLE_KEY_ID ?? "",
    }),
    // Only add email provider if EMAIL_SERVER is configured
    ...(process.env.EMAIL_SERVER ? [EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? "ZeroFinanx <noreply@zerofinanx.com>",
    })] : []),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Attach token fields to session if you want
      if (session?.user) {
        // @ts-expect-error
        session.user.sub = token.sub;
      }
      return session;
    },
  },
};
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),

  providers: [
    // GOOGLE → no onboarding
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // EMAIL → requires onboarding
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async redirect({ baseUrl, account }) {
      // Google login → skip onboarding
      if (account?.provider === "google") {
        return `${baseUrl}/dashboard`;
      }

      // Email login → go to onboarding
      if (account?.provider === "email") {
        return `${baseUrl}/onboarding`;
      }

      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);

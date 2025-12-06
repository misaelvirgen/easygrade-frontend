// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  // --- Supabase Adapter (stores users, sessions, etc.) ---
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    debug: true,   // --- TEMPORARY ---
  }),

  // --- Authentication Providers ---
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email Magic Link via Resend
    EmailProvider({
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await resend.emails.send({
          from: process.env.EMAIL_FROM, // e.g. "EasyGrade <no-reply@easygrade.ai>"
          to: email,
          subject: "Your EasyGrade Login Link",
          html: `
            <p>Click below to sign in:</p>
            <p><a href="${url}">Sign in to EasyGrade</a></p>
            <p>This link expires in 10 minutes.</p>
          `,
        });
      },
    }),
  ],

  // --- Required Secrets ---
  secret: process.env.NEXTAUTH_SECRET,

  // --- Custom Pages ---
  pages: {
    signIn: "/login", // Route for the login page
  },

  // --- Session Strategy (NextAuth default is fine) ---
  session: {
    strategy: "jwt",
  },

  // --- Optional Logging ---
  debug: false,
};

export default NextAuth(authOptions);


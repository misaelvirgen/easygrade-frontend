import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

  ],

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  debug: true,
};

export default NextAuth(authOptions);

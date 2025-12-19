// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session?.user?.id) {
        await loadProfile(session.user);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user?.id) {
          await loadProfile(session.user);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------------
  // LOAD OR CREATE PROFILE
  // -------------------------------
  async function loadProfile(user) {
    const { id, email, user_metadata } = user;

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    // Create profile if it doesn't exist
    if (!data) {
      const newProfile = {
        id,
        email,
        avatar_url: user_metadata.avatar_url || null,
        is_premium: false
      };

      const { data: inserted } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      data = inserted;
    }

    setProfile(data);
  }

  // -------------------------------
  // GOOGLE LOGIN
  // -------------------------------
  async function signInWithGoogle() {
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : "/dashboard";

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

const value = {
  user,
  profile,
  isPremium: profile?.is_premium === true,
  loading,
  signInWithGoogle,
  logout,
  refreshProfile: async () => {
    if (user) {
      await loadProfile(user);
    }
  },
};


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function Account() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  if (!user || !profile) return null;

  return (
    <div className="eg-dashboard-layout">
      <Sidebar isPremium={profile.is_premium === true} />

      <main className="eg-dashboard-main">
        <TopHeader
    title="Account Settings"
    subtitle="Manage your profile information."
  />

        <section className="eg-card" style={{ maxWidth: 520 }}>
          <h2 className="eg-card-title">Profile</h2>

          <label className="eg-label">Email</label>
          <input
            className="eg-input"
            value={user.email}
            disabled
          />

          <label className="eg-label">Display Name</label>
          <input
            className="eg-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />

          <p className="eg-muted-text" style={{ marginTop: 8 }}>
            Saving profile changes will be enabled soon.
          </p>
        </section>
      </main>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function Dashboard() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const menuItemsRef = useRef([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  if (!user || !profile) return null;

  const displayName =
    profile.full_name ||
    user.user_metadata?.full_name ||
    profile.email?.split("@")[0] ||
    "Teacher";

  const avatarUrl =
    profile.avatar_url ||
    user.user_metadata?.avatar_url ||
    null;

  const isPremium = profile.is_premium === true;

  return (
    <div className="eg-dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar isPremium={isPremium} />

      {/* MAIN */}
      <main className="eg-dashboard-main">
        {/* HEADER */}
    <TopHeader
  showGreeting
  subtitle="Here’s a quick overview of your grading activity."
/>

        {/* QUICK ACTIONS */}
        <section className="eg-dashboard-actions">
          <h2 className="eg-section-title">Quick Actions</h2>

          <div className="eg-actions-grid">
            <a href="/grade" className="eg-action-card">
              <span className="material-symbols-rounded eg-action-icon">
                edit
              </span>
              <div>
                <h3>Grade a New Essay</h3>
                <p>Jump straight into grading.</p>
              </div>
            </a>

            <a href="/rubric-builder" className="eg-action-card">
              <span className="material-symbols-rounded eg-action-icon">
                widgets
              </span>
              <div>
                <h3>Create New Rubric</h3>
                <p>Build or generate rubrics.</p>
              </div>
            </a>

            <div className="eg-action-card">
              <span className="material-symbols-rounded eg-action-icon">
                history
              </span>
              <div>
                <h3>Continue Grading</h3>
                <p>Coming soon.</p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="eg-dashboard-grid">
          <div className="eg-stat-card eg-stat-card--accent">
            <h3>Time Saved</h3>
            <div className="eg-stat-number">
              0 <span className="eg-stat-unit">hrs</span>
            </div>
            <p className="eg-stat-caption">
              Estimated grading hours saved.
            </p>
          </div>

          <div className="eg-stat-card">
            <h3>Essays Graded</h3>
            <div className="eg-stat-number">0</div>
            <p className="eg-stat-caption">Total essays graded.</p>
          </div>

          <div className="eg-stat-card">
            <h3>Saved Rubrics</h3>
            <div className="eg-stat-number">0</div>
            <p className="eg-stat-caption">
              Reusable rubrics for future assignments.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

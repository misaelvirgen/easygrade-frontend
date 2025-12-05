// pages/dashboard.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="eg-root">
        <div className="eg-shell">
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const userName =
    session.user?.name || session.user?.email?.split("@")[0] || "Teacher";

  const stats = {
    rubrics: 0,
    feedback: 0,
    essays: 0,
    timeSavedHours: 0,
  };

  const avatarInitial =
    userName && typeof userName === "string"
      ? userName.trim().charAt(0).toUpperCase()
      : "T";

  return (
    <div className="eg-root">
      <div className="eg-shell eg-dashboard-shell">
        <div className="eg-dashboard-layout">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <main className="eg-dashboard-main">
            {/* Header */}
            <header className="eg-dashboard-header">
              <div>
                <h1 className="eg-dashboard-title">
                  Welcome back, {userName}
                </h1>
                <p className="eg-dashboard-subtitle">
                  Here&apos;s a quick overview of your grading activity.
                </p>
              </div>
              <div className="eg-dashboard-avatar">
                <span>{avatarInitial}</span>
              </div>
            </header>

            {/* Stats row */}
            <section className="eg-dashboard-grid">
              <div className="eg-stat-card">
                <h3>Saved Rubrics</h3>
                <p className="eg-stat-number">{stats.rubrics}</p>
                <p className="eg-stat-caption">
                  Create reusable rubrics for future assignments.
                </p>
              </div>

              <div className="eg-stat-card">
                <h3>Feedback Entries</h3>
                <p className="eg-stat-number">{stats.feedback}</p>
                <p className="eg-stat-caption">
                  Track recent feedback you&apos;ve given to students.
                </p>
              </div>

              <div className="eg-stat-card">
                <h3>Essays Graded</h3>
                <p className="eg-stat-number">{stats.essays}</p>
                <p className="eg-stat-caption">
                  Count of graded essays.
                </p>
              </div>

              <div className="eg-stat-card eg-stat-card--accent">
                <h3>Time Saved</h3>
                <p className="eg-stat-number">
                  {stats.timeSavedHours}
                  <span className="eg-stat-unit"> hrs</span>
                </p>
                <p className="eg-stat-caption">
                  Estimated grading hours saved.
                </p>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="eg-dashboard-actions">
              <h2 className="eg-section-title">Quick Actions</h2>

              <div className="eg-actions-grid">
                <button
                  className="eg-action-card"
                  onClick={() => router.push("/")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    edit_note
                  </span>
                  <div>
                    <h3>Grade a New Essay</h3>
                    <p>Jump straight into grading.</p>
                  </div>
                </button>

                <button
                  className="eg-action-card"
                  onClick={() => router.push("/rubric-builder")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    fact_check
                  </span>
                  <div>
                    <h3>Create New Rubric</h3>
                    <p>Generate or build a rubric.</p>
                  </div>
                </button>

                <button
                  className="eg-action-card"
                  onClick={() => router.push("/rubric-builder")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    upload_file
                  </span>
                  <div>
                    <h3>Upload Existing Rubric</h3>
                    <p>Import a PDF/DOCX rubric.</p>
                  </div>
                </button>

                <button className="eg-action-card">
                  <span className="material-symbols-rounded eg-action-icon">
                    history
                  </span>
                  <div>
                    <h3>Continue Grading</h3>
                    <p>Coming soon.</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Saved Rubrics + Feedback */}
            <section className="eg-dashboard-bottom">
              <div className="eg-bottom-column">
                <h2 className="eg-section-title">Saved Rubrics</h2>
                <p className="eg-muted-text">
                  Rubrics saved from the grader or builder appear here.
                </p>
                <div className="eg-placeholder-panel">
                  <span className="material-symbols-rounded">fact_check</span>
                  <p>No rubrics saved yet.</p>
                </div>
              </div>

              <div className="eg-bottom-column">
                <h2 className="eg-section-title">Recent Feedback</h2>
                <p className="eg-muted-text">
                  Reuse detailed feedback from previous grading sessions.
                </p>
                <div className="eg-placeholder-panel">
                  <span className="material-symbols-rounded">chat</span>
                  <p>No feedback yet.</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

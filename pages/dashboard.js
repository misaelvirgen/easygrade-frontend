// pages/dashboard.js
import React from "react";
import { getSession, useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  const teacherName =
    session?.user?.name || session?.user?.email || "Teacher";

  return (
    <div className="eg-root">
      <div className="eg-shell">
        {/* TOP BAR */}
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
          <nav className="eg-nav">
            <span className="eg-nav-hello">Hi, {teacherName}</span>
            <button
              type="button"
              className="eg-nav-link"
              onClick={() => (window.location.href = "/")}
            >
              Grade Essays
            </button>
            <button
              type="button"
              className="eg-nav-link"
              onClick={() => (window.location.href = "/rubric-builder")}
            >
              Rubric Builder
            </button>
            <button
              type="button"
              className="eg-nav-login"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log out
            </button>
          </nav>
        </header>

        {/* DASHBOARD HEADER */}
        <section className="eg-hero eg-dashboard-hero">
          <h1 className="eg-hero-title">Teacher Dashboard</h1>
          <p className="eg-hero-subtitle">
            View saved rubrics, recent essays, and quick grading stats at a glance.
          </p>
        </section>

        {/* DASHBOARD GRID */}
        <main className="eg-dashboard-grid">
          {/* Quick Stats */}
          <section className="eg-card eg-stat-card">
            <h2 className="eg-card-title">Quick Stats</h2>
            <div className="eg-stat-row">
              <div className="eg-stat-pill">
                <span className="eg-stat-label">Essays graded</span>
                <span className="eg-stat-value">42</span>
              </div>
              <div className="eg-stat-pill">
                <span className="eg-stat-label">Saved rubrics</span>
                <span className="eg-stat-value">8</span>
              </div>
              <div className="eg-stat-pill">
                <span className="eg-stat-label">Classes</span>
                <span className="eg-stat-value">3</span>
              </div>
            </div>
          </section>

          {/* Saved Rubrics */}
          <section className="eg-card eg-dashboard-card">
            <h2 className="eg-card-title">Saved Rubrics</h2>
            <ul className="eg-list">
              <li>5-Paragraph Essay Rubric</li>
              <li>Argumentative Writing – 10th Grade</li>
              <li>Narrative Writing – 7th Grade</li>
            </ul>
            <button
              type="button"
              className="eg-secondary-button"
              onClick={() => (window.location.href = "/rubric-builder")}
            >
              Open Rubric Builder
            </button>
          </section>

          {/* Recent Essays */}
          <section className="eg-card eg-dashboard-card">
            <h2 className="eg-card-title">Recent Essays</h2>
            <ul className="eg-list">
              <li>Period 2 – Climate Change Argument</li>
              <li>Period 4 – Mythology Narrative</li>
              <li>Period 6 – Identity Personal Essay</li>
            </ul>
            <button
              type="button"
              className="eg-secondary-button"
              onClick={() => (window.location.href = "/")}
            >
              Continue Grading
            </button>
          </section>

          {/* Upload Rubric shortcut */}
          <section className="eg-card eg-dashboard-card">
            <h2 className="eg-card-title">Upload Existing Rubric</h2>
            <p className="eg-muted-text">
              Quickly upload a PDF or DOCX rubric and refine it in the Rubric Builder.
            </p>
            <button
              type="button"
              className="eg-secondary-button"
              onClick={() => (window.location.href = "/rubric-builder")}
            >
              Upload Rubric
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

// Protect the page on the server
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
// pages/dashboard.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect route: redirect to /login if not authenticated
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

  if (!session) {
    // While redirecting
    return null;
  }

  const userName =
    session.user?.name || session.user?.email?.split("@")[0] || "Teacher";

  // TODO: later pull real stats from Supabase
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
                <h1 className="eg-dashboard-title">Welcome back, {userName}</h1>
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
                  Count of essays graded with EasyGrade.
                </p>
              </div>
              <div className="eg-stat-card eg-stat-card--accent">
                <h3>Time Saved</h3>
                <p className="eg-stat-number">
                  {stats.timeSavedHours}
                  <span className="eg-stat-unit"> hrs</span>
                </p>
                <p className="eg-stat-caption">
                  Estimated grading hours saved with AI assistance.
                </p>
              </div>
            </section>

            {/* Quick actions */}
            <section className="eg-dashboard-actions">
              <h2 className="eg-section-title">Quick Actions</h2>
              <div className="eg-actions-grid">
                <button
                  type="button"
                  className="eg-action-card"
                  onClick={() => router.push("/")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    edit_note
                  </span>
                  <div>
                    <h3>Grade a New Essay</h3>
                    <p>Jump straight into grading with your latest rubric.</p>
                  </div>
                </button>

                <button
                  type="button"
                  className="eg-action-card"
                  onClick={() => router.push("/rubric-builder")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    fact_check
                  </span>
                  <div>
                    <h3>Create New Rubric</h3>
                    <p>Generate or build a fresh rubric for an assignment.</p>
                  </div>
                </button>

                <button
                  type="button"
                  className="eg-action-card"
                  onClick={() => router.push("/")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    upload_file
                  </span>
                  <div>
                    <h3>Upload Existing Rubric</h3>
                    <p>
                      Import a rubric from PDF or DOCX and reuse it with AI
                      grading.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className="eg-action-card"
                  onClick={() => router.push("/")}
                >
                  <span className="material-symbols-rounded eg-action-icon">
                    history
                  </span>
                  <div>
                    <h3>Continue Grading</h3>
                    <p>Coming soon: pick up where you left off.</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Saved rubrics + recent feedback previews */}
            <section className="eg-dashboard-bottom">
              <div className="eg-bottom-column">
                <h2 className="eg-section-title">Saved Rubrics</h2>
                <p className="eg-muted-text">
                  Save rubrics from the grader or Rubric Builder and they&apos;ll
                  appear here.
                </p>
                <div className="eg-placeholder-panel">
                  <span className="material-symbols-rounded">fact_check</span>
                  <p>No rubrics saved yet.</p>
                </div>
              </div>

              <div className="eg-bottom-column">
                <h2 className="eg-section-title">Recent Feedback</h2>
                <p className="eg-muted-text">
                  Recent AI-generated feedback will be listed here for reuse.
                </p>
                <ul className="eg-feedback-list">
                  <li className="eg-feedback-item">
                    <div className="eg-feedback-tag">Coming soon</div>
                    <p>
                      Once you start grading, you&apos;ll see quick links to recent
                      feedback here.
                    </p>
                  </li>
                </ul>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

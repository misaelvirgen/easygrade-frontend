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

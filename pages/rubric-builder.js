import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { generateRubric } from "../services/apiService";
import { getUserProfile } from "../utils/getUserProfile";

export default function RubricBuilder() {
  const [gradeLevel, setGradeLevel] = useState("");
  const [rubricTitle, setRubricTitle] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Premium status
  const [isPremium, setIsPremium] = useState(null);

  // 🔒 If not logged in → show login prompt instead of redirecting
  if (status === "unauthenticated") {
    return (
      <div className="eg-root">
        <div className="eg-shell" style={{ textAlign: "center", padding: "3rem" }}>
          <h1>Please log in</h1>
          <button
            className="eg-nav-login"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Load premium status AFTER login
  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.email) return;

      const profile = await getUserProfile();
      setIsPremium(profile?.is_premium || false);
    }

    if (status === "authenticated") {
      loadProfile();
    }
  }, [status, session]);

  // Still loading session or premium
  if (status === "loading" || isPremium === null) {
    return (
      <div className="eg-root">
        <div className="eg-shell"><p>Loading…</p></div>
      </div>
    );
  }

  // NOT PREMIUM → show Upgrade screen
  if (!isPremium) {
    return (
      <div className="eg-root">
        <div className="eg-shell" style={{ textAlign: "center", padding: "3rem" }}>
          <h1>Upgrade Required</h1>
          <p>You need a Premium subscription to access the Rubric Builder.</p>

          <button
            className="eg-nav-login"
            onClick={() => router.push("/upgrade")}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  // ----------------------- RUBRIC BUILDER LOGIC -----------------------
  const handleGenerateRubric = async () => {
    if (!gradeLevel) {
      setErrorMsg("Please select a grade level.");
      return;
    }
    setErrorMsg("");
    setSaveStatus("");
    setGenerating(true);

    try {
      const generated = await generateRubric(
        rubricTitle || "Untitled Rubric",
        gradeLevel
      );
      setRubricText(generated.rubric || "");
    } catch {
      setErrorMsg("Failed to generate rubric.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRubric = () => {
    if (!rubricText.trim()) {
      setErrorMsg("Add rubric text before saving.");
      return;
    }

    try {
      const storageKey = "easygrade_custom_rubrics";
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(storageKey)
          : null;

      const existing = raw ? JSON.parse(raw) : [];
      const newRubric = {
        id: Date.now(),
        title: rubricTitle || `Rubric (${gradeLevel || "Unspecified"})`,
        gradeLevel,
        text: rubricText,
      };

      const updated = Array.isArray(existing)
        ? [...existing, newRubric]
        : [newRubric];

      window.localStorage.setItem(storageKey, JSON.stringify(updated));

      setSaveStatus("Rubric saved.");
    } catch {
      setErrorMsg("Failed to save rubric.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!rubricText.trim()) {
      setErrorMsg("Add rubric text before downloading.");
      return;
    }
    setErrorMsg("");
    setSaveStatus("");

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
      const left = 40;
      const right = 760;
      const bottom = 550;
      let y = 40;

      doc.setFontSize(14);
      doc.text("EASYGRADE — RUBRIC EXPORT", left, y);
      y += 22;

      if (rubricTitle.trim()) {
        doc.text(`Rubric Name: ${rubricTitle}`, left, y);
        y += 20;
      }

      if (gradeLevel.trim()) {
        doc.text(`Grade Level: ${gradeLevel}`, left, y);
        y += 22;
      }

      doc.setFontSize(13);
      doc.text("RUBRIC", left, y);
      y += 10;
      doc.line(left, y, right, y);
      y += 18;

      doc.setFontSize(11);
      const wrapped = doc.splitTextToSize(rubricText, right - left);

      wrapped.forEach((line) => {
        if (y > bottom - 120) {
          doc.addPage({ orientation: "landscape", unit: "pt", format: "letter" });
          y = 40;
        }
        doc.text(line, left, y);
        y += 16;
      });

      doc.save((rubricTitle || "rubric").replace(/[^\w\-]+/g, "_") + ".pdf");
    } catch {
      setErrorMsg("Failed to generate PDF.");
    }
  };

  const handleClear = () => {
    setRubricText("");
    setSaveStatus("");
    setErrorMsg("");
  };

  // ----------------------- UI -----------------------
  return (
    <div className="eg-root">
      <div className="eg-shell">

        {/* HEADER */}
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>

          <nav className="eg-nav">
            <Link href="/" className="eg-nav-link">Grade Essay</Link>
            <button className="eg-nav-link">Upload PDF</button>
            <Link href="/rubric-builder" className="eg-nav-link">Rubric Builder</Link>
            <button className="eg-nav-link">Reports</button>

            {!session && (
              <button className="eg-nav-login" onClick={() => router.push("/login")}>
                Login
              </button>
            )}

            {session && (
              <>
                <button className="eg-nav-link" onClick={() => router.push("/dashboard")}>
                  Dashboard
                </button>

                {!isPremium && (
                  <button className="eg-nav-link eg-upgrade-link" onClick={() => router.push("/upgrade")}>
                    Upgrade
                  </button>
                )}

                {isPremium && <span className="eg-premium-pill">Premium</span>}

                <button className="eg-nav-login" onClick={() => signOut()}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        {/* PAGE HEADER */}
        <section className="eg-builder-header">
          <h1 className="eg-page-title">Rubric Builder</h1>
          <p className="eg-page-subtitle">
            Create, edit, save, and export rubrics you can reuse across classes.
          </p>
          {errorMsg && <p className="eg-error-banner">{errorMsg}</p>}
          {saveStatus && <p className="eg-success-banner">{saveStatus}</p>}
        </section>

        {/* MAIN CONTENT */}
        <main className="eg-builder-main">
          {/* LEFT: SETTINGS */}
          <section className="eg-card">
            <h2 className="eg-card-title">Rubric Settings</h2>

            <label className="eg-label">Grade Level</label>
            <select
              className="eg-input"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            >
              <option value="">Select grade level…</option>
              <option value="Elementary">Elementary</option>
              <option value="Middle School">Middle School</option>
              <option value="High School">High School</option>
              <option value="College">College</option>
            </select>

            <label className="eg-label">Rubric Title</label>
            <input
              type="text"
              className="eg-input"
              value={rubricTitle}
              onChange={(e) => setRubricTitle(e.target.value)}
              placeholder="e.g., Argumentative Essay Rubric"
            />

            <button
              type="button"
              className="eg-secondary-button eg-button-inline"
              onClick={handleGenerateRubric}
              disabled={generating || !gradeLevel}
            >
              {generating ? "Generating…" : "Generate Rubric"}
            </button>
          </section>

          {/* RIGHT: RUBRIC TEXT */}
          <section className="eg-card">
            <h2 className="eg-card-title">Rubric</h2>
            <textarea
              className="eg-textarea"
              rows={14}
              value={rubricText}
              onChange={(e) => setRubricText(e.target.value)}
              placeholder="Your rubric will appear here. You can edit it freely."
            />

            <div className="eg-builder-actions">
              <button className="eg-secondary-button" onClick={handleSaveRubric}>
                Save Rubric
              </button>
              <button className="eg-secondary-button" onClick={handleDownloadPdf}>
                Download PDF
              </button>
              <button className="eg-link-button" onClick={handleClear}>
                Clear Rubric
              </button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

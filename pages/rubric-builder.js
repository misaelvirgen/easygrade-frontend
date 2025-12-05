import React, { useState } from "react";
import Link from "next/link";
import { generateRubric } from "../services/apiService";

export default function RubricBuilder() {
  const [gradeLevel, setGradeLevel] = useState("");
  const [rubricTitle, setRubricTitle] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerateRubric = async () => {
    if (!gradeLevel) {
      setErrorMsg("Please select a grade level before generating.");
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
    } catch (err) {
      console.error(err);
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
    setErrorMsg("");

    try {
      const storageKey = "easygrade_custom_rubrics";
      const raw = typeof window !== "undefined"
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

      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      setSaveStatus("Rubric saved.");
    } catch (e) {
      console.error(e);
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

    const doc = new jsPDF({
      orientation: "landscape", // ← NEW: horizontal layout
      unit: "pt",
      format: "letter",
    });

    const left = 40;
    const right = 760;   // wider page width in landscape
    const bottom = 550;  // shorter page height in landscape
    let y = 40;

    // -------- HEADER --------
    doc.setFontSize(14);
    doc.text("EASYGRADE — RUBRIC EXPORT", left, y);
    y += 22;

    // Rubric Name
    if (rubricTitle.trim()) {
      doc.setFontSize(12);
      doc.text(`Rubric Name: ${rubricTitle}`, left, y);
      y += 20;
    }

    // Grade Level
    if (gradeLevel.trim()) {
      doc.setFontSize(12);
      doc.text(`Grade Level: ${gradeLevel}`, left, y);
      y += 22;
    }

    // Section Title
    doc.setFontSize(13);
    doc.text("RUBRIC", left, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(left, y, right, y);
    y += 18;

    // -------- RUBRIC TEXT --------
    doc.setFontSize(11);
    const maxWidth = right - left;
    const wrapped = doc.splitTextToSize(rubricText, maxWidth);

    wrapped.forEach((line) => {
      if (y > bottom - 120) {
        doc.addPage({ orientation: "landscape", unit: "pt", format: "letter" });
        y = 40;
      }
      doc.text(line, left, y);
      y += 16;
    });

    // -------- COMMENTS SECTION --------
    if (y > bottom - 80) {
      doc.addPage({
        orientation: "landscape",
        unit: "pt",
        format: "letter",
      });
      y = 40;
    }

    y += 10;

    doc.setFontSize(12);
    doc.text("TEACHER COMMENTS", left, y);
    y += 10;

    doc.setLineWidth(0.5);
    doc.line(left, y, right, y);
    y += 18;

    // AUTO-FILL REMAINING SPACE WITH STRAIGHT LINES
    while (y < bottom) {
      doc.line(left, y, right, y);
      y += 22; // thin straight lines evenly spaced
    }

    const safeTitle =
      (rubricTitle || "rubric").replace(/[^\w\-]+/g, "_") + ".pdf";

    doc.save(safeTitle);
  } catch (e) {
    console.error(e);
    setErrorMsg("Failed to generate PDF.");
  }
};


  const handleClear = () => {
    setRubricText("");
    setSaveStatus("");
    setErrorMsg("");
  };

  return (
    <div className="eg-root">
      <div className="eg-shell">
        {/* HEADER */}
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
          <nav className="eg-nav">
            <Link href="/" className="eg-nav-link">
              Grade Essay
            </Link>
            <button className="eg-nav-link" type="button">
              Upload PDF
            </button>
            <Link href="/rubric-builder" className="eg-nav-link">
              Rubric Builder
            </Link>
            <button className="eg-nav-link" type="button">
              Reports
            </button>
            <button className="eg-nav-login" type="button">
              Login
            </button>
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
              <button
                type="button"
                className="eg-secondary-button eg-button-inline"
                onClick={handleSaveRubric}
              >
                Save Rubric
              </button>
              <button
                type="button"
                className="eg-secondary-button eg-button-inline"
                onClick={handleDownloadPdf}
              >
                Download PDF
              </button>
              <button
                type="button"
                className="eg-link-button"
                onClick={handleClear}
              >
                Clear Rubric
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

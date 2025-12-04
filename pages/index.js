import React, { useState } from "react";
import {
  gradeAssignment,
  uploadPdf,
  uploadRubric,
  generateRubric,
} from "../services/apiService";

export default function Home() {
  const [essayPrompt, setEssayPrompt] = useState("");
  const [essayText, setEssayText] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [gradeLevel, setGradeLevel] = useState("");

  const [rubricFile, setRubricFile] = useState(null);
  const [rubricLoading, setRubricLoading] = useState(false);
  const [rubricUploaded, setRubricUploaded] = useState(false);

  const [savedRubrics] = useState([
    { title: "5-Paragraph Essay Rubric", text: "Intro...\nBody...\nConclusion..." },
    { title: "Argumentative Writing Rubric", text: "Claim...\nEvidence..." },
    { title: "Narrative Writing Rubric", text: "Voice...\nStructure..." },
  ]);

  const [usingSavedRubric, setUsingSavedRubric] = useState(false);

  // NEW MODAL STATE
  const [showSavedRubricModal, setShowSavedRubricModal] = useState(false);
  const [savedRubricView, setSavedRubricView] = useState("list"); // list or grid

  // -----------------------------
  // GRADE ESSAY
  // -----------------------------
  const handleGrade = async () => {
    if (!essayPrompt.trim()) {
      setErrorMsg("Please enter an assignment prompt before grading.");
      return;
    }
    if (!essayText.trim()) {
      setErrorMsg("Please paste or extract an essay before grading.");
      return;
    }

    setErrorMsg("");
    setGrading(true);
    setGradeResult(null);

    try {
      const data = await gradeAssignment(essayPrompt, essayText, rubricText);
      setGradeResult(data);
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong while grading.");
    } finally {
      setGrading(false);
    }
  };

  // -----------------------------
  // AI GENERATE RUBRIC
  // -----------------------------
  const handleGenerateRubric = async () => {
    if (!essayPrompt.trim()) {
      setErrorMsg("Assignment prompt required.");
      return;
    }
    if (!gradeLevel) {
      setErrorMsg("Please select a grade level.");
      return;
    }

    setErrorMsg("");
    setRubricLoading(true);

    try {
      const generated = await generateRubric(essayPrompt, gradeLevel);
      setRubricText(generated.rubric || "");
      setRubricUploaded(false);
      setUsingSavedRubric(false);
    } catch {
      setErrorMsg("Failed to generate rubric.");
    } finally {
      setRubricLoading(false);
    }
  };

  // -----------------------------
  // PDF → ESSAY EXTRACT
  // -----------------------------
  const handlePdfExtract = async () => {
    if (!pdfFile) return;

    setPdfLoading(true);
    setErrorMsg("");

    try {
      const data = await uploadPdf(pdfFile);
      setEssayText(data?.text || "");
    } catch {
      setErrorMsg("Failed to extract text from PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  // -----------------------------
  // UPLOAD RUBRIC → TEXT EXTRACT
  // -----------------------------
  const handleRubricExtract = async () => {
    if (!rubricFile) return;

    setRubricLoading(true);
    setErrorMsg("");

    try {
      const data = await uploadRubric(rubricFile);
      setRubricText(data?.text || "");
      setRubricUploaded(true);
      setUsingSavedRubric(false);
    } catch {
      setErrorMsg("Failed to extract text from rubric file.");
    } finally {
      setRubricLoading(false);
    }
  };

  // -----------------------------
  // LOAD SELECTED SAVED RUBRIC
  // -----------------------------
  const handleChooseSavedRubric = (rubric) => {
    setRubricText(rubric.text);
    setRubricUploaded(false);
    setUsingSavedRubric(true);
    setShowSavedRubricModal(false);
  };

  // -----------------------------
  // BUILD UI
  // -----------------------------
  return (
    <div className="eg-root">
      <div className="eg-shell">

        {/* TOP BAR */}
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
          <nav className="eg-nav">
            <button className="eg-nav-link">Grade Essay</button>
            <button className="eg-nav-link">Upload PDF</button>
            <button className="eg-nav-link">Rubric Builder</button>
            <button className="eg-nav-link">Reports</button>
            <button className="eg-nav-login">Login</button>
          </nav>
        </header>

        {/* HERO */}
        <section className="eg-hero">
          <img src="/EasyGradeLogo.png" className="eg-hero-logo" />
          <h1 className="eg-hero-title">Grade Essays Instantly.</h1>
          <p className="eg-hero-subtitle">
            Upload student work, apply custom rubrics, and get high-quality AI feedback in seconds.
          </p>
          {errorMsg && <p className="eg-error-banner">{errorMsg}</p>}
        </section>

        {/* MAIN GRID */}
        <main className="eg-main-grid">

          {/* PROMPT */}
          <div className="eg-card">
            <label className="eg-label">Essay Prompt</label>
            <textarea
              className="eg-textarea"
              placeholder="Enter the assignment prompt..."
              value={essayPrompt}
              onChange={(e) => setEssayPrompt(e.target.value)}
            />
          </div>

          <div className="eg-column">

            {/* STUDENT ESSAY */}
            <section className="eg-card">
              <h2 className="eg-card-title">Student Essay</h2>
              <textarea
                rows={9}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Paste essay text here…"
                className="eg-textarea"
              />
            </section>

            {/* RUBRIC SECTION */}
            <section className="eg-card">
              <h2 className="eg-card-title">Rubric (Optional)</h2>

              {/* BUTTONS: Generate + Use Saved Rubric */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <button
                  type="button"
                  disabled={
                    rubricUploaded ||
                    usingSavedRubric ||
                    !essayPrompt ||
                    !gradeLevel ||
                    rubricLoading
                  }
                  onClick={handleGenerateRubric}
                  className="eg-secondary-button"
                >
                  {rubricLoading ? "Generating…" : "Generate Rubric"}
                </button>

                <button
                  type="button"
                  className="eg-secondary-button"
                  onClick={() => setShowSavedRubricModal(true)}
                  disabled={rubricUploaded}
                >
                  Use Saved Rubric
                </button>
              </div>

              {/* Grade Level */}
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

              {/* Rubric Text */}
              <textarea
                rows={6}
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                placeholder="Paste rubric or generate it…"
                className="eg-textarea"
              />

              {/* Upload Rubric */}
              <label className="eg-label" style={{ marginTop: "12px" }}>
                Upload Rubric (PDF, DOCX, JPG, PNG)
              </label>

              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setRubricFile(e.target.files?.[0] || null)}
                className="eg-file-input"
              />

              <button
                type="button"
                onClick={handleRubricExtract}
                disabled={!rubricFile || rubricLoading}
                className="eg-secondary-button"
              >
                {rubricLoading ? "Uploading…" : "Upload Rubric"}
              </button>

              {/* CLEAR BUTTONS */}
              <button
                type="button"
                className="eg-link-button"
                onClick={() => {
                  setRubricFile(null);
                  setRubricUploaded(false);
                  setUsingSavedRubric(false);
                  setRubricText("");
                }}
              >
                Clear uploaded rubric
              </button>

              {usingSavedRubric && (
                <button
                  type="button"
                  className="eg-link-button"
                  onClick={() => {
                    setUsingSavedRubric(false);
                    setRubricUploaded(false);
                    setRubricText("");
                  }}
                >
                  Clear saved rubric
                </button>
              )}
            </section>

            {/* GRADE BUTTON */}
            <button
              type="button"
              onClick={handleGrade}
              disabled={grading}
              className="eg-primary-button"
            >
              {grading ? "Grading…" : "Grade Essay"}
            </button>

          </div>

          {/* RIGHT COLUMN */}
          <div className="eg-column">
            {/* PDF Upload */}
            <section className="eg-card">
              <h2 className="eg-card-title">Upload PDF</h2>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="eg-file-input"
              />

              <button
                type="button"
                onClick={handlePdfExtract}
                disabled={!pdfFile || pdfLoading}
                className="eg-secondary-button"
              >
                {pdfLoading ? "Extracting…" : "Extract Text"}
              </button>

              {pdfFile && <p className="eg-file-name">{pdfFile.name}</p>}
            </section>

            {/* RESULTS */}
            <section className="eg-card eg-results-card">
              <h2 className="eg-card-title">Grading Results</h2>

              {!gradeResult ? (
                <p className="eg-muted-text">Results will appear here after grading.</p>
              ) : (
                <div className="eg-results-body">
                  {typeof gradeResult.score !== "undefined" && (
                    <p className="eg-score">
                      Score: <span>{gradeResult.score}</span>
                    </p>
                  )}

                  {gradeResult.feedback && (
                    <div className="eg-feedback-block">
                      <h3>Feedback</h3>
                      <p>{gradeResult.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* --------------------------------------------- */}
        {/* SAVED RUBRIC POPUP MODAL */}
        {/* --------------------------------------------- */}
        {showSavedRubricModal && (
          <div className="eg-modal-overlay">
            <div className="eg-modal">

              <h2>Select a Saved Rubric</h2>

              {/* VIEW TOGGLE */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button
                  className="eg-secondary-button"
                  onClick={() => setSavedRubricView("list")}
                >
                  List View
                </button>
                <button
                  className="eg-secondary-button"
                  onClick={() => setSavedRubricView("grid")}
                >
                  Grid View
                </button>
              </div>

              {/* RUBRIC DISPLAY MODES */}
              {savedRubricView === "list" ? (
                <div>
                  {savedRubrics.map((r, idx) => (
                    <div
                      key={idx}
                      className="eg-saved-list-item"
                      onClick={() => handleChooseSavedRubric(r)}
                    >
                      {r.title}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="eg-saved-grid">
                  {savedRubrics.map((r, idx) => (
                    <div
                      key={idx}
                      className="eg-saved-grid-item"
                      onClick={() => handleChooseSavedRubric(r)}
                    >
                      📘
                      <p>{r.title}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="eg-link-button"
                onClick={() => setShowSavedRubricModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

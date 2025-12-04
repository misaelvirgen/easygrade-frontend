import React, { useState } from "react";
import {
  gradeAssignment,
  uploadPdf,
  uploadRubric,
  generateRubric,
} from "../services/apiService";

export default function Home() {
  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  const [essayPrompt, setEssayPrompt] = useState("");
  const [essayText, setEssayText] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [gradeLevel, setGradeLevel] = useState("");
  const [rubricFile, setRubricFile] = useState(null);
  const [rubricLoading, setRubricLoading] = useState(false);
  const [rubricUploaded, setRubricUploaded] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [savedRubrics] = useState([
    { title: "5-Paragraph Essay Rubric", text: "Intro...\nBody...\nConclusion..." },
    { title: "Argumentative Writing Rubric", text: "Claim...\nEvidence..." },
    { title: "Narrative Writing Rubric", text: "Voice...\nStructure..." },
  ]);

  const [usingSavedRubric, setUsingSavedRubric] = useState(false);

  const [showSavedRubricModal, setShowSavedRubricModal] = useState(false);
  const [savedRubricView, setSavedRubricView] = useState("list");

  // ---------------------------------------------
  // GRADING
  // ---------------------------------------------
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
      const result = await gradeAssignment(essayPrompt, essayText, rubricText);
      setGradeResult(result);
    } catch {
      setErrorMsg("Something went wrong while grading.");
    } finally {
      setGrading(false);
    }
  };

  // ---------------------------------------------
  // PDF EXTRACTION
  // ---------------------------------------------
  const handlePdfExtract = async () => {
    if (!pdfFile) return;

    setPdfLoading(true);
    setErrorMsg("");

    try {
      const result = await uploadPdf(pdfFile);
      setEssayText(result.text || "");
    } catch {
      setErrorMsg("Failed to extract text from PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  // ---------------------------------------------
  // RUBRIC EXTRACTION (UPLOAD)
  // ---------------------------------------------
  const handleRubricExtract = async () => {
    if (!rubricFile) return;

    setRubricLoading(true);
    setErrorMsg("");

    try {
      const result = await uploadRubric(rubricFile);
      setRubricText(result.text || "");
      setRubricUploaded(true);
      setUsingSavedRubric(false);
    } catch {
      setErrorMsg("Failed to extract rubric text.");
    } finally {
      setRubricLoading(false);
    }
  };

  // ---------------------------------------------
  // GENERATE RUBRIC
  // ---------------------------------------------
  const handleGenerateRubric = async () => {
    if (!essayPrompt.trim()) {
      setErrorMsg("Assignment prompt required.");
      return;
    }
    if (!gradeLevel) {
      setErrorMsg("Please select a grade level.");
      return;
    }

    setRubricLoading(true);
    setErrorMsg("");

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

  // ---------------------------------------------
  // LOAD SAVED RUBRIC
  // ---------------------------------------------
  const handleChooseSavedRubric = (rubric) => {
    setRubricText(rubric.text);
    setUsingSavedRubric(true);
    setRubricUploaded(false);
    setShowSavedRubricModal(false);
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <div className="eg-root">
      <div className="eg-shell">

        {/* HEADER */}
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

          {/* LEFT COLUMN */}
          <div className="eg-column">

            {/* STUDENT ESSAY */}
          <section className="eg-card eg-card--medium">
  <h2 className="eg-card-title">Student Essay</h2>

  <textarea
    rows={9}
    value={essayText}
    onChange={(e) => setEssayText(e.target.value)}
    className="eg-textarea"
    placeholder="Paste essay text here…"
  />

  <button
    type="button"
    className="eg-link-button"
    onClick={() => setEssayText("")}
    style={{ marginTop: "6px" }}
  >
    Clear Essay
  </button>
</section>


            {/* UPLOAD PDF */}
            <section className="eg-card eg-card--small">
              <h2 className="eg-card-title">Upload PDF</h2>

              <input
                type="file"
                accept="application/pdf"
                className="eg-file-input"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />

              {pdfFile && <p className="eg-file-name">{pdfFile.name}</p>}

              <button
                type="button"
                onClick={handlePdfExtract}
                disabled={!pdfFile || pdfLoading}
                className="eg-secondary-button eg-button-inline"
              >
                {pdfLoading ? "Extracting…" : "Extract Text"}
              </button>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="eg-column">

            {/* ESSAY PROMPT */}
            <section className="eg-card eg-card--medium">
              <h2 className="eg-card-title">Essay Prompt</h2>
              <textarea
                className="eg-textarea"
                placeholder="Enter assignment prompt…"
                value={essayPrompt}
                onChange={(e) => setEssayPrompt(e.target.value)}
              />
            </section>

            {/* RUBRIC SECTION */}
            <section className="eg-card">
              <h2 className="eg-card-title">Rubric (Optional)</h2>

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
                className="eg-textarea"
                value={rubricText}
                placeholder="Paste rubric, upload one, or generate one…"
                onChange={(e) => setRubricText(e.target.value)}
              />

              {/* Upload Label */}
              <label className="eg-label" style={{ marginTop: 12 }}>
                Upload Rubric (PDF, DOCX, JPG, PNG)
              </label>

              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setRubricFile(e.target.files?.[0] || null)}
                className="eg-file-input"
              />

              {rubricFile && <p className="eg-file-name">{rubricFile.name}</p>}

              {/* BUTTON ROW */}
              <div className="eg-rubric-button-row">
                <button
                  className="eg-secondary-button eg-button-inline"
                  disabled={!rubricFile || rubricLoading}
                  onClick={handleRubricExtract}
                >
                  {rubricLoading ? "Uploading…" : "Upload Rubric"}
                </button>

                <button
                  className="eg-secondary-button eg-button-inline"
                  disabled={
                    rubricUploaded ||
                    usingSavedRubric ||
                    !essayPrompt ||
                    !gradeLevel ||
                    rubricLoading
                  }
                  onClick={handleGenerateRubric}
                >
                  {rubricLoading ? "Generating…" : "Generate Rubric"}
                </button>

                <button
                  className="eg-secondary-button eg-button-inline"
                  onClick={() => setShowSavedRubricModal(true)}
                >
                  Use Saved Rubric
                </button>
              </div>

              <button
                className="eg-link-button"
                onClick={() => {
                  setRubricText("");
                  setRubricFile(null);
                  setRubricUploaded(false);
                  setUsingSavedRubric(false);
                }}
              >
                Clear Rubric
              </button>
            </section>
          </div>
        </main>

        {/* FULL-WIDTH GRADE BUTTON */}
        <button
          type="button"
          className="eg-primary-button eg-grade-row"
          disabled={grading}
          onClick={handleGrade}
        >
          {grading ? "Grading…" : "Grade Essay"}
        </button>

        {/* FULL-WIDTH RESULTS */}
        <section className="eg-card eg-results-card" style={{ gridColumn: "1 / -1" }}>
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

        {/* SAVED RUBRIC MODAL */}
        {showSavedRubricModal && (
          <div className="eg-modal-overlay">
            <div className="eg-modal">
              <h2>Select Saved Rubric</h2>

              <div className="eg-modal-toggle-row">
                <button
                  className="eg-icon-button"
                  onClick={() => setSavedRubricView("list")}
                >
                  <span className="material-symbols-rounded">view_list</span>
                </button>
                <button
                  className="eg-icon-button"
                  onClick={() => setSavedRubricView("grid")}
                >
                  <span className="material-symbols-rounded">grid_view</span>
                </button>
              </div>

              {savedRubricView === "list" ? (
                <div>
                  {savedRubrics.map((r, i) => (
                    <div
                      key={i}
                      className="eg-saved-list-item"
                      onClick={() => handleChooseSavedRubric(r)}
                    >
                      {r.title}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="eg-saved-grid">
                  {savedRubrics.map((r, i) => (
                    <div
                      key={i}
                      className="eg-saved-grid-item"
                      onClick={() => handleChooseSavedRubric(r)}
                    >
                      <span className="material-symbols-rounded">description</span>
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

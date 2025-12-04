import React, { useState } from "react";
import { gradeAssignment, uploadPdf } from "../services/apiService";

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
  const [rubricLoading, setRubricLoading] = useState(false);


  const handleGrade = async () => {
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

  const handleGenerateRubric = async () => {
  if (!essayPrompt.trim()) {
    setErrorMsg("Please enter an assignment prompt before generating a rubric.");
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
  } catch (err) {
    setErrorMsg("Failed to generate rubric.");
  } finally {
    setRubricLoading(false);
  }
};

  const handlePdfExtract = async () => {
    if (!pdfFile) return;

    setPdfLoading(true);
    setErrorMsg("");

    try {
      const data = await uploadPdf(pdfFile);
      setEssayText(data?.text || "");
    } catch (err) {
      setErrorMsg("Failed to extract text from PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="eg-root">
      <div className="eg-shell">
        {/* TOP BAR */}
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
          <nav className="eg-nav">
            <button type="button" className="eg-nav-link">
              Grade Essay
            </button>
            <button type="button" className="eg-nav-link">
              Upload PDF
            </button>
            <button type="button" className="eg-nav-link">
              Rubric Builder
            </button>
            <button type="button" className="eg-nav-link">
              Reports
            </button>
            <button type="button" className="eg-nav-login">
              Login
            </button>
          </nav>
        </header>

        {/* HERO */}
        <section className="eg-hero">
          <img
            src="/EasyGradeLogo.png"
            alt="EasyGrade"
            className="eg-hero-logo"
          />
          <h1 className="eg-hero-title">Grade Essays Instantly.</h1>
          <p className="eg-hero-subtitle">
            Upload student work, apply custom rubrics, and get high-quality AI
            feedback in seconds. Perfect for busy teachers and real classrooms.
          </p>
          {errorMsg && <p className="eg-error-banner">{errorMsg}</p>}
        </section>

        {/* MAIN GRID */}
        <main className="eg-main-grid">
          {/* LEFT: ESSAY + RUBRIC + BUTTON */}
          {/* --- Essay Prompt Section --- */}
<div className="eg-card">
  <label className="eg-label">Essay Prompt</label>
  <textarea
    className="eg-textarea"
    placeholder="Enter the assignment prompt here..."
    value={essayPrompt}
    onChange={(e) => setEssayPrompt(e.target.value)}
  />
</div>

          <div className="eg-column">
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

            <section className="eg-card">
  <h2 className="eg-card-title">Rubric (Optional)</h2>

  {/* Grade Level Selector */}
  <label className="eg-label">Grade Level (required for rubric generation)</label>
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

  <textarea
    rows={6}
    value={rubricText}
    onChange={(e) => setRubricText(e.target.value)}
    placeholder="Paste rubric here…"
    className="eg-textarea"
  />

  {/* Generate Rubric Button */}
  <button
    type="button"
    disabled={!essayPrompt || !gradeLevel || rubricLoading}
    onClick={handleGenerateRubric}
    className="eg-secondary-button"
  >
    {rubricLoading ? "Generating…" : "Generate Rubric"}
  </button>
</section>


            <button
              type="button"
              onClick={handleGrade}
              disabled={grading}
              className="eg-primary-button"
            >
              {grading ? "Grading…" : "Grade Essay"}
            </button>
          </div>

          {/* RIGHT: PDF + RESULTS */}
          <div className="eg-column">
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
              {pdfFile && (
                <p className="eg-file-name" title={pdfFile.name}>
                  {pdfFile.name}
                </p>
              )}
            </section>

            <section className="eg-card eg-results-card">
              <h2 className="eg-card-title">Grading Results</h2>
              {!gradeResult && (
                <p className="eg-muted-text">
                  Results will appear here after grading.
                </p>
              )}

              {gradeResult && (
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
      </div>
    </div>
  );
}

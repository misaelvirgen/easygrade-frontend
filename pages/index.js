import React, { useState } from "react";
import { gradeAssignment, uploadPdf } from "../services/apiService";

export default function Home() {
  const [essayText, setEssayText] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGrade = async () => {
    if (!essayText.trim()) {
      setErrorMsg("Please paste or extract an essay before grading.");
      return;
    }
    setErrorMsg("");
    setGrading(true);
    setGradeResult(null);

    try {
      const data = await gradeAssignment(essayText, rubricText);
      setGradeResult(data);
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong while grading.");
    } finally {
      setGrading(false);
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
              <textarea
                rows={6}
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                placeholder="Paste rubric here…"
                className="eg-textarea"
              />
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

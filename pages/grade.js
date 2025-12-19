// pages/grade.js
import React, { useState, useEffect, useRef } from "react";
import MainNav from "@/components/MainNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  gradeAssignment,
  uploadPdf,
  uploadRubric,
} from "@/services/apiService";

const BUILT_IN_RUBRICS = [
  { id: "builtin-1", title: "5-Paragraph Essay Rubric", text: "Introduction...\nBody...\nConclusion..." },
  { id: "builtin-2", title: "Argumentative Writing Rubric", text: "Claim...\nEvidence...\nReasoning..." },
];

export default function Grade() {
  const { profile, refreshProfile } = useAuth();
  const isPremium = profile?.is_premium === true;
  const router = useRouter();

  const FREE_PLAN_LIMIT = 10;

  const essaysGradedThisMonth =
  profile?.essays_used_this_month ?? 0;

  const essaysRemaining = Math.max(
  0,
  FREE_PLAN_LIMIT - essaysGradedThisMonth
  );

  
  const [essayPrompt, setEssayPrompt] = useState("");
  const [essayText, setEssayText] = useState("");
  const [rubricText, setRubricText] = useState("");

  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [rubricError, setRubricError] = useState("");
  const [rubricName, setRubricName] = useState("");
  const pdfInputRef = useRef(null);
  const rubricInputRef = useRef(null);


  const [rubricFile, setRubricFile] = useState(null);
  const [rubricLoading, setRubricLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [savedRubrics, setSavedRubrics] = useState(BUILT_IN_RUBRICS);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [rubricView, setRubricView] = useState("list"); // list | grid
  const [rubricSearch, setRubricSearch] = useState("");

  /* ---------------- LOAD SAVED RUBRICS ---------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("easygrade_custom_rubrics");
      const custom = raw ? JSON.parse(raw) : [];
      setSavedRubrics([...BUILT_IN_RUBRICS, ...custom]);
    } catch {
      setSavedRubrics(BUILT_IN_RUBRICS);
    }
  }, []);

  /* ---------------- ESC CLOSE MODAL ---------------- */
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setShowRubricModal(false);
    }
    if (showRubricModal) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showRubricModal]);

  /* ---------------- ACTIONS ---------------- */
  const handleGrade = async () => {
  // Block free users who have hit their limit
  if (!isPremium && essaysRemaining <= 0) {
    router.push("/upgrade");
    return;
  }

  // Basic validation
  if (!essayPrompt.trim())
    return setErrorMsg("Please enter an assignment prompt.");

  if (!essayText.trim())
    return setErrorMsg("Please paste an essay.");

  setErrorMsg("");
  setGrading(true);
  setGradeResult(null);

  try {
    const result = await gradeAssignment(
      essayPrompt,
      essayText,
      rubricText
    );
    setGradeResult(result);

    await refreshProfile();

  } catch {
    setErrorMsg("Something went wrong while grading.");
  } finally {
    setGrading(false);
  }
};


  const handlePdfExtract = async () => {
    if (!pdfFile) return setErrorMsg("Please select a PDF first.");
    setPdfLoading(true);
    setErrorMsg("");

    try {
  const result = await uploadPdf(pdfFile);
  setEssayText(result.text || "");
  setExtractError(""); // 👈 clear inline error
} catch {
  setExtractError("Failed to extract text from file.");
} finally {
  setPdfLoading(false);
}
  };

 const handleRubricUpload = async () => {
  if (!rubricFile) {
    setRubricError("Please choose a file to upload.");
    return;
  }

  setRubricLoading(true);
  setRubricError("");

  try {
    const result = await uploadRubric(rubricFile);
    setRubricText(result.text || "");
    setRubricName(rubricFile.name); // store name
  } catch {
    setRubricError("Failed to extract rubric.");
  } finally {
    setRubricLoading(false);
  }
};


  const handleChooseRubric = (rubric) => {
  setRubricText(rubric.text);
  setRubricName(rubric.title); // 👈 THIS fixes "Untitled Rubric"
  setRubricFile(null);
  setRubricError("");

  if (rubricInputRef.current) {
    rubricInputRef.current.value = "";
  }

  setShowRubricModal(false);
};


  const filteredRubrics = savedRubrics.filter((r) =>
    r.title.toLowerCase().includes(rubricSearch.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="eg-root">
      <div className="eg-shell">
        <MainNav />

        {/* HERO */}
        <section className="eg-hero">
          <h1 className="eg-hero-title">Grading Made Easy.</h1>
          <p className="eg-hero-subtitle">
            Paste student work, apply custom rubrics, and get high-quality feedback in seconds.
          </p>
          
          {!isPremium && (
  <p
    className={`eg-plan-status ${
      essaysRemaining <= 3 ? "eg-plan-status--danger" : "eg-plan-status--warning"
    }`}
  >
    Free plan — {essaysRemaining} essays remaining this month
  </p>
)}


          {errorMsg && <p className="eg-error-banner">{errorMsg}</p>}
        </section>

        {/* MAIN */}
<main className="eg-main-grid">
  {/* STEP 1: ESSAY PROMPT */}
  <section className="eg-card eg-card--medium">
    <h2 className="eg-card-title">Step 1: Assignment Prompt</h2>
    <textarea
      className="eg-textarea"
      value={essayPrompt}
      onChange={(e) => setEssayPrompt(e.target.value)}
      placeholder="Enter assignment prompt…"
    />
  </section>

  {/* STEP 2: RUBRIC */}
  <section className="eg-card">
  {/* Header */}
  <div className="eg-card-header">
    <h2 className="eg-card-title">Step 2: Add Rubric (optional)</h2>
    <button
  className="eg-link-button"
  onClick={() => {
    setRubricText("");
    setRubricFile(null);
    setRubricName("");
    setRubricError("");

    if (rubricInputRef.current) {
      rubricInputRef.current.value = "";
    }
  }}
>
  Clear Rubric
</button>

  </div>

  {/* Status */}
  <div className="eg-rubric-status">
    {rubricText ? (
      <p className="eg-rubric-active">
        Current Rubric: <strong>{rubricName || "Untitled Rubric"}</strong>
      </p>
    ) : (
      <p className="eg-muted-text">No rubric added yet.</p>
    )}
  </div>

  {/* Upload Rubric */}
 <input
  ref={rubricInputRef}
  type="file"
  accept=".pdf,.docx,.jpg,.png"
  className="eg-file-input"
  onChange={(e) => {
    setRubricFile(e.target.files?.[0] || null);
    if (rubricError) setRubricError("");
  }}
 />


  <div className="eg-rubric-button-row">
    <button
      className="eg-secondary-button eg-button-inline"
      onClick={handleRubricUpload}
      disabled={rubricLoading}
    >
      {rubricLoading ? "Uploading…" : "Upload Rubric"}
    </button>

    <button
  className="eg-secondary-button eg-button-inline"
  onClick={() => {
    if (!isPremium) {
      router.push("/upgrade");
      return;
    }
    setShowRubricModal(true);
  }}
>
  Use Saved Rubric
</button>

  </div>

  {/* Inline error */}
  {rubricError && (
    <p className="eg-inline-error">{rubricError}</p>
  )}
</section>

  {/* STEP 3: STUDENT ESSAY (FULL WIDTH) */}
  <section className="eg-card eg-card--full">
  <div className="eg-card-header">
  <h2 className="eg-card-title">Step 3: Student Essay</h2>
  <button
  className="eg-link-button"
  onClick={() => {
    setEssayText("");
    setExtractError("");
    setPdfFile(null);

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  }}
>
  Clear Essay
</button>

</div>


  <div
    className="eg-essay-dropzone"
    onDragOver={(e) => {
      e.preventDefault();
      e.currentTarget.classList.add("eg-dropzone--active");
    }}
    onDragLeave={(e) => {
      e.currentTarget.classList.remove("eg-dropzone--active");
    }}
    onDrop={async (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("eg-dropzone--active");

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      setPdfFile(file);

      // Auto-extract on drop
      try {
        setPdfLoading(true);
        const result = await uploadPdf(file);
        setEssayText(result.text || "");
      } catch {
        setExtractError("Failed to extract text from file.");
      } finally {
        setPdfLoading(false);
      }
    }}
  >
    {/* Textarea */}
    <textarea
  className="eg-textarea eg-textarea--dropzone"
  rows={10}
  value={essayText}
  onChange={(e) => {
    setEssayText(e.target.value);
    if (extractError) setExtractError("");
  }}
  placeholder="Paste essay text here…"
/>


    {/* Overlay */}
    {!essayText && (
      <div className="eg-dropzone-overlay">
        <label className="eg-dropzone-content">
          {/* Square + icon */}
          <div className="eg-dropzone-plus">+</div>

          <p className="eg-dropzone-title">Click to upload</p>
          <p className="eg-dropzone-subtitle">
            or drag and drop a PDF or DOCX
          </p>

          <input
            type="file"
            accept=".pdf,.docx"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setPdfFile(file);

              try {
                setPdfLoading(true);
                const result = await uploadPdf(file);
                setEssayText(result.text || "");
              } catch {
                setExtractError("Failed to extract text from file.");
              } finally {
                setPdfLoading(false);
              }
            }}
          />

          <button
            type="button"
            className="eg-secondary-button eg-button-inline"
            onClick={(e) => {
              e.preventDefault();
              if (!pdfFile) {
                setExtractError("Please choose a file before extracting text.");
                return;
              }
              handlePdfExtract();
            }}
            disabled={pdfLoading}
            style={{ marginTop: 12 }}
          >
            {pdfLoading ? "Extracting…" : "Extract Text"}
          </button>

          {extractError && (
            <p className="eg-inline-error">{extractError}</p>
          )}

          {pdfFile && <p className="eg-file-name">{pdfFile.name}</p>}
        </label>
      </div>
    )}
  </div>

<div className="eg-word-count-card">
  {essayText.trim()
    ? `${essayText.trim().split(/\s+/).length} words`
    : "0 words"}
</div>

</section>


</main>


        <button
          className="eg-primary-button eg-grade-row"
          disabled={grading}
          onClick={handleGrade}
        >
          {grading ? "Grading…" : "Grade Essay"}
        </button>

        {/* RESULTS */}
        <section className="eg-card eg-results-card">
          <h2 className="eg-card-title">Grading Results</h2>
          {!gradeResult ? (
            <p className="eg-muted-text">Results will appear here after grading.</p>
          ) : (
            <div className="eg-results-body">
              <p className="eg-score">
                Score: <span>{gradeResult.score}</span>
              </p>
              <div className="eg-feedback-block">
                <h3>Feedback</h3>
                <p>{gradeResult.feedback}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ---------- SAVED RUBRIC MODAL ---------- */}
{showRubricModal && (
  <div
    className="eg-modal-overlay"
    onClick={() => setShowRubricModal(false)}
  >
    <div
      className="eg-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="eg-modal-header">
        <h2>Rubric Library</h2>

        <div className="eg-modal-view-toggle">
          <button
            className={`eg-view-icon ${
              rubricView === "list" ? "active" : ""
            }`}
            onClick={() => setRubricView("list")}
            aria-label="List view"
          >
            {/* List icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1" />
              <circle cx="3" cy="12" r="1" />
              <circle cx="3" cy="18" r="1" />
            </svg>
          </button>

          <button
            className={`eg-view-icon ${
              rubricView === "grid" ? "active" : ""
            }`}
            onClick={() => setRubricView("grid")}
            aria-label="Grid view"
          >
            {/* Grid icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        className="eg-input"
        placeholder="Search rubrics…"
        value={rubricSearch}
        onChange={(e) => setRubricSearch(e.target.value)}
        style={{ margin: "0 0 27px" }}
      />

      {/* Content */}
      {filteredRubrics.length === 0 ? (
        <p className="eg-muted-text">No matching rubrics.</p>
      ) : rubricView === "list" ? (
        <div className="eg-saved-list">
          {filteredRubrics.map((r) => (
            <div
              key={r.id}
              className="eg-saved-list-item"
              onClick={() => handleChooseRubric(r)}
            >
              {r.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="eg-saved-grid">
          {filteredRubrics.map((r) => (
            <div
              key={r.id}
              className="eg-saved-grid-item"
              onClick={() => handleChooseRubric(r)}
            >
              {r.title}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="eg-modal-footer">
        <button
          className="eg-link-button"
          onClick={() => setShowRubricModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

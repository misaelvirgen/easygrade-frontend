import React, { useEffect, useMemo, useState } from "react";
import MainNav from "@/components/MainNav";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { generateRubric } from "@/services/apiService";

/* ---------- PRESETS ---------- */

const GRADE_LEVELS = [
  "Kindergarten",
  "1st–6th Grade",
  "7th–8th Grade",
  "9th–12th Grade",
  "College",
];

const SUBJECTS = [
  "ELA",
  "History / Social Studies",
  "Science",
  "Math",
  "World Languages",
  "Arts",
  "Other",
];

const TASK_TYPES = [
  "Essay",
  "Presentation",
  "Research Project",
  "Lab Report",
  "Creative Writing",
  "Discussion / Reflection",
  "Other",
];

const CRITERIA_OPTIONS = [
  "Thesis / Central Idea",
  "Organization & Structure",
  "Evidence & Support",
  "Analysis / Reasoning",
  "Research Quality",
  "Accuracy",
  "Writing Mechanics",
  "Creativity",
  "Presentation / Visuals",
  "Collaboration",
];

const RATING_SCALES = [
  {
    label: "4-Point Scale (4–3–2–1)",
    value: ["4", "3", "2", "1"],
  },
  {
    label: "Performance Levels",
    value: ["Exemplary", "Proficient", "Developing", "Beginning"],
  },
  {
    label: "Standards-Based",
    value: ["Exceeds", "Meets", "Approaching", "Below"],
  },
];

/* ---------- HELPERS ---------- */

function normalizeCriteria(criteria, scaleLabels) {
  // Ensures every criterion has all scale keys.
  return (criteria || []).map((c) => {
    const levels = { ...(c.levels || {}) };
    scaleLabels.forEach((k) => {
      if (typeof levels[k] !== "string") levels[k] = "";
    });
    return { name: c.name || "", levels };
  });
}

function rubricToMultilineText(title, gradeLevel, subject, taskType, scaleLabels, criteria) {
  const lines = [];
  if (title) lines.push(`RUBRIC: ${title}`);
  if (gradeLevel) lines.push(`GRADE LEVEL: ${gradeLevel}`);
  if (subject) lines.push(`SUBJECT: ${subject}`);
  if (taskType) lines.push(`TASK TYPE: ${taskType}`);
  lines.push("");
  criteria.forEach((c) => {
    lines.push(`CRITERION: ${c.name}`);
    scaleLabels.forEach((k) => {
      lines.push(`${k}: ${c.levels?.[k] || ""}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}

/* ---------- COMPONENT ---------- */

export default function RubricBuilder() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  /* ---------- STATE ---------- */

  const [rubricTitle, setRubricTitle] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [taskType, setTaskType] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [scaleKey, setScaleKey] = useState(RATING_SCALES[0].label);

  // NEW: source-of-truth rubric structure
  const [rubricCriteria, setRubricCriteria] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const isPremium = profile?.is_premium === true;

  const scaleLabels = useMemo(() => {
    const found = RATING_SCALES.find((s) => s.label === scaleKey);
    return found ? found.value : RATING_SCALES[0].value;
  }, [scaleKey]);

  /* ---------- AUTH GATING (PRO ONLY) ---------- */

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (profile && profile.is_premium === false) {
      router.replace("/upgrade");
    }
  }, [loading, user, profile, router]);

  /* ---------- LOAD FOR EDIT ---------- */
  useEffect(() => {
    if (!router.isReady) return;
    if (!profile || profile.is_premium === false) return;

    const editId = router.query.edit;
    if (!editId) return;

    try {
      const raw = window.localStorage.getItem("easygrade_custom_rubrics");
      const existing = raw ? JSON.parse(raw) : [];
      const found = existing.find((r) => String(r.id) === String(editId));

      if (found) {
        setEditingId(found.id);
        setRubricTitle(found.title || "");
        setGradeLevel(found.gradeLevel || "");
        setSubject(found.subject || "");
        setTaskType(found.taskType || "");
        setSelectedCriteria(found.selectedCriteria || []);

        // If older rubrics stored text only, attempt to keep editable empty state.
        if (Array.isArray(found.criteria)) {
          setRubricCriteria(normalizeCriteria(found.criteria, scaleLabels));
        } else {
          setRubricCriteria([]);
        }
      }
    } catch (e) {
      console.error("Failed to load rubric for editing", e);
    }
    // NOTE: We intentionally do NOT include scaleLabels here to avoid re-normalizing mid-load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.edit, profile]);

  /* ---------- EARLY RETURNS ---------- */
  if (loading || !user || !profile) {
    return (
      <div className="eg-root">
        <div className="eg-shell">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isPremium) return null;

  /* ---------- HELPERS ---------- */

  const toggleCriterion = (criterion) => {
    setSelectedCriteria((prev) =>
      prev.includes(criterion)
        ? prev.filter((c) => c !== criterion)
        : [...prev, criterion]
    );
  };

  const ensureCriteriaFromSelected = () => {
    // If user selected criteria but rubricCriteria is empty, initialize table rows.
    if (!selectedCriteria.length) return;

    setRubricCriteria((prev) => {
      const byName = new Map(prev.map((c) => [c.name, c]));
      const next = selectedCriteria.map((name) => {
        const existing = byName.get(name);
        if (existing) return normalizeCriteria([existing], scaleLabels)[0];
        const levels = {};
        scaleLabels.forEach((k) => (levels[k] = ""));
        return { name, levels };
      });
      return next;
    });
  };

  /* ---------- ACTIONS ---------- */

  const handleGenerateRubric = async () => {
    if (!rubricTitle || !gradeLevel || !subject || !taskType) {
      setErrorMsg("Please complete all required settings.");
      return;
    }
    if (selectedCriteria.length === 0) {
      setErrorMsg("Select at least one criterion.");
      return;
    }

    setErrorMsg("");
    setSaveStatus("");
    setGenerating(true);

    try {
      // IMPORTANT: This assumes your backend now supports the richer payload.
      // If it doesn't yet, we can update backend in Step 2/3 accordingly.
      const result = await generateRubric({
        title: rubricTitle,
        gradeLevel,
        subject,
        taskType,
        criteria: selectedCriteria,
        scale: scaleLabels, // send labels so AI uses them
      });

      const incoming = result?.criteria || [];
      setRubricCriteria(normalizeCriteria(incoming, scaleLabels));
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to generate rubric.");
    } finally {
      setGenerating(false);
    }
  };

  const updateCriterionName = (idx, value) => {
    setRubricCriteria((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], name: value };
      return next;
    });
  };

  const updateCell = (idx, levelKey, value) => {
    setRubricCriteria((prev) => {
      const next = [...prev];
      const row = next[idx];
      next[idx] = {
        ...row,
        levels: { ...(row.levels || {}), [levelKey]: value },
      };
      return next;
    });
  };

  const addCriterionRow = () => {
    setRubricCriteria((prev) => {
      const levels = {};
      scaleLabels.forEach((k) => (levels[k] = ""));
      return [...prev, { name: "New Criterion", levels }];
    });
  };

  const removeCriterionRow = (idx) => {
    setRubricCriteria((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveRubric = () => {
    if (!rubricCriteria.length) {
      setErrorMsg("Generate a rubric (or add criteria) before saving.");
      return;
    }

    try {
      const storageKey = "easygrade_custom_rubrics";
      const raw = window.localStorage.getItem(storageKey);
      const existing = raw ? JSON.parse(raw) : [];

      const newRubric = {
        id: editingId || Date.now(),
        title: rubricTitle || "Untitled Rubric",
        gradeLevel,
        subject,
        taskType,
        selectedCriteria,
        scaleKey,          // store selection label for later
        scaleLabels,       // store actual labels too (safe)
        criteria: rubricCriteria,
        updatedAt: new Date().toISOString(),
      };

      const updated = editingId
        ? existing.map((r) => (r.id === editingId ? newRubric : r))
        : [...existing, newRubric];

      window.localStorage.setItem(storageKey, JSON.stringify(updated));
      setSaveStatus(editingId ? "Rubric updated." : "Rubric saved.");
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to save rubric.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!rubricCriteria.length) {
      setErrorMsg("Generate a rubric (or add criteria) before downloading.");
      return;
    }

    setErrorMsg("");
    setSaveStatus("");

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "letter",
      });

      const left = 40;
      const top = 40;

      doc.setFontSize(14);
      doc.text(`EASYGRADE — ${rubricTitle || "Rubric"}`, left, top);

      doc.setFontSize(10);
      doc.text(
        `Grade: ${gradeLevel || "-"} | Subject: ${subject || "-"} | Task: ${taskType || "-"}`,
        left,
        top + 18
      );

      // Convert table to multiline for now (Step 4 can do true table PDF)
      const text = rubricToMultilineText(
        rubricTitle,
        gradeLevel,
        subject,
        taskType,
        scaleLabels,
        rubricCriteria
      );

      doc.setFontSize(10);
      const maxWidth = 740;
      const lines = doc.splitTextToSize(text, maxWidth);
      let y = top + 50;

      lines.forEach((line) => {
        if (y > 540) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, left, y);
        y += 14;
      });

      const safeTitle =
        (rubricTitle || "rubric").replace(/[^\w\-]+/g, "_") + ".pdf";
      doc.save(safeTitle);
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to generate PDF.");
    }
  };

  const handleClear = () => {
    setRubricTitle("");
    setGradeLevel("");
    setSubject("");
    setTaskType("");
    setSelectedCriteria([]);
    setScaleKey(RATING_SCALES[0].label);
    setRubricCriteria([]);
    setEditingId(null);
    setSaveStatus("");
    setErrorMsg("");
    router.replace("/rubric-builder", undefined, { shallow: true });
  };

  /* ---------- UI ---------- */

  return (
    <div className="eg-root">
      <div className="eg-shell">
        <MainNav />

        <section className="eg-builder-header">
          <h1 className="eg-page-title">Rubric Builder</h1>
          <p className="eg-page-subtitle">
            Select settings — EasyGrade builds the rubric grid.
          </p>

          {errorMsg && <p className="eg-error-banner">{errorMsg}</p>}
          {saveStatus && <p className="eg-success-banner">{saveStatus}</p>}
        </section>

        <main className="eg-builder-main">
          {/* SETTINGS */}
          <section className="eg-card">
            <h2 className="eg-card-title">Rubric Settings</h2>

            <label className="eg-label">Rubric Title</label>
            <input
              className="eg-input"
              value={rubricTitle}
              onChange={(e) => setRubricTitle(e.target.value)}
              placeholder="e.g. WWII Research Presentation"
            />

            <label className="eg-label">Grade Level</label>
            <select
              className="eg-input"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            >
              <option value="">Select grade level…</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <label className="eg-label">Subject</label>
            <select
              className="eg-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select subject…</option>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <label className="eg-label">Task Type</label>
            <select
              className="eg-input"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value="">Select task type…</option>
              {TASK_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="eg-label">Criteria</label>

<div className="eg-criteria-list">
  {CRITERIA_OPTIONS.map((c) => (
    <label key={c} className="eg-checkbox-row">
      <input
        type="checkbox"
        checked={selectedCriteria.includes(c)}
        onChange={() => toggleCriterion(c)}
      />
      <span>{c}</span>
    </label>
  ))}
</div>

<p className="eg-muted-text" style={{ marginTop: 6 }}>
  Selected: {selectedCriteria.length}
</p>


            <label className="eg-label">Rating Scale</label>
            <select
              className="eg-input"
              value={scaleKey}
              onChange={(e) => {
                setScaleKey(e.target.value);
                // re-normalize existing table to include these keys
                setRubricCriteria((prev) => normalizeCriteria(prev, RATING_SCALES.find(s=>s.label===e.target.value)?.value || scaleLabels));
              }}
            >
              {RATING_SCALES.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              className="eg-secondary-button"
              onClick={() => {
                ensureCriteriaFromSelected();
                handleGenerateRubric();
              }}
              disabled={generating}
            >
              {generating ? "Generating…" : "Generate Rubric"}
            </button>

            <button
              className="eg-link-button"
              type="button"
              onClick={ensureCriteriaFromSelected}
              style={{ marginTop: 8 }}
            >
              Build table from selected criteria
            </button>
          </section>

          {/* OUTPUT */}
          <section className="eg-card">
            <h2 className="eg-card-title">Rubric (Editable)</h2>

            {!rubricCriteria.length ? (
              <p className="eg-muted-text">
                Generate a rubric to see the rubric grid here.
              </p>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #e5e7eb", minWidth: 180 }}>
                          Criteria
                        </th>
                        {scaleLabels.map((k) => (
                          <th key={k} style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #e5e7eb", minWidth: 220 }}>
                            {k}
                          </th>
                        ))}
                        <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 60 }} />
                      </tr>
                    </thead>

                    <tbody>
                      {rubricCriteria.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: 10, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                            <input
                              className="eg-input"
                              value={row.name}
                              onChange={(e) => updateCriterionName(idx, e.target.value)}
                              style={{ width: "100%" }}
                            />
                          </td>

                          {scaleLabels.map((k) => (
                            <td key={k} style={{ padding: 10, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                              <textarea
                                className="eg-textarea"
                                rows={4}
                                value={row.levels?.[k] || ""}
                                onChange={(e) => updateCell(idx, k, e.target.value)}
                                style={{ minHeight: 90 }}
                              />
                            </td>
                          ))}

                          <td style={{ padding: 10, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>
                            <button
                              type="button"
                              className="eg-link-button"
                              onClick={() => removeCriterionRow(idx)}
                              style={{ color: "#dc2626" }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="eg-builder-actions" style={{ marginTop: 12 }}>
                  <button className="eg-secondary-button" type="button" onClick={addCriterionRow}>
                    Add Criterion
                  </button>

                  <button className="eg-secondary-button" onClick={handleSaveRubric}>
                    {editingId ? "Update Rubric" : "Save Rubric"}
                  </button>

                  <button className="eg-secondary-button" onClick={handleDownloadPdf}>
                    Download PDF
                  </button>

                  <button className="eg-link-button" onClick={handleClear}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

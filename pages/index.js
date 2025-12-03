import React, { useState } from 'react';
import { gradeAssignment, uploadPdf } from '../services/apiService';

export default function Home() {
  const [essayText, setEssayText] = useState('');
  const [rubricText, setRubricText] = useState('');
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = () => {
    alert('Google login coming soon');
  };

  const handleCanvasToken = () => {
    const token = typeof window !== 'undefined'
      ? window.prompt('Enter Canvas API Token:')
      : null;
    if (token) {
      localStorage.setItem('canvas_token', token);
      alert('Canvas token saved!');
    }
  };

  const handleGrade = async () => {
    if (!essayText.trim()) {
      setErrorMsg('Please paste or extract an essay before grading.');
      return;
    }
    setErrorMsg('');
    setGrading(true);
    setGradeResult(null);

    try {
      const data = await gradeAssignment(essayText, rubricText);
      setGradeResult(data);
    } catch (err) {
      console.error('Grade error:', err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Something went wrong while grading.';
      setErrorMsg(msg);
    } finally {
      setGrading(false);
    }
  };

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
    setErrorMsg('');
  };

  const handlePdfExtract = async () => {
    if (!pdfFile) {
      setErrorMsg('Please choose a PDF file first.');
      return;
    }
    setPdfLoading(true);
    setErrorMsg('');

    try {
      const data = await uploadPdf(pdfFile);
      const text = data?.text || '';
      if (!text) {
        setErrorMsg('No text could be extracted from this PDF.');
      } else {
        setEssayText(text);
        setGradeResult(null);
      }
    } catch (err) {
      console.error('PDF extract error:', err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Something went wrong while processing the PDF.';
      setErrorMsg(msg);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* SIDEBAR – playful EdTech style */}
      <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-indigo-300/30">
          <div className="h-10 w-10 rounded-2xl bg-white/90 flex items-center justify-center shadow-md overflow-hidden">
            <img
              src="/EasyGradeLogo.png"
              alt="EasyGrade Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">EasyGrade</p>
            <p className="text-xs text-indigo-100">Grading made easy</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-widest text-indigo-100/80 mb-1">
            Workspace
          </p>

          {/* Active item */}
          <button className="w-full flex items-center justify-between rounded-2xl px-3 py-2.5 bg-white/15 text-white font-semibold shadow-sm">
            <span>Grade Essay</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </button>

          {/* Other items (non-functional for now) */}
          <button className="w-full text-left rounded-2xl px-3 py-2.5 hover:bg-white/10 transition">
            Upload PDF
          </button>
          <button className="w-full text-left rounded-2xl px-3 py-2.5 hover:bg-white/10 transition">
            Saved Grades
          </button>
          <button className="w-full text-left rounded-2xl px-3 py-2.5 hover:bg-white/10 transition">
            Rubric Builder
          </button>
          <button className="w-full text-left rounded-2xl px-3 py-2.5 hover:bg-white/10 transition">
            Export &amp; Reports
          </button>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-widest text-indigo-100/80 mb-2">
              Integrations
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full mb-2 rounded-2xl bg-white text-indigo-700 text-xs font-semibold px-3 py-2 shadow hover:bg-indigo-50 transition flex items-center justify-between"
            >
              <span>Login with Google</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </button>
            <button
              onClick={handleCanvasToken}
              className="w-full rounded-2xl bg-indigo-400/60 text-white text-xs font-semibold px-3 py-2 shadow hover:bg-indigo-400 transition flex items-center justify-between"
            >
              <span>Connect Canvas</span>
              <span className="h-2 w-2 rounded-full bg-sky-300" />
            </button>
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-indigo-300/30 text-xs text-indigo-100">
          <p className="font-semibold">Teacher Mode</p>
          <p>Signed in locally</p>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HERO HEADER */}
        <section className="w-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-sky-400 text-white shadow-md">
          {/* Mobile top bar (since sidebar is hidden on small screens) */}
          <div className="flex md:hidden items-center justify-between px-4 py-3 bg-indigo-900/20">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden">
                <img
                  src="/EasyGradeLogo.png"
                  alt="EasyGrade Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-lg font-semibold">EasyGrade</span>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-indigo-700 shadow"
            >
              Login
            </button>
          </div>

          <div className="px-5 md:px-10 py-7 md:py-10 flex flex-col md:flex-row items-center md:items-start gap-8 max-w-6xl mx-auto">
            {/* Hero text */}
            <div className="flex-1 space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-sm">
                Playful, instant grading for real classrooms.
              </h1>
              <p className="text-sm md:text-base text-indigo-50 max-w-xl">
                Upload essays, extract text from PDFs, paste your own rubric, and
                get structured AI feedback in seconds. Spend less time grading and
                more time teaching.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleGrade}
                  className="px-5 py-2.5 rounded-full bg-white text-indigo-700 text-sm font-semibold shadow-md hover:bg-indigo-50 active:scale-[0.98] transition"
                >
                  Grade current essay
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('pdf-input');
                    if (input) input.click();
                  }}
                  className="px-5 py-2.5 rounded-full border border-white/70 bg-white/10 text-sm font-semibold text-white shadow hover:bg-white/15 active:scale-[0.98] transition"
                >
                  Upload PDF
                </button>
              </div>

              {errorMsg && (
                <div className="mt-2 rounded-2xl bg-indigo-900/30 border border-indigo-200/40 px-4 py-2 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Hero image card */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
                <div className="relative bg-white/15 rounded-3xl p-4 border border-white/40 shadow-2xl flex items-center justify-center">
                  <img
                    src="/EasyGradeLogo.png"
                    alt="EasyGrade Hero"
                    className="max-h-40 md:max-h-56 object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* LEFT COLUMN: Essay & Rubric */}
            <div className="space-y-4 md:space-y-6">
              {/* Essay card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Student Essay
                  </h2>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Step 1
                  </span>
                </div>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={10}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 p-3 md:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-inner"
                  placeholder="Paste an essay here, or extract text from a PDF on the right."
                />
              </div>

              {/* Rubric card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Rubric (optional)
                  </h2>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Optional
                  </span>
                </div>
                <textarea
                  value={rubricText}
                  onChange={(e) => setRubricText(e.target.value)}
                  rows={7}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 p-3 md:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-inner"
                  placeholder="Paste your rubric here (JSON, bullet points, or plain text)."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGrade}
                  disabled={grading}
                  className={`px-5 md:px-7 py-2.5 rounded-full text-sm font-semibold shadow-md transition
                    ${
                      grading
                        ? 'bg-indigo-300 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                    }`}
                >
                  {grading ? 'Grading…' : 'Grade Essay'}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: PDF Upload & Results */}
            <div className="space-y-4 md:space-y-6">
              {/* PDF upload card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Upload a PDF
                  </h2>
                  <span className="text-[11px] uppercase tracking-wide text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-500 mb-3">
                  Upload a PDF that contains a student essay. EasyGrade will extract
                  the text and place it into the essay box on the left.
                </p>

                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed 
                             border-slate-300 rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 
                             transition text-slate-600 text-sm"
                >
                  <span className="font-semibold mb-1">
                    Click to choose a PDF
                  </span>
                  <span className="text-xs text-slate-400">
                    or drag &amp; drop your file here
                  </span>
                  <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfSelect}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handlePdfExtract}
                  disabled={pdfLoading || !pdfFile}
                  className={`mt-4 w-full px-4 py-2.5 rounded-full text-sm font-semibold shadow-md transition
                    ${
                      pdfLoading || !pdfFile
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-[0.98]'
                    }`}
                >
                  {pdfLoading ? 'Extracting text…' : 'Extract Text from PDF'}
                </button>

                {pdfFile && (
                  <p className="mt-2 text-xs text-slate-500 truncate">
                    Selected file: <span className="font-medium">{pdfFile.name}</span>
                  </p>
                )}
              </div>

              {/* Grading result card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/70 p-5 md:p-6 min-h-[180px]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Grading Result
                  </h2>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    Step 3
                  </span>
                </div>

                {!gradeResult && !grading && (
                  <p className="text-sm text-slate-500">
                    After grading, the score and feedback will appear here.
                  </p>
                )}

                {grading && (
                  <p className="text-sm text-slate-500 animate-pulse">
                    Contacting the grading engine…
                  </p>
                )}

                {gradeResult && (
                  <div className="space-y-3 text-sm text-slate-800">
                    {typeof gradeResult.score !== 'undefined' && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-3 py-2">
                        <p className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">
                          Score
                        </p>
                        <p className="text-2xl font-bold text-indigo-800 mt-1">
                          {gradeResult.score}
                        </p>
                      </div>
                    )}

                    {gradeResult.feedback && (
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Feedback
                        </p>
                        <p className="leading-relaxed text-sm">
                          {gradeResult.feedback}
                        </p>
                      </div>
                    )}

                    {Array.isArray(gradeResult.strengths) && (
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                          Strengths
                        </p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {gradeResult.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(gradeResult.weaknesses) && (
                      <div>
                        <p className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide mb-1">
                          Weaknesses
                        </p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {gradeResult.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

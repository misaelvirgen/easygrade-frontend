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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 py-10">
      {/* MAIN APP CARD */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* TOP NAV INSIDE CARD */}
        <nav className="w-full px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <img
              src="/EasyGradeLogo.png"
              alt="EasyGrade Logo"
              className="w-12 h-auto object-contain"
            />
            <span className="text-xl font-bold text-gray-800">EasyGrade</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <button
              className="bg-transparent border-0 text-gray-600 hover:text-indigo-600"
              style={{ border: "none" }}
            >
              Grade Essay
            </button>
            <button
              className="bg-transparent border-0 text-gray-600 hover:text-indigo-600"
              style={{ border: "none" }}
            >
              Upload PDF
            </button>
            <button
              className="bg-transparent border-0 text-gray-600 hover:text-indigo-600"
              style={{ border: "none" }}
            >
              Rubric Builder
            </button>
            <button
              className="bg-transparent border-0 text-gray-600 hover:text-indigo-600"
              style={{ border: "none" }}
            >
              Reports
            </button>

            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 shadow-sm">
              Login
            </button>
          </div>
        </nav>

        {/* HERO + CONTENT */}
        <div className="px-8 py-10 lg:px-12 lg:py-12 space-y-10">
          {/* HERO SECTION */}
          <header className="flex flex-col items-center text-center space-y-6">
            <img
              src="/EasyGradeLogo.png"
              alt="EasyGrade Hero Logo"
              className="w-[500px] max-w-full h-auto drop-shadow-md"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Grade Essays Instantly.
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              Upload student work, apply custom rubrics, and get high-quality AI
              feedback in seconds. Perfect for busy teachers and real classrooms.
            </p>
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-full">
                {errorMsg}
              </div>
            )}
          </header>

          {/* MAIN GRID */}
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* LEFT COLUMN: ESSAY + RUBRIC + BUTTON */}
            <div className="space-y-8">
              {/* ESSAY */}
              <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-7">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Student Essay
                </h3>
                <textarea
                  rows={10}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Paste essay text here…"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
                />
              </section>

              {/* RUBRIC */}
              <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-7">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Rubric (Optional)
                </h3>
                <textarea
                  rows={6}
                  value={rubricText}
                  onChange={(e) => setRubricText(e.target.value)}
                  placeholder="Paste rubric here…"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base"
                />
              </section>

              {/* GRADE BUTTON */}
              <button
                onClick={handleGrade}
                disabled={grading}
                className="w-full px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {grading ? "Grading…" : "Grade Essay"}
              </button>
            </div>

            {/* RIGHT COLUMN: PDF + RESULTS */}
            <div className="space-y-8">
              {/* PDF UPLOAD */}
              <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-7">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Upload PDF
                </h3>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-700"
                />

                <button
                  onClick={handlePdfExtract}
                  disabled={!pdfFile || pdfLoading}
                  className="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-full text-sm font-semibold hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {pdfLoading ? "Extracting…" : "Extract Text"}
                </button>

                {pdfFile && (
                  <p className="mt-2 text-xs text-gray-500 truncate">
                    {pdfFile.name}
                  </p>
                )}
              </section>

              {/* RESULTS */}
              <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-7 min-h-[200px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Grading Results
                </h3>

                {!gradeResult && (
                  <p className="text-sm text-gray-500">
                    Results will appear here after grading.
                  </p>
                )}

                {gradeResult && (
                  <div className="space-y-5 text-sm md:text-base">
                    {typeof gradeResult.score !== "undefined" && (
                      <p className="text-3xl font-bold text-indigo-600">
                        Score: {gradeResult.score}
                      </p>
                    )}

                    {gradeResult.feedback && (
                      <div>
                        <h4 className="font-semibold mb-1">Feedback</h4>
                        <p className="text-gray-700">{gradeResult.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

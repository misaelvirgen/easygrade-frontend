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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">

      {/* TOP NAV */}
      <nav className="w-full bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/EasyGradeLogo.png"
            alt="EasyGrade Logo"
            className="w-10 h-auto object-contain"
          />
          <h1 className="text-xl font-bold text-gray-800">EasyGrade</h1>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <button className="hover:text-indigo-600">Grade Essay</button>
          <button className="hover:text-indigo-600">Upload PDF</button>
          <button className="hover:text-indigo-600">Rubric Builder</button>
          <button className="hover:text-indigo-600">Reports</button>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700">
            Login
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-5xl mx-auto text-center mt-16 px-6">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/EasyGradeLogo.png"
            alt="EasyGrade Logo Large"
            className="w-[250px] h-auto drop-shadow-md"
          />
          <h2 className="text-4xl font-bold text-gray-900">
            Grade Essays Instantly.
          </h2>
          <p className="text-lg text-gray-600 max-w-xl">
            Upload student work, apply custom rubrics, and get high-quality AI feedback in seconds.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-6xl mx-auto px-6 mt-16 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT — ESSAY + RUBRIC */}
        <div className="space-y-10">

          {/* STUDENT ESSAY */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Student Essay
            </h3>
            <textarea
              rows={10}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Paste essay text here..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* RUBRIC */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Rubric (Optional)
            </h3>
            <textarea
              rows={6}
              value={rubricText}
              onChange={(e) => setRubricText(e.target.value)}
              placeholder="Paste rubric here..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* GRADE BUTTON */}
          <button
            onClick={handleGrade}
            disabled={grading}
            className="w-full px-6 py-4 text-lg bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700"
          >
            {grading ? "Grading…" : "Grade Essay"}
          </button>
        </div>

        {/* RIGHT — PDF + RESULTS */}
        <div className="space-y-10">

          {/* PDF UPLOAD */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Upload PDF
            </h3>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full mb-4 text-sm"
            />

            <button
              onClick={handlePdfExtract}
              disabled={!pdfFile || pdfLoading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600"
            >
              {pdfLoading ? "Extracting..." : "Extract Text"}
            </button>

            {pdfFile && (
              <p className="text-xs text-gray-500 mt-2">{pdfFile.name}</p>
            )}
          </div>

          {/* RESULTS */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 min-h-[200px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Grading Results
            </h3>

            {!gradeResult && (
              <p className="text-gray-500 text-sm">Results will appear here after grading.</p>
            )}

            {gradeResult && (
              <div className="space-y-6">
                {gradeResult.score && (
                  <p className="text-3xl font-bold text-indigo-600">
                    Score: {gradeResult.score}
                  </p>
                )}

                {gradeResult.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback</h4>
                    <p className="text-gray-700">{gradeResult.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

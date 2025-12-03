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
      setErrorMsg(err?.message || 'Something went wrong while grading.');
    } finally {
      setGrading(false);
    }
  };

  const handlePdfSelect = (e) => {
    setPdfFile(e.target.files?.[0] || null);
  };

  const handlePdfExtract = async () => {
    if (!pdfFile) return;

    setPdfLoading(true);
    setErrorMsg('');

    try {
      const data = await uploadPdf(pdfFile);
      setEssayText(data?.text || '');
    } catch (err) {
      setErrorMsg('Failed to extract text from PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-60 flex-col bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <img src="/EasyGradeLogo.png" className="w-10 h-auto" />
          <h1 className="text-xl font-bold">EasyGrade</h1>
        </div>

        <nav className="flex flex-col space-y-3 text-gray-700">
          <button className="text-left font-medium">Grade Essay</button>
          <button className="text-left text-gray-500 hover:text-gray-700">
            Upload PDF
          </button>
          <button className="text-left text-gray-500 hover:text-gray-700">
            Saved Grades
          </button>
          <button className="text-left text-gray-500 hover:text-gray-700">
            Rubric Builder
          </button>
          <button className="text-left text-gray-500 hover:text-gray-700">
            Reports
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* HERO */}
        <section className="flex items-center justify-between bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to EasyGrade</h2>
            <p className="text-gray-600 mt-1">
              Upload essays, apply rubrics, and grade instantly.
            </p>
          </div>

<img
  src="/EasyGradeLogo.png"
  alt="EasyGrade Logo"
  className="w-16 h-16 object-contain"
  style={{ maxWidth: "64px", maxHeight: "64px" }}
/>

        </section>

        {/* LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

          {/* LEFT SIDE — ESSAY + RUBRIC */}
          <div className="space-y-8">

            {/* ESSAY */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Student Essay</h3>
              <textarea
                rows={10}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste essay text here..."
              />
            </div>

            {/* RUBRIC */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Rubric (Optional)</h3>
              <textarea
                rows={6}
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste rubric here..."
              />
            </div>

            <button
              onClick={handleGrade}
              disabled={grading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700"
            >
              {grading ? 'Grading…' : 'Grade Essay'}
            </button>
          </div>

          {/* RIGHT SIDE — PDF + RESULT */}
          <div className="space-y-8">

            {/* PDF UPLOAD */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Upload PDF</h3>

              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfSelect}
                className="w-full text-sm text-gray-600"
              />

              <button
                onClick={handlePdfExtract}
                disabled={!pdfFile || pdfLoading}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
              >
                {pdfLoading ? 'Extracting...' : 'Extract Text'}
              </button>

              {pdfFile && (
                <p className="text-xs text-gray-500 mt-2">{pdfFile.name}</p>
              )}
            </div>

            {/* RESULTS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[200px]">
              <h3 className="text-lg font-semibold mb-4">Grading Result</h3>

              {!gradeResult && (
                <p className="text-gray-500 text-sm">
                  Results will appear here after grading.
                </p>
              )}

              {gradeResult && (
                <div className="space-y-4">
                  {gradeResult.score && (
                    <p className="text-2xl font-bold text-indigo-600">
                      Score: {gradeResult.score}
                    </p>
                  )}

                  {gradeResult.feedback && (
                    <div>
                      <h4 className="font-semibold mb-1">Feedback</h4>
                      <p className="text-sm">{gradeResult.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

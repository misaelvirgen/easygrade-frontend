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
    const token = prompt('Enter Canvas API Token:');
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
      // data shape depends on backend; we’ll handle common keys
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
    const file = e.target.files?.[0];
    setPdfFile(file || null);
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
        // 👇 This is the key: fill the essay box with extracted text
        setEssayText(text);
        setGradeResult(null); // reset last grade
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            EasyGrade
          </h1>
          <p className="text-gray-600">Grading Made Easy</p>
        </header>

        {/* Top actions: login + LMS */}
        <section className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Login with Google
          </button>
          <button
            onClick={handleCanvasToken}
            className="bg-green-600 text-white px-6 py-2 rounded-full"
          >
            Connect Canvas
          </button>
        </section>

        {/* Error banner */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Main layout: left = essay + rubric, right = PDF upload + result */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left column: essay & rubric */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Student Essay
              </label>
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                rows={10}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste an essay here or extract from a PDF on the right."
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Rubric (optional)
              </label>
              <textarea
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                rows={6}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your rubric here (JSON, bullet points, or plain text)."
              />
            </div>

            <button
              onClick={handleGrade}
              disabled={grading}
              className={`w-full md:w-auto px-6 py-2.5 rounded-full text-white font-semibold
                ${grading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {grading ? 'Grading…' : 'Grade Essay'}
            </button>
          </div>

          {/* Right column: PDF upload + results */}
          <div className="space-y-4">
            {/* PDF upload card */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Upload a PDF
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Upload a PDF with a student essay. We’ll extract the text and place it in the essay box.
              </p>

              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfSelect}
                className="block w-full text-sm text-gray-700
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100"
              />

              <button
                onClick={handlePdfExtract}
                disabled={pdfLoading || !pdfFile}
                className={`mt-3 w-full md:w-auto px-4 py-2 rounded-full text-white text-sm font-semibold
                  ${pdfLoading || !pdfFile
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {pdfLoading ? 'Extracting from PDF…' : 'Extract Text from PDF'}
              </button>
            </div>

            {/* Grading result */}
            <div className="bg-white rounded-2xl shadow p-4 min-h-[150px]">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Grading Result
              </h2>

              {!gradeResult && !grading && (
                <p className="text-xs text-gray-500">
                  After grading, the score and feedback will appear here.
                </p>
              )}

              {grading && (
                <p className="text-xs text-gray-500">
                  Contacting the grading engine…
                </p>
              )}

              {gradeResult && (
                <div className="space-y-2 text-sm text-gray-800">
                  {typeof gradeResult.score !== 'undefined' && (
                    <p>
                      <span className="font-semibold">Score:</span>{' '}
                      {gradeResult.score}
                    </p>
                  )}
                  {gradeResult.feedback && (
                    <p>
                      <span className="font-semibold">Feedback:</span>{' '}
                      {gradeResult.feedback}
                    </p>
                  )}
                  {Array.isArray(gradeResult.strengths) && (
                    <div>
                      <p className="font-semibold">Strengths:</p>
                      <ul className="list-disc list-inside text-xs">
                        {gradeResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(gradeResult.weaknesses) && (
                    <div>
                      <p className="font-semibold">Weaknesses:</p>
                      <ul className="list-disc list-inside text-xs">
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
        </main>
      </div>
    </div>
  );
}

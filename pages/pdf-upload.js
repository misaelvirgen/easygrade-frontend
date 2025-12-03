import React, { useState } from 'react';
import { uploadPdf } from '../services/apiService';

export default function PdfUploadPage() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setExtractedText('');
    setErrorMsg('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setExtractedText('');

      const data = await uploadPdf(file);
      setExtractedText(data.text || '');
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to process PDF.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const preview =
    extractedText.length > 1500
      ? extractedText.slice(0, 1500) + "… (preview truncated)"
      : extractedText;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-10 items-center">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF → Text Extractor</h1>
        <p className="text-gray-600 mb-8">
          Upload a PDF containing a student essay and we’ll extract the text so you can grade it.
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          <form onSubmit={handleUpload} className="space-y-6">

            {/* File Input */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Select PDF File
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="block w-full text-gray-700 text-sm
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-white font-semibold 
              ${loading || !file
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Extracting Text…" : "Upload & Extract"}
            </button>
          </form>

          {/* Extracted Text Preview */}
          <div className="mt-8">
            <h2 className="font-semibold text-gray-900 text-lg mb-2">Extracted Text Preview</h2>

            {loading && (
              <p className="text-sm text-gray-500">Processing PDF…</p>
            )}

            {!loading && !extractedText && (
              <p className="text-sm text-gray-500">
                After extraction, the text will appear here.
              </p>
            )}

            {extractedText && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto text-gray-800 text-sm whitespace-pre-wrap">
                {preview}
              </div>
            )}

            {extractedText && (
              <p className="mt-2 text-xs text-gray-500">
                Total characters extracted:{" "}
                <span className="font-semibold">{extractedText.length}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

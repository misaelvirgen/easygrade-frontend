import React from 'react';

export default function Home() {
  const handleGoogleLogin = () => alert("Google login clicked");
  const handleCanvasToken = () => {
    const token = prompt("Enter Canvas API Token:");
    localStorage.setItem("canvas_token", token);
    alert("Canvas token saved!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">AI Grading Helper</h1>
      <button onClick={handleGoogleLogin} className="bg-blue-600 text-white px-6 py-2 rounded mb-4">
        Login with Google
      </button>
      <button onClick={handleCanvasToken} className="bg-green-600 text-white px-6 py-2 rounded">
        Connect Canvas
      </button>
    </div>
  );
}
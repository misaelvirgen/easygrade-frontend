import React, { useState } from 'react';
import { gradeAssignment } from '../services/apiService';

export default function Home() {
  const [essay, setEssay] = useState('');
  const [rubric, setRubric] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => alert("Google login (coming soon)");
  const handleCanvasToken = () => {
    const token = prompt("Enter Canvas API Token:");
    if (token) {
      localStorage.setItem("canvas_token", token);
      alert("Canvas token saved!");
    }
  };

  async function handleGrade(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    setScore(null);

    try {
      const res = await gradeAssignment(essay, rubric);
      setScore(res.score);
      setFeedback(res.feedback);
    } catch (err) {
      console.error(err);
      setFeedback("Error: " + (err.message || err.toString()));
    }

    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>Welcome to EasyGrade</h1>
        <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: 16 }}>Grading Made Easy</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={handleGoogleLogin} style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
            Login with Google (coming soon)
          </button>
          <button onClick={handleCanvasToken} style={{ background: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
            Connect Canvas
          </button>
        </div>

        <form onSubmit={handleGrade}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: 4 }}>Essay</label>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Paste student essay here..."
              rows={8}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: 4 }}>Rubric (optional)</label>
            <textarea
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              placeholder="Paste rubric or criteria here..."
              rows={4}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d1d5db' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !essay.trim()}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 6,
              border: 'none',
              cursor: loading || !essay.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !essay.trim() ? 0.6 : 1,
              marginTop: 8
            }}
          >
            {loading ? 'Grading...' : 'Grade Essay'}
          </button>
        </form>

        {(score !== null || feedback) && (
          <div style={{ marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
            {score !== null && (
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 8 }}>Score: {score}</h2>
            )}
            {feedback && (
              <>
                <h3 style={{ fontWeight: '600', marginBottom: 4 }}>Feedback</h3>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{feedback}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

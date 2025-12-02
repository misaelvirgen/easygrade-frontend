import { useState } from "react";

export default function Home() {
  const [essay, setEssay] = useState("");
  const [rubric, setRubric] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://easygrade-backend-ae2m.onrender.com/api/grade",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            essay: essay,
            rubric: rubric,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setScore(data.score);
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Error: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <h1>Welcome to EasyGrade</h1>
      <p>Grading Made Easy</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Paste student essay here..."
          rows={8}
          style={{ width: "100%", padding: "10px" }}
        />

        <textarea
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          placeholder="Paste rubric here..."
          rows={6}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Grading..." : "Grade Essay"}
        </button>
      </form>

      {score !== null && (
        <div style={{ marginTop: "20px" }}>
          <h2>Score: {score}/100</h2>
          <h3>Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

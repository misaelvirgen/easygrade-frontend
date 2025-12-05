// pages/onboarding.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Onboarding() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async () => {
    // TODO — save onboarding to Supabase "users" table
    router.push("/dashboard");
  };

  return (
    <div className="eg-root">
      <div className="eg-shell">
        <h1 className="eg-hero-title">Welcome to EasyGrade</h1>
        <p className="eg-hero-subtitle">Let's set up your teaching profile.</p>

        <div className="eg-card">
          <label className="eg-label">Your Name</label>
          <input
            className="eg-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="eg-label">Grade Level</label>
          <select
            className="eg-input"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
          >
            <option value="">Choose…</option>
            <option value="Elementary">Elementary</option>
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="College">College</option>
          </select>

          <label className="eg-label">Primary Subject</label>
          <input
            className="eg-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., English, History, Science..."
          />

          <button className="eg-primary-button" onClick={handleSubmit}>
            Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}

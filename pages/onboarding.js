// pages/onboarding.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Onboarding() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [saving, setSaving] = useState(false);

  // Prefill name from Supabase user metadata
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name);
    }
    if (profile?.name) {
      setName(profile.name);
    }
  }, [user, profile]);

  // Redirect if not logged in
  if (!loading && !user) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSaving(true);

    // Save onboarding fields into the profiles table
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        grade_level: gradeLevel,
        subject,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error("Error saving onboarding:", error);
      alert("Error saving profile.");
      return;
    }

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
            {saving ? "Saving…" : "Finish Setup"}
          </button>
        </div>
      </div>
    </div>
  );
}

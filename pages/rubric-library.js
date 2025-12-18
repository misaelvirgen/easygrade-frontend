// pages/rubric-library.js
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function RubricLibrary() {
  const { profile } = useAuth();
  const router = useRouter();

  const [rubrics, setRubrics] = useState([]);
  const [search, setSearch] = useState("");

  const isPremium = profile?.is_premium === true;

  useEffect(() => {
    const raw = window.localStorage.getItem("easygrade_custom_rubrics");
    setRubrics(raw ? JSON.parse(raw) : []);
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this rubric? This cannot be undone.");
    if (!confirmed) return;

    const updated = rubrics.filter((r) => r.id !== id);
    setRubrics(updated);
    window.localStorage.setItem(
      "easygrade_custom_rubrics",
      JSON.stringify(updated)
    );
  };

  const filteredRubrics = rubrics.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="eg-dashboard-layout">
      <Sidebar isPremium={isPremium} />

      <main className="eg-dashboard-main">
       <TopHeader
    title="Rubric Library"
    subtitle="All your saved rubrics in one place."
  />

        <input
          className="eg-input"
          placeholder="Search rubrics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360, marginTop: 16 }}
        />

        <select
  className="eg-input"
  style={{ maxWidth: 240, marginTop: 8 }}
  onChange={(e) => setSearch(e.target.value)}
>
  <option value="">All Grade Levels</option>
  <option value="Elementary">Elementary</option>
  <option value="Middle School">Middle School</option>
  <option value="High School">High School</option>
  <option value="College">College</option>
</select>


        {filteredRubrics.length === 0 ? (
          <div style={{ marginTop: 40 }}>
            <p>No rubrics found.</p>
          </div>
        ) : (
          <div style={{ marginTop: 24, maxWidth: 640 }}>
            {filteredRubrics.map((rubric) => (
              <div
                key={rubric.id}
                className="eg-action-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <button
                  onClick={() =>
                    router.push(`/rubric-builder?edit=${rubric.id}`)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  <h3>{rubric.title}</h3>
                  <p>{rubric.gradeLevel || "Unspecified grade level"}</p>
                </button>

                <button
                  onClick={() => handleDelete(rubric.id)}
                  className="eg-link-button"
                  style={{ color: "#dc2626" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

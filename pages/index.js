// pages/index.js
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAV */}
      <header
        style={{
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT: LOGO / BRAND */}
        <Link
          href="/"
          style={{
            fontSize: 24,
            fontWeight: 700,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          EasyGrade
        </Link>

        {/* RIGHT: AUTH + CTA */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login">Login</Link>

          <Link href={user ? "/grade" : "/login"}>
            <button className="eg-primary-button">
              Try it free
            </button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 760, textAlign: "center" }}>
          {/* LOGO */}
          <img
            src="/EasyGradeLogo.png"
            alt="EasyGrade logo"
            style={{
              width: 360,
              height: "auto",
              marginBottom: -70,
            }}
          />

          <h1 style={{ fontSize: 52, marginBottom: 20 }}>
            Grade essays faster.
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "#555",
              marginBottom: 36,
            }}
          >
            EasyGrade helps teachers deliver consistent,
            rubric-aligned feedback in seconds.
            Upload student work, apply your rubric,
            and save hours every week.
          </p>

          {/* PRIMARY CTA */}
          <Link href={user ? "/grade" : "/login"}>
            <button className="eg-primary-button">
              Try it free
            </button>
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          padding: "24px 40px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 14,
          color: "#666",
        }}
      >
        <div>© {new Date().getFullYear()} EasyGrade</div>

        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/support">Support</Link>
        </div>
      </footer>
    </div>
  );
}

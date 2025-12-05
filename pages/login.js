// pages/login.js
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status]);

  return (
    <div className="eg-root">
      <div className="eg-shell eg-login-shell">
        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
        </header>

        <section className="eg-hero eg-login-hero">
          <h1 className="eg-hero-title">Welcome</h1>
          <p className="eg-hero-subtitle">
            Sign in to access your saved rubrics, essays, and teaching tools.
          </p>
        </section>

        <main className="eg-login-main">
          <div className="eg-card eg-login-card">
            <h2 className="eg-card-title">Sign in</h2>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              className="eg-primary-button"
              onClick={() => signIn("google")}
            >
              Continue with Google
            </button>

            <div className="eg-login-divider"><span>or</span></div>

            {/* EMAIL LOGIN */}
            <button
              type="button"
              className="eg-secondary-button"
              onClick={() => signIn("email")}
            >
              Continue with Email
            </button>

            <p className="eg-helper-text" style={{ marginTop: 8 }}>
              A magic link will be sent to your email.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

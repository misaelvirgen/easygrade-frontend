// pages/login.js
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setError("Could not send email. Email login is not yet available.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="eg-root">
      <div className="eg-shell eg-login-shell">

        <header className="eg-header">
          <div className="eg-brand">EasyGrade</div>
        </header>

        <section className="eg-hero eg-login-hero">
          <h1 className="eg-hero-title">Welcome Back</h1>
          <p className="eg-hero-subtitle">
            Sign in to access your teacher dashboard.
          </p>
        </section>

        <main className="eg-login-main">
          <div className="eg-card eg-login-card">

            <h2 className="eg-card-title">Sign in</h2>

            {/* GOOGLE LOGIN */}
            <button
              className="eg-primary-button eg-login-btn"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Continue with Google
            </button>

            <div className="eg-login-divider"><span>or</span></div>

            {/* EMAIL SIGN-IN */}
            {sent ? (
              <p className="eg-muted-text">
                A login link was sent to <strong>{email}</strong>.  
                Check your inbox!
              </p>
            ) : (
              <>
                {/* COMING SOON MESSAGE */}
                <p className="eg-helper-text" style={{ marginBottom: "12px" }}>
                  Email sign-in (Coming soon...)
                </p>

                <form onSubmit={handleEmailLogin} className="eg-email-form">
                  <input
                    type="email"
                    placeholder="teacher@school.org"
                    className="eg-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <button type="submit" className="eg-secondary-button eg-login-btn">
                    Send Login Link
                  </button>

                  {error && <p className="eg-error-banner">{error}</p>}
                </form>
              </>
            )}

            <p className="eg-helper-text" style={{ marginTop: 16 }}>
              By continuing, you agree to our Terms & Privacy Policy.
            </p>

          </div>
        </main>

      </div>
    </div>
  );
}

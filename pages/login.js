// pages/login.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { user, signInWithGoogle, loading } = useAuth();

  // Redirect logged-in users
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (user) return null;

  return (
    <div className="login-page">

      <div className="login-card">
        
        {/* LOGO (CLICKABLE → HOME) */}
        <img
          src="/EasyGradeLogo.png"
          alt="EasyGrade Logo"
          className="login-logo"
          onClick={() => router.push("/")}
        />

        <h1 className="login-title">Welcome Back</h1>
        <p>Sign in to access your teacher dashboard</p>

        <p className="login-sub">
          Don’t have an account?{" "}
          <a className="login-link" href="#">Sign up.</a>
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <button className="login-btn google-btn" onClick={signInWithGoogle}>
          <svg className="login-icon" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 10.2v3.6h5.09c-.22 1.17-.9 2.16-1.9 2.82l3.06 2.37c1.78-1.64 2.8-4.06 2.8-6.99 0-.66-.06-1.3-.18-1.92H12z"/>
            <path fill="#34A853" d="M6.54 14.13l-3.2 2.52C5.18 19.75 8.36 21.6 12 21.6c2.43 0 4.55-.8 6.07-2.16l-3.06-2.37c-.85.57-1.94.91-3.01.91-2.3 0-4.25-1.55-4.96-3.85z"/>
            <path fill="#4A90E2" d="M3.34 9.65A9.39 9.39 0 0 0 3 12c0 .74.09 1.45.25 2.13l3.29-2.56A4.99 4.99 0 0 1 6.5 12c0-.48.07-.95.21-1.39z"/>
            <path fill="#FBBC05" d="M12 4.4c1.47 0 2.8.52 3.84 1.55L18 4.8C16.3 3.25 14.2 2.4 12 2.4c-3.64 0-6.82 1.84-8.66 4.98l3.2 2.52C6.75 6.85 8.7 5.3 11 5.3c1.07 0 2.16.34 3.01.91l1.82-1.33A9.36 9.36 0 0 0 12 4.4z"/>
          </svg>

          Login with Google
        </button>

        {/* MICROSOFT (DISABLED PLACEHOLDER) */}
        <button className="login-btn disabled-btn" disabled>
          <svg className="login-icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="8" fill="#F25022"/>
            <rect x="13" y="3" width="8" height="8" fill="#7FBA00"/>
            <rect x="3" y="13" width="8" height="8" fill="#00A4EF"/>
            <rect x="13" y="13" width="8" height="8" fill="#FFB900"/>
          </svg>

          Microsoft login coming soon…
        </button>

        {/* DIVIDER */}
        <div className="login-or"><span>or</span></div>

        {/* EMAIL FIELD (UI ONLY) */}
        <div className="login-field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" disabled />
        </div>

        {/* PASSWORD FIELD WITH FORGOT LINK */}
        <div className="login-field password-field">
          <label>Password</label>
          <a href="#" className="forgot-link">Forgot your password?</a>
        </div>

        <input type="password" placeholder="••••••••" disabled className="password-input"/>

        {/* DISABLED LOGIN BUTTON */}
        <button className="login-btn disabled-login" disabled>
          Log In (coming soon)
        </button>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff, #dbeafe);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 36px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .login-logo {
          width: 180px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .login-sub {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .login-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #d1d5db;
          background: white;
          margin-bottom: 12px;
        }

        .login-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .disabled-btn {
          background: #f3f4f6;
          border-color: #e5e7eb;
          cursor: not-allowed;
          color: #9ca3af;
        }

        .login-icon {
          width: 20px;
          height: 20px;
        }

        .login-or {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 18px 0;
        }

        .login-or::before,
        .login-or::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e5e7eb;
          margin: 0 12px;
        }

        .login-field {
          text-align: left;
          margin-bottom: 10px;
          position: relative;
        }

        .password-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-field label {
          font-size: 0.85rem;
          color: #4b5563;
        }

        .forgot-link {
          font-size: 0.8rem;
          color: #4f46e5;
          text-decoration: none;
        }

        .password-input,
        input[type="email"] {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          margin-bottom: 14px;
        }

        .disabled-login {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

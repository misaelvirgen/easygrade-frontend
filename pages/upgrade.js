// pages/upgrade.js
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PricingButtons from "../components/PricingButtons";   // FIXED IMPORT
import { getUserProfile } from "../utils/getUserProfile";   // FIXED IMPORT

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Load premium status
  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.email) return;
      const profile = await getUserProfile();
      setIsPremium(profile?.is_premium || false);
    }

    if (status === "authenticated") loadProfile();
  }, [status, session]);

  // Redirect premium users safely (inside effect, not render)
  useEffect(() => {
    if (isPremium === true) {
      router.replace("/dashboard");
    }
  }, [isPremium, router]);

  // Loading state
  if (status === "loading" || isPremium === null) {
    return (
      <div className="eg-root">
        <div className="eg-shell">
          <p>Checking your subscription…</p>
        </div>
      </div>
    );
  }

  // If redirect has been triggered, do not render content
  if (isPremium === true) return null;

  return (
    <div className="eg-root">
      <div className="eg-shell eg-upgrade-shell">
        <header className="eg-upgrade-header">
          <h1 className="eg-upgrade-title">Upgrade to EasyGrade Premium</h1>
          <p className="eg-upgrade-subtitle">
            Unlock powerful tools to save time, grade smarter, and reduce burnout.
          </p>
        </header>

        {/* Pricing Section */}
        <section className="eg-pricing-section">
          <div className="eg-pricing-card">
            <h2 className="eg-plan-title">EasyGrade Premium</h2>

            <ul className="eg-feature-list">
              <li>✔ Unlimited AI-Powered Essay Grading</li>
              <li>✔ Unlimited Rubric Builder</li>
              <li>✔ Unlimited PDF/DOCX Exports</li>
              <li>✔ Save & Reuse Rubrics</li>
              <li>✔ Faster Grading Model</li>
              <li>✔ Priority Support</li>
            </ul>

            {/* Stripe Checkout Buttons */}
            <PricingButtons />

            <p className="eg-small-note">
              Cancel anytime • Secure checkout powered by Stripe
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .eg-upgrade-shell {
          max-width: 780px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        .eg-upgrade-title {
          font-size: 2.2rem;
          font-weight: bold;
          margin-bottom: 0.4rem;
        }

        .eg-upgrade-subtitle {
          color: #666;
          margin-bottom: 2rem;
        }

        .eg-pricing-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .eg-plan-title {
          font-size: 1.6rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .eg-feature-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem auto;
          text-align: left;
          max-width: 380px;
        }

        .eg-feature-list li {
          margin-bottom: 0.6rem;
          font-size: 1rem;
        }

        .eg-small-note {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #777;
        }
      `}</style>
    </div>
  );
}

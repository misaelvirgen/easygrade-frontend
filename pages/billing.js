import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function Billing() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (!user || !profile) return null;

  const isPremium = profile.is_premium === true;

  return (
    <div className="eg-dashboard-layout">
      <Sidebar isPremium={isPremium} />

      <main className="eg-dashboard-main">
        <TopHeader
  title="Billing"
  subtitle="Manage your subscription and payments."
/>

        <section className="eg-card" style={{ maxWidth: 520 }}>
          <h2 className="eg-card-title">Current Plan</h2>

          {isPremium ? (
            <>
              <p className="eg-muted-text">
                You’re currently on the <strong>Pro</strong> plan.
              </p>

              <button
                className="eg-secondary-button"
                style={{ marginTop: 12 }}
                disabled
              >
                Manage subscription (coming soon)
              </button>
            </>
          ) : (
            <>
              <p className="eg-muted-text">
                You’re currently on the <strong>Free</strong> plan.
              </p>

              <button
                className="eg-primary-button"
                style={{ marginTop: 12 }}
                onClick={() => router.push("/upgrade")}
              >
                Upgrade to Pro
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

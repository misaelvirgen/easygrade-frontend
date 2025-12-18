import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PricingButtons({ billing }) {
  const [loading, setLoading] = useState(false);

  const priceId =
    billing === "yearly"
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;

  const buttonLabel =
    billing === "yearly" ? "Upgrade Annual" : "Upgrade Monthly";

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to upgrade.");
        return;
      }

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout session.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="eg-primary-button"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Loading…" : buttonLabel}
    </button>
  );
}

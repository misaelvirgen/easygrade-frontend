import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PricingButtons() {
  const handleCheckout = async (plan) => {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const { id } = await res.json();
    const stripe = await stripePromise;
    stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div>
      <button onClick={() => handleCheckout("monthly")}>
        Upgrade Monthly
      </button>

      <button onClick={() => handleCheckout("annual")}>
        Upgrade Annual (Save 20%)
      </button>
    </div>
  );
}

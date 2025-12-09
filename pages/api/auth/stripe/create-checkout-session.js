import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Get the logged-in user session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { plan } = req.body;

  // Determine the correct Stripe Price ID
  const priceId =
    plan === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?upgraded=true`,
      cancel_url: `${req.headers.origin}/billing?canceled=true`,
    });

    return res.status(200).json({ id: checkoutSession.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
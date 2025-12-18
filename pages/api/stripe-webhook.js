import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Supabase service role (bypasses RLS for server-side updates)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let rawBody = "";

  try {
    for await (const chunk of req) {
      rawBody += chunk;
    }
  } catch {
    return res.status(500).send("Failed to read request body");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.status(400).send("Invalid Stripe signature");
  }

  try {
    switch (event.type) {
      // Upgrade user after successful checkout
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session?.metadata?.user_id;

        if (!userId) {
          return res.status(400).send("Missing user_id metadata");
        }

        const { error } = await supabase
          .from("profiles")
          .update({ is_premium: true })
          .eq("id", userId);

        if (error) throw error;
        break;
      }

      // Subscription cancelled
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { error } = await supabase
          .from("profiles")
          .update({ is_premium: false })
          .eq("stripe_customer_id", customerId);

        if (error) throw error;
        break;
      }

      // Subscription downgraded / expired / unpaid
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        if (subscription.status !== "active") {
          const customerId = subscription.customer;

          const { error } = await supabase
            .from("profiles")
            .update({ is_premium: false })
            .eq("stripe_customer_id", customerId);

          if (error) throw error;
        }
        break;
      }

      default:
        // Ignore all other Stripe events
        break;
    }

    return res.json({ received: true });
  } catch {
    return res.status(500).send("Webhook handler failed");
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not logged in" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", session.user.id)
    .single();

  res.status(200).json(data);
}

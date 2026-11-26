import { createClient } from "@supabase/supabase-js";
export const db = () =>
  createClient(process.env.SUPABASE_URL || "http://localhost", process.env.SUPABASE_SERVICE_ROLE_KEY || "x", { auth: { persistSession: false } });

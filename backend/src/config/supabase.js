import { createClient } from '@supabase/supabase-js';

// Service role key bypasses RLS — never expose this on the frontend.
// Only runs on the server. Lives in environment variables only.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

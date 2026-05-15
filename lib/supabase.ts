import { createClient } from '@supabase/supabase-js';

// Supabase client – works both on server and client (NEXT_PUBLIC_ variables are exposed to the browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
);

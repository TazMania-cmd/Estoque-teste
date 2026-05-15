import { createClient } from '@supabase/supabase-js';

// Supabase client – works both on server and client (NEXT_PUBLIC_ variables are exposed to the browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://pefxiwocojsplayoooqd.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_F9oVs9jfjel_o9L0ehbpjw_vrhD5Ucu'
);

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars. 請複製 .env.example 為 .env.local 並填入 Supabase 金鑰');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

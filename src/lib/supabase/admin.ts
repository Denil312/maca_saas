import { createClient } from '@supabase/supabase-js';

/**
 * 僅用於 Server 端、不需 session 的公開讀取
 * 例如：首頁、活動列表的 Server Component 資料抓取
 */
export function createServerOnlyClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

-- 方案：暫時關閉 associations 的 RLS（公開資料表適用）
-- 在 Supabase SQL Editor 執行

ALTER TABLE associations DISABLE ROW LEVEL SECURITY;

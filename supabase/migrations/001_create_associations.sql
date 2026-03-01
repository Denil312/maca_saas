-- Create extensions if needed (uuid-ossp is usually enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS：允許公開讀取、插入（供 API 腳本使用）
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "允許公開讀取 associations" ON associations;
DROP POLICY IF EXISTS "允許公開插入 associations" ON associations;
DROP POLICY IF EXISTS "associations_select" ON associations;
DROP POLICY IF EXISTS "associations_insert" ON associations;
DROP POLICY IF EXISTS "associations_public_all" ON associations;

CREATE POLICY "associations_public_all"
  ON associations FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert test row (若已存在則不重複插入)
INSERT INTO associations (title, description)
SELECT 'MACA 歡迎', '音樂藝術文化協會'
WHERE NOT EXISTS (SELECT 1 FROM associations WHERE title = 'MACA 歡迎');

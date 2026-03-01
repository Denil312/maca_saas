-- ============================================
-- MACA 音樂協會官網 - Supabase 資料表設計
-- ============================================

-- 1. 首頁內容（協會介紹）
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 活動（定期活動 + 過往活動，以 date 區分）
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_sort ON activities(sort_order, date DESC);

-- 3. 管理員設定（使用 Supabase Auth，此表擴展 user metadata）
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 政策：公開讀取 site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允許公開讀取 site_content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "僅管理員可修改 site_content"
  ON site_content FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- RLS 政策：公開讀取 activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允許公開讀取 activities"
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "僅管理員可修改 activities"
  ON activities FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- RLS 政策：admin_users 僅管理員可讀
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "僅管理員可讀 admin_users"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

-- 插入預設首頁內容
INSERT INTO site_content (key, title, content, image_url) VALUES
  ('home_intro', '關於 MACA', 
   'Music Arts and Cultural Association (MACA) 成立於推廣音樂藝術與文化傳承。我們致力於舉辦各類音樂活動、工作坊與演出，連結愛樂者與藝術家，讓音樂的美好觸動每個人的心靈。', 
   '/images/hero-bg.jpg')
ON CONFLICT (key) DO NOTHING;

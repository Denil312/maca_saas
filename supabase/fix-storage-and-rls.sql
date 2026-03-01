-- ============================================
-- 修復：Storage event-images INSERT + associations/activities RLS
-- 在 Supabase SQL Editor 執行
-- ============================================

-- 1. Storage event-images：允許 authenticated 上傳、公開讀取
-- （若 bucket 不存在，請先執行 npx tsx scripts/setup-storage.ts 或於 Dashboard 建立）

-- 刪除舊 policy 避免衝突
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read event-images" ON storage.objects;
DROP POLICY IF EXISTS "event-images insert" ON storage.objects;
DROP POLICY IF EXISTS "event-images select" ON storage.objects;

CREATE POLICY "event-images insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "event-images select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');


-- 2. associations：確保 public SELECT + admin/bypass 可寫入
DROP POLICY IF EXISTS "associations_select" ON associations;
DROP POLICY IF EXISTS "associations_admin_insert" ON associations;
DROP POLICY IF EXISTS "associations_admin_update" ON associations;
DROP POLICY IF EXISTS "associations_admin_delete" ON associations;
DROP POLICY IF EXISTS "associations_public_all" ON associations;
DROP POLICY IF EXISTS "associations_admin_all" ON associations;

CREATE POLICY "associations_select"
ON associations FOR SELECT USING (true);

CREATE POLICY "associations_admin_write"
ON associations FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "associations_admin_update"
ON associations FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "associations_admin_delete"
ON associations FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);


-- 3. activities：允許 admin 或 cristyyoe@gmail.com 寫入
DROP POLICY IF EXISTS "僅管理員可修改 activities" ON activities;

CREATE POLICY "activities_admin_insert"
ON activities FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "activities_admin_update"
ON activities FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "activities_admin_delete"
ON activities FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);


-- 4. site_content：確保 admin 可 INSERT/UPDATE（社群連結等）
DROP POLICY IF EXISTS "僅管理員可修改 site_content" ON site_content;

CREATE POLICY "site_content_admin_insert"
ON site_content FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "site_content_admin_update"
ON site_content FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);

CREATE POLICY "site_content_admin_delete"
ON site_content FOR DELETE
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  OR (auth.jwt() ->> 'email') = 'cristyyoe@gmail.com'
);


-- 5. site_content 欄位：確保 content、value 存在
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS value TEXT;
ALTER TABLE site_content ALTER COLUMN value DROP NOT NULL;

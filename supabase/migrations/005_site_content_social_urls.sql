-- 新增 value 欄位：key-value 儲存（例：key='facebook_url', value='https://...'）
-- value 可為 NULL，允許 URL 留空
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS value TEXT;
ALTER TABLE site_content ALTER COLUMN value DROP NOT NULL;

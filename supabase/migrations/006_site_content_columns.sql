-- 確保 site_content 有 content 欄位（關於我們、Banner 等使用）
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS content TEXT;

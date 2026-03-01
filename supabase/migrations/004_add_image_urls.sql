-- 新增 image_urls 支援多圖（保留 image_url 向後相容）
ALTER TABLE associations ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- 既有 image_url 在 app 層 fallback：image_urls 空時用 image_url

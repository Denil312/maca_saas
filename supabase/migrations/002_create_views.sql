-- 建立 regular_events / past_events 視圖（供查詢用）
CREATE OR REPLACE VIEW regular_events AS
SELECT * FROM activities WHERE date >= CURRENT_DATE;

CREATE OR REPLACE VIEW past_events AS
SELECT * FROM activities WHERE date < CURRENT_DATE;

GRANT SELECT ON regular_events TO anon;
GRANT SELECT ON past_events TO anon;

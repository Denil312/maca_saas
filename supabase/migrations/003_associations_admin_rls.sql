-- associations：公開讀取，僅 admin 可寫入
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "associations_public_all" ON associations;
DROP POLICY IF EXISTS "associations_select" ON associations;

CREATE POLICY "associations_select" ON associations FOR SELECT USING (true);

CREATE POLICY "associations_admin_insert"
  ON associations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "associations_admin_update"
  ON associations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "associations_admin_delete"
  ON associations FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

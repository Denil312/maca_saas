# Supabase 設定檢查清單

請依序確認以下項目，確保首頁 Banner、社群連結、活動/協會等功能正常運作。

## 1. 資料表與 RLS

在 **Supabase Dashboard → SQL Editor** 執行：

1. `supabase/schema.sql` — 建立資料表與基本 RLS
2. `supabase/fix-storage-and-rls.sql` — 修正 Storage 與 site_content 的 INSERT/UPDATE 權限

> ⚠️ **重要**：若未執行 `fix-storage-and-rls.sql`，Admin 的「首頁 Banner 圖片」、「社群連結」儲存可能會失敗。

## 2. Storage Bucket

建立 `event-images` bucket（公開讀取）：

```bash
npx tsx scripts/setup-storage.ts
```

或在 **Storage → New bucket**：
- 名稱：`event-images`
- **Public bucket**：✓
- 需有 Policy 允許 `authenticated` 角色 `INSERT`（`fix-storage-and-rls.sql` 會建立）

## 3. Banner 功能對應設定

| 項目 | 說明 | 來源 |
|------|------|------|
| site_content | 儲存 key=`banner_images`，content=圖片 URL 陣列 | schema.sql |
| site_content INSERT/UPDATE | 管理員可 upsert | fix-storage-and-rls.sql §4 |
| Storage event-images | 上傳至 `banner/` 路徑 | fix-storage-and-rls.sql §1 |
| 公開讀取 Storage | 首頁可載入圖片 | fix-storage-and-rls.sql §1 |

## 4. 快速檢查

執行完上述 SQL 後，在 Admin 後台：
- 上傳 Banner 圖片 → 應可儲存成功
- 設定社群連結 → 應可儲存成功

若出現 RLS 或權限錯誤，請再次執行 `fix-storage-and-rls.sql`。

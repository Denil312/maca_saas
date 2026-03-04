# MACA 官網 - AI Agent 專案指南

本文件供 Cursor AI Agent 快速理解專案架構與慣例，換電腦或新對話時可參考。

## 專案概述

**MACA 音樂藝術及文化協會**官方網站，使用 Next.js 16 (App Router)、Tailwind CSS 4、Supabase。

- 官網：https://macahk.com
- 後台：只限管理員登入，無公開註冊

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 樣式 | Tailwind CSS 4 |
| 資料庫 / 認證 | Supabase |
| 部署 | Vercel |

---

## 頁面結構

| 路徑 | 說明 | 資料來源 |
|------|------|----------|
| `/` | 首頁 | associations、site_content (banner_images) |
| `/about` | 關於我們 | site_content (about_us) |
| `/activities` | 最新活動（date ≥ 今天） | activities |
| `/past-activities` | 過往活動（date < 今天） | activities |
| `/admin` | 管理後台 | 需 admin_users |
| `/admin/login` | 管理員登入 | — |
| `/admin/reset-password` | 重設密碼 | — |

---

## 資料表與 site_content 對照

### site_content（key-value）

| key | 欄位 | 用途 |
|-----|------|------|
| facebook_url | value | Facebook URL |
| instagram_url | value | Instagram URL |
| banner_images | value | 首頁 Banner 圖片 URL 陣列（JSON） |
| about_us | value | 關於我們文字內容 |

**重要**：使用 `value` 欄位，不要用 `content`（schema 中可能無此欄位）。

### 其他資料表

- **activities**：活動（title, date, description, image_url）
- **associations**：首頁「MACA 最新資訊」卡片（title, description, image_url）
- **admin_users**：管理員名單，對應 auth.users.id

### Storage

- **event-images**：活動、協會、Banner 圖片，需為 Public bucket

---

## 重要檔案

| 檔案 | 說明 |
|------|------|
| `src/components/Header.tsx` | 導覽、社群圖示、手機漢堡選單 |
| `src/components/AdminDashboard.tsx` | 管理後台主畫面 |
| `src/components/ActivitiesCrud.tsx` | 活動管理 |
| `src/components/AssociationsCrud.tsx` | 協會/首頁卡片管理 |
| `src/components/BannerCrud.tsx` | 首頁 Banner |
| `src/components/AboutUsCrud.tsx` | 關於我們編輯 |
| `src/components/SocialLinksCrud.tsx` | 社群連結 |
| `src/app/actions/revalidate.ts` | 管理後台儲存後清除頁面快取 |
| `src/middleware.ts` | /admin 權限、/admin/register 導向登入 |

---

## 開發慣例

1. **語言**：回覆與註解使用繁體中文
2. **site_content**：一律使用 `value` 欄位讀寫
3. **管理後台儲存**：CRUD 儲存成功後需呼叫 `revalidateAfterSave()` 以即時更新公開頁面
4. **關於我們**：每一行為一段落，空行產生額外間距，見 `formatContent()` 於 `src/app/about/page.tsx`

---

## 環境變數

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 專案 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase Anon key
- `SUPABASE_SERVICE_ROLE_KEY`：本機腳本用（add-admin、reset-password、setup-storage）

---

## 常用指令

```bash
npm run dev              # 開發
npm run build            # 建置
npm run db:add-admin -- email@example.com
npm run db:reset-password -- email@example.com 新密碼
```

---

## Supabase 設定提醒

- 執行 `supabase/fix-storage-and-rls.sql` 以建立 `value` 欄位與 RLS
- 密碼重設需在 URL Configuration 加入 `https://macahk.com/admin/reset-password`

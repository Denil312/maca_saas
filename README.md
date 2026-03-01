# MACA 音樂協會官網

Music Arts and Cultural Association (MACA) 官方網站 - 使用 Next.js 16、Tailwind CSS、Supabase 建置。

## 技術棧

- **Next.js 16**（App Router）
- **Tailwind CSS 4**
- **Supabase**（資料庫 + 認證）

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Supabase

1. 至 [Supabase](https://supabase.com) 建立專案
2. 複製 `.env.example` 為 `.env.local`，填入你的 Supabase URL 與 Anon Key

```bash
cp .env.example .env.local
```

4. 在 Supabase Dashboard 的 SQL Editor 依序執行：
   - `supabase/schema.sql`
   - `supabase/fix-storage-and-rls.sql`（修正 Storage 與 site_content 權限，**Banner 與社群連結需此步驟**）

### 3. 設定管理員

在 Supabase 建立使用者並啟用 Email 登入後，於 SQL Editor 執行：

```sql
-- 將 your-user-uuid 替換為 auth.users 中管理員的 id
INSERT INTO admin_users (id) 
VALUES ('your-user-uuid');
```

### 4. Storage（圖片上傳用）

建立 `event-images` bucket：

```bash
npx tsx scripts/setup-storage.ts
```

或在 Supabase Dashboard → Storage → New bucket，名稱 `event-images`，設為 **Public**。  
於 bucket 新增 Policy：允許 `authenticated` 角色 `INSERT`。

### 5. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## Git 與 Vercel 部署

### Git 版本控制

```bash
git add .
git commit -m "Initial commit: MACA 官網"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/maca_saas.git
git push -u origin main
```

### Vercel 部署

1. 至 [Vercel](https://vercel.com) 登入，選擇 **Add New Project**
2. Import 你的 GitHub repository（需先推送至 GitHub）
3. **Environment Variables** 設定：
   - `NEXT_PUBLIC_SUPABASE_URL` = 你的 Supabase 專案 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase 專案的 Anon (public) key
4. Deploy 即可

Vercel 會自動辨識 Next.js，無需額外設定。部署後請確認 Supabase 專案的 **URL Configuration** 已加入 Vercel 產生的網域（若有使用重定向或自訂網域）。

## 頁面結構

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 - 協會介紹 |
| `/activities` | 最新活動（日期 ≥ 今天） |
| `/past-activities` | 過往活動（日期 < 今天） |
| `/admin` | 管理後台（需登入且為 admin_users） |
| `/admin/login` | 管理員登入 |

## 資料表設計

- **site_content**：首頁等靜態內容（key-value）
- **activities**：活動（標題、日期、描述、圖片）
- **associations**：首頁歡迎內容（標題、描述、圖片）
- **admin_users**：管理員名單（對應 auth.users）
- **Storage event-images**：活動/協會圖片

## 授權

Private - MACA

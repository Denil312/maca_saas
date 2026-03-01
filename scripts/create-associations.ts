/**
 * 使用 .env.local 的 Supabase 連線建立 associations 表
 *
 * 模式 A（推薦）：.env.local 有 SUPABASE_DB_URL → 自動建表 + 插入
 * 模式 B：僅有 NEXT_PUBLIC_SUPABASE_* → 先到 Dashboard SQL Editor 執行
 *         supabase/migrations/001_create_associations.sql，再跑此腳本插入
 *
 * 執行：npm run db:create-associations
 */

import { config } from "dotenv";
import { resolve } from "path";
import { Client } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
config({ path: resolve(root, ".env.local") });

const dbUrl = process.env.SUPABASE_DB_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Service Role Key 可繞過 RLS，取得：Dashboard → Settings → API → service_role (secret)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = supabaseServiceKey ?? supabaseAnonKey;

async function runWithPg() {
  if (!dbUrl) throw new Error("SUPABASE_DB_URL 未設定");
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  const sql = readFileSync(
    join(root, "supabase/migrations/001_create_associations.sql"),
    "utf-8"
  );
  await client.query(sql);
  const { rows } = await client.query("SELECT * FROM associations");
  await client.end();
  return rows;
}

async function runWithSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 未設定");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: existing } = await supabase
    .from("associations")
    .select("id")
    .eq("title", "MACA 歡迎")
    .limit(1);

  if (existing?.length) {
    console.log("測試資料已存在，略過插入");
    const { data } = await supabase.from("associations").select("*");
    return data ?? [];
  }

  const { error } = await supabase.from("associations").insert({
    title: "MACA 歡迎",
    description: "音樂藝術文化協會",
  });

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "associations 表尚未建立。請先在 Supabase Dashboard → SQL Editor 執行：\n\n" +
          readFileSync(join(root, "supabase/migrations/001_create_associations.sql"), "utf-8")
      );
    }
    throw error;
  }

  const { data } = await supabase.from("associations").select("*");
  return data ?? [];
}

async function main() {
  try {
    let rows;

    if (dbUrl) {
      console.log("使用 SUPABASE_DB_URL 建立表並插入...");
      rows = await runWithPg();
      console.log("✓ associations 表已建立，測試資料已插入");
    } else if (supabaseUrl && supabaseKey) {
      console.log(supabaseServiceKey ? "使用 Service Role Key 插入..." : "使用 Supabase API 插入（表須已存在）...");
      rows = await runWithSupabaseClient();
      console.log("✓ 測試資料已插入");
    } else {
      console.error(`
❌ 請在 .env.local 至少設定以下其一：

方式 1（推薦）— 完整自動建表：
  SUPABASE_DB_URL=postgresql://postgres.xxx:[密碼]@aws-0-xxx.pooler.supabase.com:6543/postgres
  取得：Supabase Dashboard → Settings → Database → Connection string (URI)

方式 2 — 僅插入（需先在 SQL Editor 執行 supabase/migrations/001_create_associations.sql）：
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
`);
      process.exit(1);
    }

    console.log("\n目前資料：", rows);
  } catch (err) {
    console.error("❌ 執行失敗：", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();

/**
 * 依 email 將使用者加入 admin_users
 * 執行：npx tsx scripts/add-admin.ts cristyyoe@gmail.com
 * 需 SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ 需設定 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error("用法：npx tsx scripts/add-admin.ts <email>");
  process.exit(1);
}

async function main() {
  const supabase = createClient(url!, serviceKey!);

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const target = users?.find((u) => u.email === email);

  if (!target) {
    console.error(`❌ 找不到 email: ${email}，請先完成註冊`);
    process.exit(1);
  }

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", target.id)
    .single();

  if (existing) {
    console.log(`✓ ${email} 已是管理員`);
    process.exit(0);
  }

  const { error } = await supabase.from("admin_users").insert({
    id: target.id,
    role: "admin",
  });

  if (error) {
    console.error("❌ 插入失敗：", error.message);
    process.exit(1);
  }

  console.log(`✓ 已將 ${email} 加入管理員`);
}

main();

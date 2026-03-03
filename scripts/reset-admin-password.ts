/**
 * 重設管理員密碼（需 Service Role Key）
 * 用法：npx tsx scripts/reset-admin-password.ts <email> <新密碼>
 *
 * 需在 .env.local 設定：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
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
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("用法：npx tsx scripts/reset-admin-password.ts <email> <新密碼>");
  console.error("範例：npx tsx scripts/reset-admin-password.ts admin@example.com MyNewPass123");
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error("❌ 密碼至少 6 個字元");
  process.exit(1);
}

async function main() {
  const supabase = createClient(url!, serviceKey!);

  const { data: { users } } = await supabase.auth.admin.listUsers();
  const target = users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!target) {
    console.error(`❌ 找不到 email: ${email}`);
    process.exit(1);
  }

  const { error } = await supabase.auth.admin.updateUserById(target.id, {
    password: newPassword,
  });

  if (error) {
    console.error("❌ 重設失敗：", error.message);
    process.exit(1);
  }

  console.log(`✓ 已重設 ${email} 的密碼`);
}

main();

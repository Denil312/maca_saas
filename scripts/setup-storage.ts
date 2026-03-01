/**
 * 建立 event-images Storage bucket（需 SUPABASE_SERVICE_ROLE_KEY）
 * 執行：npx tsx scripts/setup-storage.ts
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

async function main() {
  const supabase = createClient(url!, serviceKey!);

  const { error } = await supabase.storage.createBucket("event-images", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
  });

  if (error) {
    if (error.message?.includes("already exists")) {
      console.log("✓ event-images bucket 已存在");
    } else {
      console.error("❌", error.message);
      process.exit(1);
    }
  } else {
    console.log("✓ event-images bucket 已建立（公開讀取）");
  }
}

main();

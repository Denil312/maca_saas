"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AssociationsCrud } from "./AssociationsCrud";
import { ActivitiesCrud } from "./ActivitiesCrud";
import { AboutUsCrud } from "./AboutUsCrud";
import { BannerCrud } from "./BannerCrud";
import { SocialLinksCrud } from "./SocialLinksCrud";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-900">管理後台</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-amber-800/70">{user.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-amber-700 px-4 py-2 text-sm text-amber-800 transition hover:bg-amber-50"
          >
            登出
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <BannerCrud />
        <AboutUsCrud />
        <AssociationsCrud />
        <ActivitiesCrud />
        <SocialLinksCrud />

        <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-amber-900">快速連結</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
              前往首頁
            </a>
            <a href="/activities" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
              最新活動
            </a>
            <a href="/past-activities" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
              過往活動
            </a>
            <a href="/about" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">
              關於我們
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

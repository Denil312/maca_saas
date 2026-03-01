import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata = {
  title: "管理後台 | MACA",
  description: "MACA 管理後台",
};

export default async function AdminPage() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/admin/login");
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // 暫時允許指定 email 繞過 admin 檢查
  const BYPASS_ADMIN_EMAILS = ["cristyyoe@gmail.com"];
  if (BYPASS_ADMIN_EMAILS.includes(user.email ?? "")) {
    return <AdminDashboard user={user} />;
  }

  // 檢查是否為管理員
  let adminUser = null;
  try {
    const { data } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .single();
    adminUser = data;
  } catch {
    // admin_users 表可能尚未建立
  }

  if (!adminUser) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-amber-900">無權限存取</h1>
        <p className="text-amber-800/80">
          您沒有管理後台的存取權限。如需權限請聯絡管理員。
        </p>
        <form action="/admin/logout" method="post" className="mt-8">
          <button
            type="submit"
            className="rounded-lg border border-amber-700 px-4 py-2 text-amber-800 hover:bg-amber-50"
          >
            登出
          </button>
        </form>
      </div>
    );
  }

  return <AdminDashboard user={user} />;
}

import { createServerOnlyClient } from "@/lib/supabase/admin";
import { ActivityCard } from "@/components/ActivityCard";
import Link from "next/link";

export const metadata = {
  title: "最新活動 | MACA",
  description: "MACA 音樂協會最新活動一覽",
};

export const revalidate = 10;

export default async function ActivitiesPage() {
  let activities: { id: string; title: string; date: string; description: string | null; image_url: string | null }[] = [];

  try {
    const supabase = createServerOnlyClient();
    if (supabase) {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("activities")
        .select("id, title, date, description, image_url")
        .gte("date", today)
        .order("date", { ascending: false });

      if (error) {
        console.error("[ActivitiesPage] Supabase error:", error);
      } else {
        activities = data ?? [];
      }
    }
  } catch (err) {
    console.error("[ActivitiesPage] Fetch error:", err);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-amber-900">最新活動</h1>
      <p className="mb-12 text-amber-900/70">
        即將舉行與進行中的 MACA 活動
      </p>

      {activities.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-8 py-16 text-center">
          <p className="text-lg font-medium text-amber-800/80">即將推出</p>
          <p className="mt-2 text-sm text-amber-700/60">
            敬請期待，或前往過往活動頁面瀏覽歷史活動
          </p>
          <Link
            href="/past-activities"
            className="mt-4 inline-block text-sm font-medium text-amber-700 underline hover:text-amber-900"
          >
            瀏覽過往活動 →
          </Link>
        </div>
      )}
    </div>
  );
}

import { createServerOnlyClient } from "@/lib/supabase/admin";
import { ActivityCard } from "@/components/ActivityCard";

export const metadata = {
  title: "過往活動 | MACA",
  description: "MACA 音樂協會過往活動紀錄",
};

export default async function PastActivitiesPage() {
  const supabase = createServerOnlyClient();

  let activities: { id: string; title: string; date: string; description: string | null; image_url: string | null }[] = [];

  if (supabase) {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("activities")
      .select("id, title, date, description, image_url")
      .lt("date", today)
      .order("date", { ascending: false });

    activities = data || [];
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-amber-900">過往活動</h1>
      <p className="mb-12 text-amber-900/70">
        MACA 歷年活動紀錄
      </p>

      {activities.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-8 py-16 text-center">
          <p className="text-amber-800/80">暫無過往活動紀錄</p>
          <p className="mt-2 text-sm text-amber-700/60">
            活動紀錄將於活動結束後更新至此
          </p>
        </div>
      )}
    </div>
  );
}

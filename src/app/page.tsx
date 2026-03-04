import { createServerOnlyClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ImageCarousel } from "@/components/ImageCarousel";

function parseImageUrls(val: string | null): string[] {
  if (!val) return [];
  if (val.startsWith("[")) {
    try {
      const arr = JSON.parse(val) as string[];
      return Array.isArray(arr) ? arr : [val];
    } catch {
      return [val];
    }
  }
  return [val];
}

export const revalidate = 10;

export default async function HomePage() {
  let associations: { id: string; title: string | null; description: string | null; image_url: string | null }[] = [];
  let bannerUrls: string[] = [];

  try {
    const supabase = createServerOnlyClient();
    if (supabase) {
      const [assocRes, bannerRes] = await Promise.all([
        supabase.from("associations").select("*").order("created_at", { ascending: false }),
        supabase.from("site_content").select("value").eq("key", "banner_images").maybeSingle(),
      ]);
      if (assocRes.error) console.error("[HomePage] associations error:", assocRes.error);
      else associations = assocRes.data ?? [];
      bannerUrls = parseImageUrls(bannerRes.data?.value ?? null);
    }
  } catch (err) {
    console.error("[HomePage] Fetch error:", err);
  }

  return (
    <div className="-mt-2">
      {/* Hero Section：有 banner 圖片時顯示 carousel，無則維持漸層背景 */}
      <section className="relative h-[70vh] min-h-[400px] w-full overflow-hidden bg-gradient-to-b from-amber-100 to-amber-50">
        {bannerUrls.length > 0 && (
          <ImageCarousel urls={bannerUrls} alt="MACA Banner" fillParent />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-200/40 via-amber-100/60 to-amber-50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23d97706%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-60" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-950/20 px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-wider text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            MACA
          </h1>
          <p className="max-w-xl text-lg text-white/95 drop-shadow">
            Music Arts and Cultural Association
          </p>
          <p className="mt-2 text-sm text-white/80">音樂藝術及文化協會</p>
        </div>
      </section>

      {/* Associations 卡片（從 DB 讀取全部） */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 text-center text-2xl font-semibold text-amber-900">
          MACA 最新資訊
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {associations.map((item) => {
            const urls = parseImageUrls(item.image_url);
            return (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-amber-900/10 bg-white shadow-sm"
            >
              <ImageCarousel urls={urls} alt={item.title ?? ""} aspectRatio="aspect-video" className="rounded-t-xl" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-amber-900">
                  {item.title || "—"}
                </h3>
                <p className="mt-2 text-amber-900/70 whitespace-pre-wrap break-words">{item.description || "—"}</p>
              </div>
            </article>
          );
          })}
        </div>
        <div className="mt-12 flex justify-center gap-6">
          <Link
            href="/activities"
            className="rounded-lg bg-amber-700 px-6 py-3 font-medium text-white transition hover:bg-amber-800"
          >
            最新活動
          </Link>
          <Link
            href="/past-activities"
            className="rounded-lg border border-amber-700 px-6 py-3 font-medium text-amber-800 transition hover:bg-amber-50"
          >
            過往活動
          </Link>
        </div>
      </section>
    </div>
  );
}

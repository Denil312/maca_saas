"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { revalidateAfterSave } from "@/app/actions/revalidate";

const BUCKET = "event-images";
const BANNER_KEY = "banner_images";

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

export function BannerCrud() {
  const [urls, setUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  useEffect(() => {
    const p = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(p);
    return () => p.forEach(URL.revokeObjectURL);
  }, [imageFiles]);

  async function fetchBanner() {
    setLoading(true);
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", BANNER_KEY)
      .maybeSingle();
    setUrls(parseImageUrls(data?.value ?? null));
    setLoading(false);
  }

  useEffect(() => {
    fetchBanner();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
  }

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeNewFile(idx: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function uploadImages(): Promise<string[]> {
    const result: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `banner/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) throw new Error(`圖片上傳失敗：${error.message}`);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      result.push(data.publicUrl);
    }
    return result;
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const newUrls = await uploadImages();
      const allUrls = [...urls, ...newUrls];
      const value = allUrls.length === 0 ? null : allUrls.length === 1 ? allUrls[0] : JSON.stringify(allUrls);

      const { error } = await supabase
        .from("site_content")
        .upsert({ key: BANNER_KEY, title: "首頁 Banner 圖片", value }, { onConflict: "key" });

      if (error) throw new Error(error.message);
      await revalidateAfterSave("banner");
      setUrls(allUrls);
      setImageFiles([]);
      setMessage({ type: "success", text: "已儲存 Banner 圖片" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "儲存失敗" });
    }
    setSaving(false);
  }

  const allPreviews = [...urls, ...previewUrls];

  if (loading) {
    return (
      <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-amber-900">首頁 Banner 圖片</h2>
        <p className="text-amber-700/80">載入中...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-amber-900">首頁 Banner 圖片</h2>
      <p className="mb-4 text-sm text-amber-800/70">
        上傳多張圖片時，首頁 banner 將以輪播方式呈現。建議尺寸：1920×800 px。
      </p>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900">新增圖片</label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-600 bg-white px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            選擇檔案
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
          <span className="ml-3 text-sm text-amber-700/80">
            {allPreviews.length > 0 ? `已選擇 ${allPreviews.length} 張圖片` : "未選擇任何檔案"}
          </span>
        </div>
        {allPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allPreviews.map((url, i) => (
              <div key={i} className="relative">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded border border-amber-200">
                  <Image src={url} alt="" fill className="object-cover" unoptimized sizes="128px" />
                </div>
                <button
                  type="button"
                  onClick={() => (i < urls.length ? removeUrl(url) : removeNewFile(i - urls.length))}
                  className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800 disabled:opacity-70"
        >
          {saving ? "儲存中..." : "儲存"}
        </button>
      </div>
    </section>
  );
}

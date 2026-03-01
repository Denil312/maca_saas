"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SocialLinksCrud() {
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  async function fetchLinks() {
    setLoading(true);
    const [{ data: fb }, { data: ig }] = await Promise.all([
      supabase.from("site_content").select("value").eq("key", "facebook_url").maybeSingle(),
      supabase.from("site_content").select("value").eq("key", "instagram_url").maybeSingle(),
    ]);
    setFacebookUrl((fb?.value as string) ?? "");
    setInstagramUrl((ig?.value as string) ?? "");
    setLoading(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const [{ error: errFb }, { error: errIg }] = await Promise.all([
      supabase.from("site_content").upsert(
        { key: "facebook_url", value: facebookUrl.trim() || null },
        { onConflict: "key" }
      ),
      supabase.from("site_content").upsert(
        { key: "instagram_url", value: instagramUrl.trim() || null },
        { onConflict: "key" }
      ),
    ]);
    const error = errFb ?? errIg;
    if (error) {
      setMessage({ type: "error", text: `儲存失敗：${error.message}` });
    } else {
      setMessage({ type: "success", text: "已儲存社群連結" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-amber-900">社群連結</h2>
        <p className="text-amber-700/80">載入中...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-amber-900">社群連結</h2>
      <p className="mb-4 text-sm text-amber-800/70">設定 Facebook 與 Instagram 網址，將顯示於頁首供訪客點擊。</p>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900">Facebook 網址</label>
          <input
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="https://www.facebook.com/..."
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-amber-900 placeholder:text-amber-400/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900">Instagram 網址</label>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://www.instagram.com/..."
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-amber-900 placeholder:text-amber-400/60"
          />
        </div>
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

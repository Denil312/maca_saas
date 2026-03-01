"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ABOUT_KEY = "about_us";

export function AboutUsCrud() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  async function fetchContent() {
    setLoading(true);
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", ABOUT_KEY)
      .maybeSingle();
    setContent((data?.value as string) ?? "");
    setLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { key: ABOUT_KEY, title: "關於我們", value: content.trim() || null },
        { onConflict: "key" }
      );
    if (error) {
      setMessage({ type: "error", text: `儲存失敗：${error.message}` });
    } else {
      setMessage({ type: "success", text: "已儲存關於我們內容" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-amber-900">關於我們</h2>
        <p className="text-amber-700/80">載入中...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-amber-900">關於我們</h2>
      <p className="mb-4 text-sm text-amber-800/70">
        編輯「關於我們」頁面的文字內容，將顯示於 <a href="/about" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:text-amber-900">/about</a>。
      </p>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-amber-900">內容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="輸入關於協會的介紹文字..."
            rows={12}
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-amber-900 placeholder:text-amber-400/60"
          />
          <p className="mt-1 text-xs text-amber-600/70">支援換行，空行會分段顯示。</p>
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

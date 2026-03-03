"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { revalidateAfterSave } from "@/app/actions/revalidate";

const BUCKET = "event-images";

interface Activity {
  id: string;
  title: string;
  date: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

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

function getImageUrls(item: Activity): string[] {
  return parseImageUrls(item.image_url);
}

export function ActivitiesCrud() {
  const [list, setList] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [imageFiles]);

  async function fetchList() {
    setLoading(true);
    const { data } = await supabase.from("activities").select("*").order("date", { ascending: false });
    setList(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, []);

  function resetForm() {
    setEditing(null);
    setIsAdding(false);
    setTitle("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setImageFiles([]);
    setExistingUrls([]);
    setError(null);
  }

  function startEdit(item: Activity) {
    setEditing(item);
    setTitle(item.title);
    setDate(item.date);
    setDescription(item.description ?? "");
    setExistingUrls(getImageUrls(item));
    setImageFiles([]);
    setIsAdding(false);
  }

  function startAdd() {
    resetForm();
    setDate(new Date().toISOString().split("T")[0]);
    setIsAdding(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
  }

  function removeExistingUrl(url: string) {
    setExistingUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeNewFile(idx: number) {
    setImageFiles((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  }

  async function uploadImages(): Promise<string[]> {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `activities/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) throw new Error(`圖片上傳失敗：${error.message}`);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const newUrls = await uploadImages();
      const allUrls = [...existingUrls, ...newUrls];
      const image_url = allUrls.length === 0 ? null : allUrls.length === 1 ? allUrls[0] : JSON.stringify(allUrls);
      const payload = { title, date, description, image_url };

      if (editing) {
        const { error } = await supabase.from("activities").update(payload).eq("id", editing.id);
        if (error) throw new Error(`更新失敗：${error.message}`);
      } else {
        const { error } = await supabase.from("activities").insert(payload);
        if (error) throw new Error(`新增失敗：${error.message}`);
      }
      await revalidateAfterSave("activities");
      resetForm();
      fetchList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Activity) {
    const msg = `確定要刪除活動「${item.title}」嗎？\n此動作無法復原。`;
    if (!confirm(msg)) return;
    const { error } = await supabase.from("activities").delete().eq("id", item.id);
    if (error) setError(error.message);
    else {
      await revalidateAfterSave("activities");
      fetchList();
    }
  }

  const allPreviews = [...existingUrls, ...previewUrls];

  if (loading) return <p className="text-amber-800/70">載入中...</p>;

  return (
    <section className="rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-amber-900">活動管理（最新／過往）</h2>
        <button type="button" onClick={startAdd} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
          新增活動
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg bg-amber-50/50 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">標題</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-amber-900/20 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-amber-900/20 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-amber-900/20 px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-amber-900">圖片（可多選）</label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-600 bg-white px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              選擇檔案
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="sr-only" />
            </label>
            <span className="ml-3 text-sm text-amber-700/80">
              {allPreviews.length > 0 ? `已選擇 ${allPreviews.length} 張圖片` : "未選擇任何檔案"}
            </span>
            {allPreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {allPreviews.map((url, i) => (
                  <div key={i} className="relative">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded border">
                      <Image src={url} alt="" fill className="object-contain" unoptimized />
                    </div>
                    <button type="button" onClick={() => (i < existingUrls.length ? removeExistingUrl(url) : removeNewFile(i - existingUrls.length))} className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50">{saving ? "儲存中..." : "儲存"}</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-amber-700 px-4 py-2 text-sm text-amber-800 hover:bg-amber-50">取消</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.map((item) => {
          const isPast = new Date(item.date) < new Date();
          const urls = getImageUrls(item);
          return (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-amber-200/40 p-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                {urls.length > 0 && (
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                    <Image src={urls[0]} alt={item.title} fill className="object-contain" sizes="64px" unoptimized />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-amber-900">{item.title}</p>
                  <p className="text-sm text-amber-800/70">
                    {new Date(item.date).toLocaleDateString("zh-TW")}
                    {isPast ? " (過往)" : " (最新)"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded border border-amber-600 px-3 py-1 text-sm text-amber-800 hover:bg-amber-50">編輯</button>
                <button type="button" onClick={() => handleDelete(item)} className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50">刪除</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { createServerOnlyClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "關於我們 | MACA",
  description: "音樂藝術及文化協會 MACA - 關於我們",
};

export const revalidate = 10;

export default async function AboutPage() {
  let content = "";

  try {
    const supabase = createServerOnlyClient();
    if (supabase) {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "about_us")
        .maybeSingle();
      content = (data?.value as string) ?? "";
    }
  } catch (err) {
    console.error("[AboutPage] Fetch error:", err);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-amber-900">關於我們</h1>
      <div
        className="prose prose-amber max-w-none text-amber-900/90 prose-p:leading-relaxed prose-p:mb-4 prose-headings:text-amber-900 [&>p:last-child]:mb-0"
        dangerouslySetInnerHTML={{
            __html: content ? formatContent(content) : '<p class="text-amber-700/70">尚無內容，請至管理後台填寫。</p>',
          }}
      />
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatContent(text: string): string {
  // 正規化換行符號（支援 Windows \r\n、舊 Mac \r）
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return normalized
    .split(/\n\s*\n/) // 以空行分隔段落（支援 \n\n 或 \n  \n）
    .map((p) => {
      const t = p.trim();
      if (!t) return "";
      return `<p>${escapeHtml(t).replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("");
}

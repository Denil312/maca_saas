import { ImageCarousel } from "./ImageCarousel";

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    date: string;
    description: string | null;
    image_url: string | null;
  };
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

type TextSegment = { type: "text"; value: string };
type LinkSegment = { type: "link"; url: string; label: string };
type Segment = TextSegment | LinkSegment;

/** 將描述文字中的網址辨識出來，回傳文字與連結片段（僅允許 http/https） */
function linkifyDescription(text: string): Segment[] {
  const segments: Segment[] = [];
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    const href = raw.toLowerCase().startsWith("www.") ? `https://${raw}` : raw;
    if (href.startsWith("https://") || href.startsWith("http://")) {
      segments.push({ type: "link", url: href, label: raw });
    } else {
      segments.push({ type: "text", value: raw });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments.length > 0 ? segments : [{ type: "text", value: text }];
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const dateStr = new Date(activity.date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const urls = parseImageUrls(activity.image_url);

  return (
    <article className="group overflow-hidden rounded-xl border border-amber-900/10 bg-white shadow-sm transition hover:shadow-md">
      <ImageCarousel urls={urls} alt={activity.title} aspectRatio="aspect-[16/10]" />
      <div className="p-5">
        <time className="text-sm font-medium text-amber-700">{dateStr}</time>
        <h3 className="mt-1 text-xl font-semibold text-amber-900">
          {activity.title}
        </h3>
        {activity.description && (
          <p className="mt-2 text-amber-900/70 whitespace-pre-wrap break-words">
            {linkifyDescription(activity.description).map((seg, i) =>
              seg.type === "text" ? (
                seg.value
              ) : (
                <a
                  key={i}
                  href={seg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline hover:text-amber-800"
                >
                  {seg.label}
                </a>
              )
            )}
          </p>
        )}
      </div>
    </article>
  );
}

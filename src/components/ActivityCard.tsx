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
            {activity.description}
          </p>
        )}
      </div>
    </article>
  );
}

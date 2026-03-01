export interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

import type { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createServerOnlyClient } from "@/lib/supabase/admin";

const notoSerif = Noto_Serif_TC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const revalidate = 10;

export const metadata: Metadata = {
  title: "MACA | Music Arts and Cultural Association",
  description: "音樂藝術文化協會 MACA 官網 - 推廣音樂藝術與文化傳承",
  icons: {
    icon: "/logo.svg",
  },
};

async function getSocialLinks() {
  const supabase = createServerOnlyClient();
  if (!supabase) return { facebookUrl: null, instagramUrl: null };
  const [{ data: fb }, { data: ig }] = await Promise.all([
    supabase.from("site_content").select("value").eq("key", "facebook_url").maybeSingle(),
    supabase.from("site_content").select("value").eq("key", "instagram_url").maybeSingle(),
  ]);
  const toUrl = (v: unknown) => {
    const s = typeof v === "string" ? v.trim() : "";
    return s.length > 0 ? s : null;
  };
  return {
    facebookUrl: toUrl(fb?.value),
    instagramUrl: toUrl(ig?.value),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { facebookUrl, instagramUrl } = await getSocialLinks();
  return (
    <html lang="zh-TW">
      <body className={`${notoSerif.variable} font-serif antialiased`}>
        <Header facebookUrl={facebookUrl} instagramUrl={instagramUrl} />
        <main className="min-h-screen bg-amber-50 pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

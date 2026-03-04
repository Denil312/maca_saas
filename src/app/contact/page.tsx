import type { Metadata } from "next";

const WHATSAPP_NUMBER_DISPLAY = "852 9526 3583";
const WHATSAPP_NUMBER_INTERNATIONAL = "85295263583";
const ADDRESS = "香港上環皇后大道中340號華秦國際大廈601室";
const MAP_URL = "https://maps.app.goo.gl/pfBb2EGorh83a7bt7";

export const metadata: Metadata = {
  title: "聯絡我們 | MACA",
  description: "MACA 音樂藝術及文化協會聯絡方式與地址",
};

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.01 2C6.94 2 2.84 6.1 2.84 11.17c0 1.93.54 3.73 1.57 5.33L2 22l5.63-2.38a9.16 9.16 0 0 0 4.38 1.12h.01c5.07 0 9.17-4.1 9.17-9.17C21.19 6.1 17.09 2 12.01 2Zm0 16.5c-1.44 0-2.85-.38-4.08-1.1l-.29-.17-3.34 1.41.71-3.53-.18-.29a7.43 7.43 0 0 1-1.12-3.85 7.45 7.45 0 0 1 7.45-7.45c4.11 0 7.45 3.35 7.45 7.45 0 4.1-3.34 7.43-7.45 7.43Zm4.08-5.48c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11-.14.22-.57.71-.7.86-.13.14-.26.16-.48.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.14-.22.21-.37.07-.14.03-.27-.01-.39-.04-.11-.5-1.2-.69-1.64-.18-.44-.37-.38-.5-.38h-.43c-.15 0-.39.06-.59.27-.2.22-.78.76-.78 1.86 0 1.1.8 2.17.91 2.32.11.15 1.57 2.4 3.8 3.36.53.23.94.37 1.26.47.53.17 1.02.15 1.4.09.43-.06 1.3-.53 1.49-1.04.18-.51.18-.95.13-1.04-.06-.09-.2-.15-.42-.26Z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.25A7.25 7.25 0 0 0 4.75 9.5c0 4.77 5.87 11.37 6.12 11.64.3.33.96.33 1.26 0 .25-.27 6.12-6.87 6.12-11.64A7.25 7.25 0 0 0 12 2.25Zm0 10.1a2.85 2.85 0 1 1 0-5.7 2.85 2.85 0 0 1 0 5.7Z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="w-full">
        <h1 className="mb-6 text-3xl font-bold text-amber-900">聯絡我們</h1>
        <p className="mb-6 text-sm text-amber-900/70">
          歡迎透過 WhatsApp 或親臨本會，亦可使用 Google 地圖導航前往。
        </p>

        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <WhatsappIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                WhatsApp
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER_INTERNATIONAL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-amber-900 hover:text-amber-800 hover:underline"
              >
                {WHATSAPP_NUMBER_DISPLAY}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <LocationIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                地址
              </div>
              <p className="text-base text-amber-900">
                {ADDRESS}
              </p>
              <div className="mt-1">
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
                >
                  在 Google 地圖中開啟
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


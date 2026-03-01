"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6">
      <h2 className="text-xl font-semibold text-amber-900">載入活動失敗</h2>
      <p className="text-center text-amber-800/80">{error.message}</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800"
        >
          再試一次
        </button>
        <Link href="/" className="rounded-lg border border-amber-700 px-4 py-2 font-medium text-amber-800 hover:bg-amber-50">
          返回首頁
        </Link>
      </div>
    </div>
  );
}

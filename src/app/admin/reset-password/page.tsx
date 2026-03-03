"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(true);
      if (!session) {
        setError("無效或已過期的重設連結，請重新申請");
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    if (password.length < 6) {
      setError("密碼至少 6 個字元");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setError("重設密碼時發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <p className="text-amber-800/70">載入中...</p>
      </div>
    );
  }

  if (error && !password) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <p className="mb-4 text-red-600">{error}</p>
        <Link href="/admin/login" className="text-amber-700 underline hover:text-amber-900">
          返回登入
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <p className="mb-4 text-green-700 font-medium">密碼已重設，即將導向登入頁...</p>
        <Link href="/admin/login" className="text-amber-700 underline hover:text-amber-900">
          立即前往登入
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
      <h1 className="mb-2 text-2xl font-bold text-amber-900">設定新密碼</h1>
      <p className="mb-8 text-sm text-amber-800/70">請輸入新密碼（至少 6 個字元）</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-amber-900">
            新密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-amber-900/20 px-4 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-amber-900">
            確認密碼
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-amber-900/20 px-4 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-700 py-2 font-medium text-white transition hover:bg-amber-800 disabled:opacity-50"
        >
          {loading ? "處理中..." : "重設密碼"}
        </button>
      </form>

      <Link href="/admin/login" className="mt-6 text-sm text-amber-800/70 underline hover:text-amber-900">
        返回登入
      </Link>
    </div>
  );
}

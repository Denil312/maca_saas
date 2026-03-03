"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (forgotMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });
        if (error) {
          setError(error.message);
          return;
        }
        setForgotSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        // 使用完整頁面導向，確保 session cookie 已送出後再進入後台
        window.location.href = "/admin";
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : (forgotMode ? "發送重設連結時發生錯誤" : "登入時發生錯誤");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (forgotSent) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
        <h1 className="mb-2 text-2xl font-bold text-amber-900">已發送重設連結</h1>
        <p className="mb-6 text-center text-amber-800/70">
          請至 {email} 收信，點擊連結後即可設定新密碼。
        </p>
        <button
          type="button"
          onClick={() => { setForgotSent(false); setForgotMode(false); }}
          className="text-amber-700 underline hover:text-amber-900"
        >
          返回登入
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20">
      <h1 className="mb-2 text-2xl font-bold text-amber-900">管理後台登入</h1>
      <p className="mb-8 text-sm text-amber-800/70">只限管理員登入</p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-amber-900">
            電子郵件
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-amber-900/20 px-4 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
        {!forgotMode && (
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-amber-900">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!forgotMode}
              className="w-full rounded-lg border border-amber-900/20 px-4 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-700 py-2 font-medium text-white transition hover:bg-amber-800 disabled:opacity-50"
        >
          {loading
            ? forgotMode ? "發送中..." : "登入中..."
            : forgotMode ? "發送重設連結" : "登入"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-amber-800/70">
        {forgotMode ? (
          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="underline hover:text-amber-900"
          >
            返回登入
          </button>
        ) : (
          <>
            忘記密碼？{" "}
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="font-medium text-amber-700 underline hover:text-amber-900"
            >
              重設密碼
            </button>
          </>
        )}
      </p>
    </div>
  );
}

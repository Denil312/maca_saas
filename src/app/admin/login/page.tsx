"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("登入時發生錯誤");
    } finally {
      setLoading(false);
    }
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
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-amber-900">
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-amber-900/20 px-4 py-2 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-700 py-2 font-medium text-white transition hover:bg-amber-800 disabled:opacity-50"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}

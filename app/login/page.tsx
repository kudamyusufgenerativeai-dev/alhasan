"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RiLeafLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-4 py-16"
      style={{ background: "var(--soft)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8 shadow-sm"
        style={{ background: "var(--bg)", borderColor: "var(--line)" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span
            className="w-12 h-12 rounded-xl grid place-items-center text-xl"
            style={{ background: "var(--pri)", color: "var(--onpri)" }}
          >
            <RiLeafLine />
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-1" style={{ color: "var(--ink)" }}>
          Masuk ke Dashboard
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--muted)" }}>
          Hanya untuk admin masjid
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1"
              style={{
                borderColor: "var(--line)",
                background: "var(--bg)",
                color: "var(--ink)",
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--bg)",
                  color: "var(--ink)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
                style={{ color: "var(--muted)" }}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPw ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fef2f2", color: "#dc2626" }}>
              {error}
            </p>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--pri)", color: "var(--onpri)" }}
          >
            {loading ? "Memproses…" : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

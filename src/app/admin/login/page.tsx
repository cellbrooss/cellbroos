"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("cellbross_admin_auth");
    if (auth === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem("cellbross_admin_auth", "true");
        router.push("/admin");
      } else {
        setError(data.error || "Geçersiz şifre!");
        setLoading(false);
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-100/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-900 transition-colors font-medium">
            ← Ana Sayfaya Dön
          </Link>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl border border-surface-200/80 p-8 sm:p-10 shadow-xl shadow-slate-100 relative overflow-hidden">
          {/* Top header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-md shadow-primary-500/10 mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">CellBroos Yönetim</h1>
            <p className="text-sm text-surface-500 font-medium mt-1">Yönetici panelinize erişmek için giriş yapın</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreyi girin"
                  className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 placeholder-surface-400 text-sm font-semibold transition-all outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-surface-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-surface-900/10"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Developer Hint */}
          <div className="mt-8 pt-6 border-t border-surface-100 text-center">
            <span className="text-[11px] text-surface-400 font-semibold bg-surface-50 border border-surface-200/50 px-3 py-1.5 rounded-lg inline-block">
              🔒 Güvenli Bağlantı: Panel erişimi şifrelenmiştir.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

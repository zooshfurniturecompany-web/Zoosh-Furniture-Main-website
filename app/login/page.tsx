"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // Lockout timer countdown
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.locked && data.waitSeconds) {
          setLockoutSeconds(data.waitSeconds);
        }
        setError(data.error || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // Successful login -> Redirect to dashboard
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError("Network error connecting to authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-white text-black font-serif font-bold text-2xl rounded-xl flex items-center justify-center mx-auto shadow-lg">
          Z
        </div>
        <h1 className="text-2xl font-serif font-light tracking-wide text-neutral-100">
          ZOOSH <span className="font-semibold">ADMIN</span>
        </h1>
        <p className="text-xs text-neutral-400 font-light">
          Private CMS & Catalog Management Portal
        </p>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            {lockoutSeconds && (
              <p className="text-[11px] text-red-400 font-semibold mt-1">
                Please wait {lockoutSeconds}s before attempting again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-medium mb-1.5 uppercase tracking-wider text-[10px]">
            Admin Username or Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@zoosh.in"
              disabled={loading || !!lockoutSeconds}
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-300 font-medium mb-1.5 uppercase tracking-wider text-[10px]">
            Admin Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading || !!lockoutSeconds}
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-800/90 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!lockoutSeconds}
          className="w-full mt-2 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 tracking-wider uppercase text-xs"
        >
          {loading ? (
            "Authenticating..."
          ) : lockoutSeconds ? (
            `Locked (${lockoutSeconds}s)`
          ) : (
            <>
              Sign In to Admin <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Badge & Public Link */}
      <div className="pt-4 border-t border-neutral-800/80 space-y-3 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Encrypted Session • Single Administrator Access</span>
        </div>

        <div>
          <a
            href="/"
            className="text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col justify-center items-center p-4 font-sans antialiased selection:bg-neutral-800">
      <Suspense fallback={<div className="text-neutral-500 text-xs">Loading secure login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

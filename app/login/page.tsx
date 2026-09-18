"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@zoosh.in");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    localStorage.setItem("zoosh_admin_email", email);
    localStorage.setItem("zoosh_admin_role", role);
    localStorage.setItem("zoosh_sales_email", email);
    localStorage.setItem("zoosh_sales_role", role);

    setTimeout(() => {
      router.push("/admin");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col justify-center items-center p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-white text-black font-serif font-bold text-2xl rounded-xl flex items-center justify-center mx-auto shadow-lg">
            Z
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">ZOOSH ADMIN</h1>
          <p className="text-xs text-neutral-400">Product Management & Storefront Control Panel</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zoosh.in"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="editor">Editor (Product Management)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Admin"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-center">
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

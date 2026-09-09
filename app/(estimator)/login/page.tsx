"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sales" | "admin">("sales");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill inputs based on active tab for developer/sales ease
  useEffect(() => {
    if (activeTab === "sales") {
      setEmail("sales@zoosh.com");
      setPassword("sales123");
    } else {
      setEmail("admin@zoosh.com");
      setPassword("admin123");
    }
    setError("");
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated short delay for authentication
    setTimeout(() => {
      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        setLoading(false);
        return;
      }

      // Store simulated session
      localStorage.setItem("zoosh_sales_email", email);
      localStorage.setItem("zoosh_sales_role", activeTab);

      router.push("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,50,50,0.15),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 text-white mb-4">
            <Layers className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white">ZOOSH FURNITURES</h1>
          <p className="text-xs text-neutral-400 mt-2 uppercase tracking-widest">Internal Price Estimator Portal</p>
        </div>

        {/* Card Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-neutral-800 mb-6 pb-1">
            <button
              onClick={() => setActiveTab("sales")}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === "sales"
                  ? "border-white text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Mail className="w-4 h-4" />
              Sales Rep
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === "admin"
                  ? "border-white text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-md p-3 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@zoosh.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Access Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black hover:bg-neutral-200 transition-all font-medium text-sm flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Estimator Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-center text-neutral-600 mt-6 tracking-wide uppercase">
          Confidential Internal Sales Tool · ZOOSH FURNITURES © 2026
        </p>
      </div>
    </div>
  );
}

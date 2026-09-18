"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Key,
  Server,
  Phone,
  Mail,
  MapPin,
  Info
} from "lucide-react";
import { adminDb, WebsiteSettings } from "@/lib/admin-db";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    contact_phone: "+91 95671 93992",
    whatsapp_number: "919567193992",
    email: "zooshfurniturecompany@gmail.com",
    address: "ZOOSH Factory Workshop, Pattambi, Palakkad, Kerala 679303",
    currency: "INR",
    default_seo_title: "ZOOSH | Premium Custom Solid Wood Furniture | Kerala",
    default_seo_description: "ZOOSH is a premium factory-direct custom furniture manufacturer based in Pattambi, Palakkad, Kerala."
  });

  const [savedMsg, setSavedMsg] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("admin@zoosh.in");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [s, sessionRes] = await Promise.all([
      adminDb.getSettings(),
      fetch("/api/auth/session").catch(() => null)
    ]);
    setSettings(s);

    if (sessionRes && sessionRes.ok) {
      const data = await sessionRes.json();
      if (data?.user?.email) {
        setCurrentAdminEmail(data.user.email);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminDb.saveSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
          Settings & Access Controls
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 mt-1">
          Manage storefront contact info, WhatsApp dispatch numbers, and private administrator credentials.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Website settings updated successfully!
        </div>
      )}

      {/* Website Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" /> General Storefront Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">WhatsApp Direct Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="919567193992"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Display Phone Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                placeholder="+91 95671 93992"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Contact Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="zooshfurniturecompany@gmail.com"
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Base Currency</label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 font-semibold mb-1">Factory Workshop Address</label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 font-semibold mb-1">Default SEO Meta Title</label>
          <input
            type="text"
            value={settings.default_seo_title}
            onChange={(e) => setSettings({ ...settings, default_seo_title: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
          />
        </div>

        <div>
          <label className="block text-neutral-700 font-semibold mb-1">Default SEO Meta Description</label>
          <textarea
            rows={2}
            value={settings.default_seo_description}
            onChange={(e) => setSettings({ ...settings, default_seo_description: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </button>
        </div>
      </form>

      {/* Single Private Admin Account Card */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Private Single Admin Account
          </h2>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] uppercase tracking-wider">
            Active & Protected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Configured Admin Email / Username</p>
            <p className="text-sm font-bold text-neutral-900 mt-0.5">{currentAdminEmail}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Access Privilege</p>
            <p className="text-sm font-bold text-neutral-900 mt-0.5">Master Administrator (Full Access)</p>
          </div>
        </div>

        <div className="p-4 bg-neutral-900 text-neutral-200 rounded-xl space-y-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Key className="w-4 h-4 text-amber-400" /> How to Update Admin Credentials Without Code Changes
          </div>
          <p className="text-neutral-300 leading-relaxed font-light">
            You can modify the admin email/username and password at any time in your hosting environment (e.g. Vercel Dashboard → Project Settings → Environment Variables) without modifying source code:
          </p>
          <div className="space-y-1.5 font-mono text-[11px] bg-black/60 p-3 rounded-lg border border-neutral-800 text-amber-300">
            <div>ADMIN_EMAIL = "your-email@zoosh.in"</div>
            <div>ADMIN_PASSWORD = "YourSecurePassword2026!"</div>
            <div>ADMIN_SESSION_SECRET = "your-secure-random-secret-key"</div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Info className="w-3.5 h-3.5" />
            <span>Changes take effect immediately upon saving environment variables on Vercel.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

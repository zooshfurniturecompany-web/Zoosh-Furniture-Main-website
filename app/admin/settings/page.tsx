"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Users,
  ShieldCheck,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { adminDb, WebsiteSettings, AdminUser } from "@/lib/admin-db";

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

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [savedMsg, setSavedMsg] = useState(false);

  // New User Form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor">("editor");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [s, u] = await Promise.all([
      adminDb.getSettings(),
      adminDb.getUsers()
    ]);
    setSettings(s);
    setUsers(u);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminDb.saveSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserEmail.trim()) {
      await adminDb.saveUser({
        email: newUserEmail.trim(),
        name: newUserName.trim() || "Team Member",
        role: newUserRole
      });
      setNewUserEmail("");
      setNewUserName("");
      load();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Remove user access?")) {
      await adminDb.deleteUser(id);
      load();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
          Settings & Access Controls
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 mt-1">
          Manage storefront contact info, WhatsApp dispatch numbers, and authorized admin team users.
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
            <label className="block text-neutral-700 font-semibold mb-1">WhatsApp Order & Inquiry Number</label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Direct format without + (e.g. 919567193992)</p>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Display Contact Phone</label>
            <input
              type="text"
              value={settings.contact_phone}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Official Company Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Workshop / Factory Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
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

      {/* Admin Users Management */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Authorized Admin Team Members
        </h2>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
          <input
            type="email"
            required
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="User email (e.g. member@zoosh.in)"
            className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900"
          />
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Member Name"
            className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900"
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value as any)}
            className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900"
          >
            <option value="admin">Admin (Full Access)</option>
            <option value="editor">Editor (Products Only)</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-neutral-800 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Access
          </button>
        </form>

        {/* Users Table */}
        <div className="divide-y divide-neutral-100">
          {users.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-100 font-bold text-neutral-800 flex items-center justify-center">
                  {u.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{u.name}</p>
                  <p className="text-[11px] text-neutral-500">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-neutral-100 text-neutral-700"
                }`}>
                  {u.role}
                </span>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                  title="Remove user"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

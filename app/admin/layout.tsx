"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Sparkles,
  TreePine,
  Image as ImageIcon,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Menu,
  X,
  Globe
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const sessionEmail = localStorage.getItem("zoosh_admin_email") || localStorage.getItem("zoosh_sales_email");
    const sessionRole = localStorage.getItem("zoosh_admin_role") || localStorage.getItem("zoosh_sales_role") || "admin";

    if (!sessionEmail && pathname !== "/login") {
      localStorage.setItem("zoosh_admin_email", "admin@zoosh.in");
      localStorage.setItem("zoosh_admin_role", "admin");
      setUserEmail("admin@zoosh.in");
      setUserRole("admin");
    } else {
      setUserEmail(sessionEmail || "admin@zoosh.in");
      setUserRole(sessionRole);
    }
  }, [pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("zoosh_admin_email");
    localStorage.removeItem("zoosh_admin_role");
    localStorage.removeItem("zoosh_sales_email");
    localStorage.removeItem("zoosh_sales_role");
    router.push("/login");
  };

  const navGroups = [
    {
      group: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      group: "Catalog",
      items: [
        { href: "/admin/products", label: "All Products", icon: <Package className="w-4 h-4" /> },
        { href: "/admin/products/new", label: "Add Product", icon: <PlusCircle className="w-4 h-4" /> },
        { href: "/admin/variants", label: "Product Variants", icon: <Sliders className="w-4 h-4" /> }
      ]
    },
    {
      group: "Organization",
      items: [
        { href: "/admin/categories", label: "Categories", icon: <FolderTree className="w-4 h-4" /> },
        { href: "/admin/collections", label: "Collections", icon: <Sparkles className="w-4 h-4" /> }
      ]
    },
    {
      group: "Specifications",
      items: [
        { href: "/admin/materials", label: "Materials", icon: <TreePine className="w-4 h-4" /> }
      ]
    },
    {
      group: "Assets",
      items: [
        { href: "/admin/media", label: "Media Library", icon: <ImageIcon className="w-4 h-4" /> }
      ]
    },
    {
      group: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/admin/products?search=" + encodeURIComponent(searchQuery.trim()));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans flex flex-col md:flex-row antialiased">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 sticky top-0 h-screen z-30">
        <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-serif text-lg font-bold">
              Z
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight font-semibold block leading-none">ZOOSH</span>
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">Product Backend</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                {grp.group}
              </p>
              {grp.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href) && item.href !== "/admin/products/new");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-black text-white shadow-sm font-semibold"
                        : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-neutral-500"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-100 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              View Public Website
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </a>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-bold">
                {userEmail?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate max-w-[110px]">{userEmail}</p>
                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  {userRole}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div className="md:hidden bg-white border-b border-neutral-200 sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center font-serif text-sm font-bold">
            Z
          </div>
          <span className="font-serif font-bold text-lg">ZOOSH</span>
          <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-medium">ADMIN</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="p-2 text-neutral-600 hover:text-black"
            title="View Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-neutral-700 rounded-md hover:bg-neutral-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white z-40 overflow-y-auto p-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {grp.group}
              </p>
              {grp.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-xs text-neutral-500">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="hidden md:flex h-16 bg-white border-b border-neutral-200 px-8 items-center justify-between sticky top-0 z-20">
          <form onSubmit={handleGlobalSearch} className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products by SKU, name, wood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
            />
          </form>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Product
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Coins, 
  TrendingDown, 
  Truck, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon,
  Sun,
  Moon,
  Menu,
  X,
  Wallet,
  ShieldCheck,
  DollarSign,
  Route,
  Compass,
  FileText
} from "lucide-react";
import { FcsProvider, useFcs } from "./context";

function FcsLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { kpis, isMock } = useFcs();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark mode initial check
  useEffect(() => {
    const savedTheme = localStorage.getItem("zoosh_fcs_theme");
    const initialDark = savedTheme !== "light"; // default to dark
    setDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("zoosh_fcs_theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Refactored business-friendly navigation links
  const navLinks = [
    { href: "/fcs", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/fcs/companystatus", label: "Company Money Status", icon: <Compass className="w-5 h-5" /> },
    { href: "/fcs/moneytrail", label: "Money Trail", icon: <Coins className="w-5 h-5" /> },
    { href: "/fcs/clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
    { href: "/fcs/projects", label: "Project Money", icon: <Briefcase className="w-5 h-5" /> },
    { href: "/fcs/payments", label: "Project Funds", icon: <Wallet className="w-5 h-5" /> },
    { href: "/fcs/expenses", label: "Add Expense", icon: <TrendingDown className="w-5 h-5" /> },
    { href: "/fcs/suppliers", label: "Supplier History", icon: <Truck className="w-5 h-5" /> },
    { href: "/fcs/cashbook", label: "Money In & Out", icon: <BookOpen className="w-5 h-5" /> },
    { href: "/fcs/reports", label: "Business Reports", icon: <FileText className="w-5 h-5" /> },
    { href: "/fcs/settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const isLinkActive = (href: string) => {
    if (href === "/fcs") {
      return pathname === "/fcs";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      darkMode ? "bg-[#09090b] text-[#fafafa]" : "bg-neutral-50 text-neutral-900"
    }`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-30 border-b flex items-center h-16 px-4 sm:px-6 justify-between backdrop-blur-md transition-colors ${
        darkMode ? "bg-[#09090b]/80 border-neutral-800" : "bg-white/80 border-neutral-200"
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-neutral-500/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 stroke-[1.5] text-emerald-500 animate-pulse" />
            <Link href="/fcs" className="text-sm sm:text-base font-bold tracking-wider hover:opacity-85 transition-opacity">
              ZOOSH <span className="font-light text-neutral-400 text-xs sm:text-sm">MONEY MANAGER</span>
            </Link>
          </div>
          
          {isMock && (
            <span className="hidden lg:inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Demo Mode
            </span>
          )}
        </div>

        {/* Global Financial Control Strip in Plain Business English */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Money in Bank</span>
            <span className="text-emerald-500 font-semibold">{formatINR(kpis.currentBankBalance)}</span>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Money Reserved for Projects</span>
            <span className="text-amber-500 font-semibold">{formatINR(kpis.committedCash)}</span>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Money Safe to Spend</span>
            <span className={`font-semibold ${kpis.actuallyAvailableCash < 0 ? "text-rose-500 animate-pulse" : "text-sky-500"}`}>
              {formatINR(kpis.actuallyAvailableCash)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              darkMode 
                ? "border-neutral-800 hover:bg-neutral-900 text-neutral-300" 
                : "border-neutral-200 hover:bg-neutral-100 text-neutral-700"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            CRM Estimator
          </Link>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-colors ${
              darkMode ? "border-neutral-800 hover:bg-neutral-800 text-neutral-400" : "border-neutral-200 hover:bg-neutral-100 text-neutral-600"
            }`}
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR - DESKTOP */}
        <aside className={`hidden md:block w-64 border-r shrink-0 overflow-y-auto transition-colors ${
          darkMode ? "bg-[#09090b] border-neutral-800" : "bg-white border-neutral-200"
        }`}>
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                    active 
                      ? (darkMode ? "bg-white text-black font-semibold shadow-md" : "bg-black text-white font-semibold shadow-md") 
                      : (darkMode ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-neutral-600 hover:text-black hover:bg-neutral-100")
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* SIDEBAR - MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm">
            <div className={`w-72 max-w-sm flex flex-col h-full shadow-xl transition-colors ${
              darkMode ? "bg-[#09090b] text-[#fafafa]" : "bg-white text-neutral-900"
            }`}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold tracking-wider text-xs">ZOOSH MONEY</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-neutral-500/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-neutral-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Money in Bank:</span>
                  <span className="text-emerald-500 font-semibold">{formatINR(kpis.currentBankBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Money Reserved:</span>
                  <span className="text-amber-500 font-semibold">{formatINR(kpis.committedCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Safe to Spend:</span>
                  <span className={`font-semibold ${kpis.actuallyAvailableCash < 0 ? "text-rose-500" : "text-sky-500"}`}>
                    {formatINR(kpis.actuallyAvailableCash)}
                  </span>
                </div>
              </div>
              <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                        active 
                          ? (darkMode ? "bg-white text-black font-semibold" : "bg-black text-white font-semibold") 
                          : (darkMode ? "text-neutral-400 hover:text-white hover:bg-neutral-900" : "text-neutral-600 hover:text-black hover:bg-neutral-100")
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-800">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-md text-xs font-semibold border border-neutral-800 hover:bg-neutral-900 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open CRM Estimator
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function FcsLayout({ children }: { children: React.ReactNode }) {
  return (
    <FcsProvider>
      <FcsLayoutContent>{children}</FcsLayoutContent>
    </FcsProvider>
  );
}

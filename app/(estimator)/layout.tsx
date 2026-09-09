"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  ShieldAlert, 
  LogOut, 
  Layers,
  Sun,
  Moon
} from "lucide-react";

export default function EstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Load user session
  useEffect(() => {
    const sessionEmail = localStorage.getItem("zoosh_sales_email");
    const sessionRole = localStorage.getItem("zoosh_sales_role");
    
    if (!sessionEmail && pathname !== "/login") {
      router.push("/login");
    } else {
      setUserEmail(sessionEmail);
      setIsAdmin(sessionRole === "admin");
    }
  }, [pathname, router]);

  // Dark mode initial check and body class update
  useEffect(() => {
    const savedTheme = localStorage.getItem("zoosh_estimator_theme");
    const initialDark = savedTheme !== "light"; // default to dark mode for luxury aesthetic
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
    localStorage.setItem("zoosh_estimator_theme", nextDark ? "dark" : "light");
    
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("zoosh_sales_email");
    localStorage.removeItem("zoosh_sales_role");
    router.push("/login");
  };

  // If currently on login page, do not render layout navigation chrome
  if (pathname === "/login") {
    return <div className="min-h-screen bg-neutral-950 text-white font-sans">{children}</div>;
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/new", label: "New Estimate", icon: <PlusCircle className="w-5 h-5" /> },
    { href: "/history", label: "History", icon: <History className="w-5 h-5" /> },
    { href: "/fcs", label: "FCS Financials", icon: <Layers className="w-5 h-5" /> },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin Panel", icon: <ShieldAlert className="w-5 h-5" /> });
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${darkMode ? "bg-neutral-950 text-white" : "bg-neutral-50 text-neutral-900"}`}>
      {/* Upper Navigation Header */}
      <header className={`border-b transition-colors duration-200 ${darkMode ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-neutral-200"} sticky top-0 z-40 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 stroke-[1.5]" />
            <Link href="/dashboard" className="text-lg font-semibold tracking-wider hover:opacity-80 transition-opacity">
              ZOOSH <span className="font-light text-neutral-400">ESTIMATOR</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    active 
                      ? (darkMode ? "bg-white text-black" : "bg-black text-white") 
                      : (darkMode ? "text-neutral-400 hover:text-white hover:bg-neutral-800" : "text-neutral-600 hover:text-black hover:bg-neutral-100")
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                darkMode ? "border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white" : "border-neutral-200 hover:bg-neutral-100 text-neutral-600 hover:text-black"
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {userEmail && (
              <div className="flex items-center gap-3 border-l pl-4 border-neutral-700/50">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold">{userEmail}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{isAdmin ? "Admin Role" : "Sales Agent"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-md border text-red-500 hover:bg-red-500/10 border-red-500/20 transition-colors`}
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 transition-colors duration-200 ${
        darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
      }`}>
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  active 
                    ? (darkMode ? "text-white" : "text-black") 
                    : (darkMode ? "text-neutral-500" : "text-neutral-400")
                }`}
              >
                {link.icon}
                <span className="text-[10px] mt-1 font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}

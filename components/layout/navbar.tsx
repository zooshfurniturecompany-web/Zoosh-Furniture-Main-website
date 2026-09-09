"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Send, ShoppingBag } from "lucide-react";
import { getGeneralWhatsAppLink } from "@/hooks/use-products";

// Configured mega-menu structure matching ZOOSH categories
const rooms = [
  {
    name: "Living",
    slug: "living",
    image: "/images/catalog/page_14_img_00.webp",
    subcategories: [
      { name: "Sofas", slug: "sofas" },
      { name: "Lounge Chairs", slug: "lounge-chairs" },
      { name: "Arm Chairs", slug: "arm-chairs" },
      { name: "Centre Tables", slug: "centre-tables" },
      { name: "Side Tables", slug: "side-tables" },
      { name: "Console Tables", slug: "console-tables" }
    ]
  },
  {
    name: "Dining",
    slug: "dining",
    image: "/images/catalog/page_21_img_00.webp",
    subcategories: [
      { name: "Dining Tables", slug: "dining-tables" },
      { name: "Dining Chairs", slug: "dining-chairs" },
      { name: "Dining Benches", slug: "dining-benches" },
      { name: "Bar Stools", slug: "bar-stools" }
    ]
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    image: "/images/catalog/page_22_img_00.webp",
    subcategories: [
      { name: "Bed Cots", slug: "bed-cots" },
      { name: "Bedside Tables", slug: "bedside-tables" },
      { name: "Bedroom Chairs", slug: "bedroom-chairs" },
      { name: "Benches", slug: "benches" }
    ]
  },
  {
    name: "Entryway",
    slug: "entryway",
    image: "/images/catalog/page_27_img_00.webp",
    subcategories: [
      { name: "Console Tables", slug: "console-tables" },
      { name: "Mirror Units", slug: "mirror-units" },
      { name: "Benches", slug: "benches" }
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [activeMobileRoom, setActiveMobileRoom] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setHoveredRoom(null);
    setSearchOpen(false);
  }, [pathname]);

  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isTransparent = false;

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white text-black"
        onMouseLeave={() => setHoveredRoom(null)}
      >

        {/* =====================================================
            ROW 1 — LOGO + MAIN NAVIGATION (DESKTOP GRID / MOBILE FLEX)
            ===================================================== */}
        <div className="h-[50px] border-b border-neutral-100">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center w-full h-full px-[5%]">
            
            {/* LEFT: LOGO */}
            <div className="flex justify-start items-center">
              <Link href="/" className="flex items-center shrink-0">
                <span className="font-serif text-[28px] md:text-[30px] font-light tracking-[-0.02em] leading-none text-black">
                  ZOOSH
                </span>
              </Link>
            </div>

            {/* CENTER: MAIN NAVIGATION */}
            <nav className="flex justify-center items-center h-full">
              <div className="flex items-center gap-[32px] lg:gap-[38px] h-full">
                <Link
                  href="/gallery"
                  className="text-[11px] uppercase tracking-[0.16em] font-light text-neutral-500 hover:text-black transition-colors duration-200 whitespace-nowrap"
                >
                  Projects
                </Link>

                <Link
                  href="/custom"
                  className="text-[11px] uppercase tracking-[0.16em] font-light text-neutral-500 hover:text-black transition-colors duration-200 whitespace-nowrap"
                >
                  Custom Furniture
                </Link>

                <Link
                  href="/about"
                  className="text-[11px] uppercase tracking-[0.16em] font-light text-neutral-500 hover:text-black transition-colors duration-200 whitespace-nowrap"
                >
                  Our Story
                </Link>

                <Link
                  href="/contact"
                  className="text-[11px] uppercase tracking-[0.16em] font-light text-neutral-500 hover:text-black transition-colors duration-200 whitespace-nowrap"
                >
                  Contact
                </Link>

                {/* SEARCH */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                  className="flex items-center justify-center text-neutral-500 hover:text-black transition-colors duration-200"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </button>
              </div>
            </nav>

            {/* RIGHT: WHATSAPP */}
            <div className="flex justify-end items-center">
              <a
                href={customEnquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[34px] px-[18px] border border-neutral-800 flex items-center justify-center text-[10px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-black hover:text-white transition-all duration-200 whitespace-nowrap"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Mobile Flex Layout (DTALEMODERN Style) */}
          <div className="flex md:hidden items-center justify-between w-full h-full px-4">
            {/* LEFT: HAMBURGER BUTTON */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-8 h-8 text-black"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>

            {/* CENTER: LOGO */}
            <Link href="/" className="flex items-center">
              <span className="font-serif text-[24px] font-light tracking-[-0.02em] leading-none text-black">
                ZOOSH
              </span>
            </Link>

            {/* RIGHT: SEARCH & BAG/WHATSAPP */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="flex items-center justify-center text-black"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              <a
                href={customEnquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Enquiry"
                className="flex items-center justify-center text-black"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>


      {/* =====================================================
          ROW 2 — FURNITURE CATEGORIES (HORIZONTAL SCROLL ON MOBILE)
          ===================================================== */}
      <div className="h-[34px] bg-black text-white overflow-x-auto no-scrollbar">
        <nav className="max-w-[1280px] h-full mx-auto px-4 md:px-8 flex items-center justify-start md:justify-center">

          <div className="flex items-center gap-4 sm:gap-6 md:gap-[38px] lg:gap-[50px] h-full whitespace-nowrap text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] font-light">

            {/* NEW / COLLECTION */}
            <div className="relative h-full flex items-center shrink-0">
              <Link
                href="/collection"
                className={`transition-colors duration-200 ${
                  pathname === "/collection" ? "text-amber-400 font-normal" : "text-neutral-300 hover:text-white"
                }`}
              >
                New
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* LIVING */}
            <div
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setHoveredRoom("living")}
            >
              <Link
                href="/living"
                className={`group flex items-center gap-[4px] transition-colors duration-200 ${
                  pathname.startsWith("/living") ? "text-amber-400 font-normal" : "text-neutral-200 hover:text-white"
                }`}
              >
                Living
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mt-[1px] text-neutral-400 group-hover:text-white transition-colors"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* DINING */}
            <div
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setHoveredRoom("dining")}
            >
              <Link
                href="/dining"
                className={`group flex items-center gap-[4px] transition-colors duration-200 ${
                  pathname.startsWith("/dining") ? "text-amber-400 font-normal" : "text-neutral-200 hover:text-white"
                }`}
              >
                Dining
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mt-[1px] text-neutral-400 group-hover:text-white transition-colors"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* BEDROOM */}
            <div
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setHoveredRoom("bedroom")}
            >
              <Link
                href="/bedroom"
                className={`group flex items-center gap-[4px] transition-colors duration-200 ${
                  pathname.startsWith("/bedroom") ? "text-amber-400 font-normal" : "text-neutral-200 hover:text-white"
                }`}
              >
                Bed
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mt-[1px] text-neutral-400 group-hover:text-white transition-colors"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* ENTRYWAY */}
            <div
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setHoveredRoom("entryway")}
            >
              <Link
                href="/entryway"
                className={`group flex items-center gap-[4px] transition-colors duration-200 ${
                  pathname.startsWith("/entryway") ? "text-amber-400 font-normal" : "text-neutral-200 hover:text-white"
                }`}
              >
                Entryway
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="mt-[1px] text-neutral-400 group-hover:text-white transition-colors"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* CUSTOM */}
            <div className="relative h-full flex items-center shrink-0">
              <Link
                href="/custom"
                className={`transition-colors duration-200 ${
                  pathname === "/custom" ? "text-amber-400 font-normal" : "text-neutral-300 hover:text-white"
                }`}
              >
                Custom
              </Link>
              <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
            </div>

            {/* PROJECTS */}
            <div className="relative h-full flex items-center shrink-0">
              <Link
                href="/gallery"
                className={`transition-colors duration-200 ${
                  pathname === "/gallery" ? "text-amber-400 font-normal" : "text-neutral-300 hover:text-white"
                }`}
              >
                Projects
              </Link>
            </div>

          </div>
        </nav>
      </div>

      {/* SEARCH PANEL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 py-4 px-[5%] shadow-md z-40"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-4">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow border-b border-neutral-300 py-2 focus:outline-none focus:border-black text-sm font-sans font-light"
                autoFocus
              />
              <button type="submit" className="text-xs uppercase tracking-wider font-medium text-neutral-500 hover:text-black">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-black">
                <X size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Mega-menu Dropdown Panel */}
      <AnimatePresence>
        {hoveredRoom && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-md overflow-hidden hidden md:block z-40"
            onMouseEnter={() => setHoveredRoom(hoveredRoom)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <div className="max-w-[1280px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              {/* Left Column: Subcategories */}
              <div className="col-span-8">
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold block mb-4">
                  Shop by Category
                </span>
                <div className="grid grid-cols-3 gap-6">
                  {rooms.find(r => r.slug === hoveredRoom)?.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${hoveredRoom}/${sub.slug}`}
                      className="text-xs text-neutral-600 hover:text-black transition-colors py-1 block font-light"
                      onClick={() => setHoveredRoom(null)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column: Room image card */}
              <div className="col-span-4 border-l border-neutral-100 pl-8 flex flex-col justify-between">
                <div className="relative aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={rooms.find(r => r.slug === hoveredRoom)?.image || "/images/catalog/page_14_img_00.webp"}
                    alt={hoveredRoom}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-750"
                  />
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <span className="text-xs font-serif text-neutral-900 capitalize">
                    Explore {hoveredRoom} Collection
                  </span>
                  <Link
                    href={`/${hoveredRoom}`}
                    className="text-[10px] uppercase tracking-wider font-semibold text-black border-b border-black pb-0.5"
                    onClick={() => setHoveredRoom(null)}
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute top-0 right-0 bottom-0 w-[80%] bg-white p-6 flex flex-col justify-between shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-8 mt-12">
                <span className="font-serif text-[10px] tracking-[0.3em] uppercase text-neutral-400 border-b border-neutral-100 pb-3 block">
                  Shop by Space
                </span>
                
                <div className="flex flex-col space-y-4">
                  {rooms.map((room) => (
                    <div key={room.slug} className="border-b border-neutral-50 pb-2">
                      <Link
                        href={`/${room.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="w-full flex justify-between items-center text-base font-serif text-neutral-800 hover:text-black py-1 animate-fade-in"
                      >
                        <span>{room.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-4 pt-4 border-t border-neutral-100">
                  <Link
                    href="/gallery"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-serif text-neutral-800 hover:text-black"
                  >
                    Completed Projects
                  </Link>
                  <Link
                    href="/custom"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-serif text-neutral-800 hover:text-black"
                  >
                    Custom Furniture
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-serif text-neutral-800 hover:text-black"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-serif text-neutral-800 hover:text-black"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <a
                  href={customEnquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-black text-white text-xs tracking-[0.2em] uppercase py-4 font-light"
                >
                  <Send size={12} />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  </>
);
}

function ArrowRightIcon() {
  return (
    <svg 
      className="ml-1.5 w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

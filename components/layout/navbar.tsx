"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight, Search, Send, ShoppingBag } from "lucide-react";
import { getGeneralWhatsAppLink } from "@/hooks/use-products";
import { useCart } from "@/components/cart/cart-context";

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
  const router = useRouter();
  const { openCart, totalCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setHoveredRoom(null);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (isOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, searchOpen]);

  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleRoomAccordion = (slug: string) => {
    setExpandedRoom((prev) => (prev === slug ? null : slug));
  };

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
                  className={`text-[11px] uppercase tracking-[0.16em] font-light transition-colors duration-200 whitespace-nowrap ${
                    pathname === "/gallery" ? "text-black font-normal" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Projects
                </Link>

                <Link
                  href="/custom"
                  className={`text-[11px] uppercase tracking-[0.16em] font-light transition-colors duration-200 whitespace-nowrap ${
                    pathname === "/custom" ? "text-black font-normal" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Custom Furniture
                </Link>

                <Link
                  href="/about"
                  className={`text-[11px] uppercase tracking-[0.16em] font-light transition-colors duration-200 whitespace-nowrap ${
                    pathname === "/about" ? "text-black font-normal" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Our Story
                </Link>

                <Link
                  href="/contact"
                  className={`text-[11px] uppercase tracking-[0.16em] font-light transition-colors duration-200 whitespace-nowrap ${
                    pathname === "/contact" ? "text-black font-normal" : "text-neutral-500 hover:text-black"
                  }`}
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
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </div>
            </nav>

            {/* RIGHT: WHATSAPP + CART */}
            <div className="flex justify-end items-center gap-3">
              <a
                href={customEnquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[34px] px-[18px] border border-neutral-800 flex items-center justify-center text-[10px] uppercase tracking-[0.16em] text-neutral-700 hover:bg-black hover:text-white transition-all duration-200 whitespace-nowrap"
              >
                WhatsApp
              </a>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative h-[34px] px-2.5 flex items-center justify-center text-black hover:opacity-75 transition-opacity"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-sans font-medium w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Flex Layout (3-Zone Header) */}
          <div className="flex md:hidden items-center justify-between w-full h-full px-4">
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 -ml-1 text-black active:scale-95 transition-transform"
              aria-label="Toggle menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Centered Brand Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-serif text-[24px] font-light tracking-[-0.02em] leading-none text-black">
                ZOOSH
              </span>
            </Link>

            {/* Search + Cart */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex items-center justify-center w-9 h-9 text-black active:scale-95"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label="Shopping Cart"
                className="relative flex items-center justify-center w-9 h-9 text-black active:scale-95"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalCount > 0 && (
                  <span className="absolute 1 top-0.5 right-0.5 bg-black text-white text-[8px] font-medium w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            ROW 2 — SECONDARY CATEGORY SUB-NAV (BLACK BAR)
            ===================================================== */}
        <div className="h-[34px] bg-black text-white overflow-x-auto no-scrollbar">
          <nav className="max-w-[1280px] h-full mx-auto px-4 md:px-8 flex items-center justify-start md:justify-center">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-[38px] lg:gap-[50px] h-full whitespace-nowrap text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] font-light">
              
              {/* New / Collection */}
              <div className="relative h-full flex items-center shrink-0">
                <Link
                  href="/collection"
                  className={`transition-colors duration-200 ${
                    pathname === "/collection" ? "text-white font-normal" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  New
                </Link>
                <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
              </div>

              {/* Rooms with Hover Dropdown */}
              {rooms.map((room, idx) => (
                <div
                  key={room.slug}
                  className="relative h-full flex items-center shrink-0"
                  onMouseEnter={() => setHoveredRoom(room.slug)}
                >
                  <Link
                    href={`/${room.slug}`}
                    className={`group flex items-center gap-[4px] transition-colors duration-200 ${
                      pathname.startsWith(`/${room.slug}`) ? "text-white font-normal" : "text-neutral-200 hover:text-white"
                    }`}
                  >
                    <span>{room.name === "Bedroom" ? "Bed" : room.name}</span>
                    <ChevronDown size={10} className="mt-[1px] text-neutral-400 group-hover:text-white transition-colors" />
                  </Link>
                  <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
                </div>
              ))}

              {/* Custom */}
              <div className="relative h-full flex items-center shrink-0">
                <Link
                  href="/custom"
                  className={`transition-colors duration-200 ${
                    pathname === "/custom" ? "text-white font-normal" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Custom
                </Link>
                <span className="text-neutral-600 ml-4 hidden sm:inline">•</span>
              </div>

              {/* Projects */}
              <div className="relative h-full flex items-center shrink-0">
                <Link
                  href="/gallery"
                  className={`transition-colors duration-200 ${
                    pathname === "/gallery" ? "text-white font-normal" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Projects
                </Link>
              </div>

            </div>
          </nav>
        </div>

        {/* SEARCH OVERLAY PANEL */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 py-4 px-4 sm:px-[5%] shadow-md z-40"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3 sm:gap-4">
                <Search size={18} className="text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, wood, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow border-b border-neutral-300 py-2 focus:outline-none focus:border-black text-sm font-sans font-light"
                  autoFocus
                />
                <button type="submit" className="text-xs uppercase tracking-wider font-medium text-neutral-700 hover:text-black shrink-0 px-2 py-1">
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-black p-1">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mega-menu Dropdown Panel (Desktop) */}
        <AnimatePresence>
          {hoveredRoom && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl overflow-hidden hidden md:block z-40"
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
                      className="object-cover hover:scale-105 transition-transform duration-700"
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

        {/* Mobile Slide-Out Drawer Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.28 }}
                className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white flex flex-col justify-between shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                  <span className="font-serif text-xl font-light tracking-tight text-neutral-900">
                    ZOOSH
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-neutral-500 hover:text-black"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <div className="p-5 space-y-6 flex-1 overflow-y-auto">
                  <div className="space-y-1">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-semibold block mb-2">
                      Furniture Collections
                    </span>
                    
                    <Link
                      href="/collection"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-sm font-sans font-medium text-neutral-900 hover:text-black"
                    >
                      All Collections (New)
                    </Link>

                    {/* Room Accordions */}
                    {rooms.map((room) => {
                      const isExp = expandedRoom === room.slug;
                      return (
                        <div key={room.slug} className="border-b border-neutral-50 py-1.5">
                          <button
                            type="button"
                            onClick={() => toggleRoomAccordion(room.slug)}
                            className="w-full flex items-center justify-between py-2 text-sm font-sans text-neutral-800 hover:text-black text-left"
                          >
                            <span>{room.name}</span>
                            <ChevronDown
                              size={14}
                              className={`text-neutral-400 transition-transform ${isExp ? "rotate-180" : ""}`}
                            />
                          </button>

                          {isExp && (
                            <div className="pl-3 py-1.5 space-y-1.5 border-l border-neutral-200 ml-1">
                              <Link
                                href={`/${room.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block text-xs font-sans text-neutral-500 hover:text-black py-1 font-medium"
                              >
                                All {room.name}
                              </Link>
                              {room.subcategories.map((sub) => (
                                <Link
                                  key={sub.slug}
                                  href={`/${room.slug}/${sub.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block text-xs font-sans text-neutral-500 hover:text-black py-1"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-semibold block mb-1">
                      Company
                    </span>
                    <Link
                      href="/custom"
                      onClick={() => setIsOpen(false)}
                      className="block text-xs font-sans text-neutral-700 hover:text-black py-1"
                    >
                      Custom Blueprints & Sizing
                    </Link>
                    <Link
                      href="/gallery"
                      onClick={() => setIsOpen(false)}
                      className="block text-xs font-sans text-neutral-700 hover:text-black py-1"
                    >
                      Completed Projects
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block text-xs font-sans text-neutral-700 hover:text-black py-1"
                    >
                      Our Story & Factory
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="block text-xs font-sans text-neutral-700 hover:text-black py-1"
                    >
                      Contact & Workshop
                    </Link>
                  </div>
                </div>

                {/* Drawer Footer WhatsApp CTA */}
                <div className="p-5 border-t border-neutral-100 bg-neutral-50">
                  <a
                    href={customEnquiryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-black text-white text-xs tracking-[0.2em] uppercase py-3.5 font-medium shadow-xs"
                  >
                    <Send size={12} />
                    <span>WhatsApp Concierge</span>
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

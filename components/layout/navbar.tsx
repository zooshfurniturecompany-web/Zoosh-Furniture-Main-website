"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight, Search, Send, ShoppingBag, Phone } from "lucide-react";
import { getGeneralWhatsAppLink } from "@/hooks/use-products";
import { useCart } from "@/components/cart/cart-context";

// Defined room categories matching ZOOSH catalog
const rooms = [
  {
    name: "Living",
    slug: "living",
    image: "/images/catalog/page_14_img_00.webp",
    subcategories: [
      { name: "All Living", slug: "" },
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
      { name: "All Dining", slug: "" },
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
      { name: "All Bedroom", slug: "" },
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
      { name: "All Entryway", slug: "" },
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
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [isShopExpanded, setIsShopExpanded] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
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
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md text-black border-b border-neutral-100 transition-all duration-300"
        onMouseLeave={() => setHoveredRoom(null)}
      >
        {/* Announcement Ticker */}
        <div className="bg-black text-white text-[9px] sm:text-[10.5px] font-sans tracking-[0.18em] uppercase py-2 px-4 text-center border-b border-neutral-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 truncate">
            <span className="truncate">Bespoke Hardwood Furniture • Pattambi Workshop • Pan-India Delivery</span>
            <Link href="/custom" className="underline hover:opacity-80 transition-opacity hidden md:inline font-medium">
              Custom Blueprints
            </Link>
          </div>
        </div>

        {/* =====================================================
            TOP BAR: DESKTOP & MOBILE HEADER
            ===================================================== */}
        <div className="h-[60px] md:h-[68px] max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          
          {/* LEFT: MOBILE HAMBURGER / DESKTOP LOGO */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger (Min 44px touch target) */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex md:hidden items-center justify-center w-11 h-11 -ml-2 text-neutral-900 active:scale-95 transition-transform"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop Brand Logo */}
            <Link href="/" className="hidden md:flex items-center shrink-0">
              <span className="font-serif text-[28px] lg:text-[30px] font-light tracking-[-0.02em] leading-none text-black">
                ZOOSH
              </span>
            </Link>
          </div>

          {/* CENTER: MOBILE LOGO / DESKTOP NAVIGATION */}
          {/* Mobile Center Logo */}
          <Link href="/" className="flex md:hidden items-center justify-center">
            <span className="font-serif text-[24px] font-light tracking-[-0.02em] leading-none text-black">
              ZOOSH
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
            <Link
              href="/collection"
              className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
                pathname === "/collection" ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
              }`}
            >
              Catalog
            </Link>

            {/* Spaces with Dropdowns */}
            {rooms.map((room) => (
              <div
                key={room.slug}
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredRoom(room.slug)}
              >
                <Link
                  href={`/${room.slug}`}
                  className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors flex items-center gap-1 ${
                    pathname.startsWith(`/${room.slug}`) ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <span>{room.name}</span>
                  <ChevronDown size={12} className="text-neutral-400 mt-[-1px]" />
                </Link>
              </div>
            ))}

            <Link
              href="/custom"
              className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
                pathname === "/custom" ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
              }`}
            >
              Custom
            </Link>

            <Link
              href="/gallery"
              className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
                pathname === "/gallery" ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
              }`}
            >
              Projects
            </Link>

            <Link
              href="/about"
              className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
                pathname === "/about" ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
              }`}
            >
              Our Story
            </Link>

            <Link
              href="/contact"
              className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
                pathname === "/contact" ? "text-black border-b border-black pb-0.5" : "text-neutral-600 hover:text-black"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* RIGHT: SEARCH, WHATSAPP, SHOPPING BAG */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search Button (44px touch target) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
              className="flex items-center justify-center w-11 h-11 text-neutral-800 hover:text-black active:scale-95 transition-all"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop WhatsApp Concierge Button */}
            <a
              href={customEnquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-medium py-2 px-3.5 border border-neutral-900 text-neutral-900 hover:bg-black hover:text-white transition-all"
            >
              <Send size={11} />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Bag Button (44px touch target) */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative flex items-center justify-center w-11 h-11 -mr-2 text-neutral-800 hover:text-black active:scale-95 transition-all"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {totalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            DESKTOP MEGA-MENU DROPDOWN PANEL
            ===================================================== */}
        <AnimatePresence>
          {hoveredRoom && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl overflow-hidden hidden md:block z-40"
              onMouseEnter={() => setHoveredRoom(hoveredRoom)}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              <div className="max-w-7xl mx-auto px-12 py-8 grid grid-cols-12 gap-10">
                {/* Left: Subcategories List */}
                <div className="col-span-8">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                      Shop {rooms.find(r => r.slug === hoveredRoom)?.name} Category
                    </span>
                    <Link
                      href={`/${hoveredRoom}`}
                      className="text-[10px] uppercase tracking-widest font-semibold text-black hover:opacity-70 border-b border-black pb-0.5"
                      onClick={() => setHoveredRoom(null)}
                    >
                      View All {rooms.find(r => r.slug === hoveredRoom)?.name} &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-y-3 gap-x-6">
                    {rooms
                      .find(r => r.slug === hoveredRoom)
                      ?.subcategories.filter(s => s.slug !== "")
                      .map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${hoveredRoom}/${sub.slug}`}
                          className="text-xs text-neutral-700 hover:text-black hover:translate-x-1 transition-all py-1 font-light"
                          onClick={() => setHoveredRoom(null)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Right: Featured Room Space Card */}
                <div className="col-span-4 border-l border-neutral-100 pl-8 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={rooms.find(r => r.slug === hoveredRoom)?.image || "/images/catalog/page_14_img_00.webp"}
                      alt={hoveredRoom}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-3">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                      Bespoke Hardwood
                    </span>
                    <h4 className="font-serif text-sm text-neutral-900">
                      Handcrafted {rooms.find(r => r.slug === hoveredRoom)?.name} Designs
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================
          MOBILE FULL-HEIGHT NAVIGATION DRAWER (HOMEWORK LIVING UX)
          ===================================================== */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Drawer from Left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-[85%] max-w-[360px] bg-white h-full shadow-2xl z-10 flex flex-col justify-between"
            >
              {/* Drawer Top Header */}
              <div className="h-[60px] px-5 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-serif text-[22px] font-light tracking-[-0.02em] text-black">
                  ZOOSH
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 -mr-2 flex items-center justify-center text-neutral-600 hover:text-black rounded-full active:bg-neutral-100"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Navigation Links Tree */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                
                {/* Search Shortcut in Mobile Menu */}
                <div className="pt-1 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-3 py-3 px-3.5 bg-neutral-50 border border-neutral-200 text-neutral-400 text-xs font-light font-sans rounded-xs"
                  >
                    <Search size={15} />
                    <span>Search furniture, teakwood...</span>
                  </button>
                </div>

                {/* Categories / Room Trees */}
                <div className="space-y-1">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium px-1 mb-2">
                    Shop by Space
                  </div>

                  {/* All Catalog Link */}
                  <Link
                    href="/collection"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3 px-2 text-sm font-sans font-medium text-neutral-900 border-b border-neutral-100 hover:text-neutral-600"
                  >
                    <span>All Collections</span>
                    <ChevronRight size={14} className="text-neutral-400" />
                  </Link>

                  {/* Accordion Spaces */}
                  {rooms.map((room) => {
                    const isExpanded = expandedRoom === room.slug;
                    return (
                      <div key={room.slug} className="border-b border-neutral-100">
                        <button
                          type="button"
                          onClick={() => toggleRoomAccordion(room.slug)}
                          className="w-full flex items-center justify-between py-3.5 px-2 text-sm font-sans font-medium text-neutral-900 text-left"
                        >
                          <span>{room.name}</span>
                          <ChevronDown
                            size={16}
                            className={`text-neutral-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-black" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-neutral-50/80 px-4 py-2 space-y-2 mb-2 rounded-xs"
                            >
                              <Link
                                href={`/${room.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block py-1.5 text-xs font-semibold text-black uppercase tracking-wider"
                              >
                                View All {room.name} &rarr;
                              </Link>
                              {room.subcategories
                                .filter((s) => s.slug !== "")
                                .map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/${room.slug}/${sub.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-1 text-xs text-neutral-600 hover:text-black font-light"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Secondary Navigation */}
                <div className="space-y-3 pt-2">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium px-1">
                    Company
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/gallery"
                      onClick={() => setIsOpen(false)}
                      className="block py-2.5 px-2 text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium"
                    >
                      Completed Projects
                    </Link>
                    <Link
                      href="/custom"
                      onClick={() => setIsOpen(false)}
                      className="block py-2.5 px-2 text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium"
                    >
                      Custom Furniture Blueprint
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block py-2.5 px-2 text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium"
                    >
                      Our Story & Workshop
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="block py-2.5 px-2 text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium"
                    >
                      Contact & Factory HQ
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action CTAs */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-2">
                <a
                  href={customEnquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase py-3.5 font-medium transition-colors"
                >
                  <Send size={13} />
                  <span>WhatsApp Concierge</span>
                </a>
                <a
                  href="tel:9544571992"
                  className="w-full flex items-center justify-center gap-2 border border-neutral-300 text-neutral-800 text-xs tracking-wider uppercase py-2.5 font-light"
                >
                  <Phone size={12} />
                  <span>Call: +91 9544571992</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MOBILE & DESKTOP SEARCH OVERLAY MODAL
          ===================================================== */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl z-10 mt-4 md:mt-20 mx-4 overflow-hidden border border-neutral-100"
            >
              {/* Search Form Header */}
              <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 border-b border-neutral-100 flex items-center gap-3">
                <Search size={20} className="text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by product name, teakwood, sofas, dining..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm sm:text-base font-sans font-light focus:outline-none placeholder:text-neutral-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2.5 hover:bg-neutral-800"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-neutral-400 hover:text-black -mr-2"
                >
                  <X size={20} />
                </button>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="p-4 sm:p-6 bg-neutral-50/50 space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Three Seater Sofa", "Teak Wood", "Dining Tables", "Sectional", "Bed Cots", "Solid Ash"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                      }}
                      className="text-xs bg-white border border-neutral-200 px-3 py-1.5 hover:border-black text-neutral-700 hover:text-black transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

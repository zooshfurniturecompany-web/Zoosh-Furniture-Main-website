"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: "Sofa" | "Dining Table" | "Chairs" | "Bedroom" | "Details";
  image: string;
  description: string;
  slug: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Arc Lounge Composition",
    category: "Chairs",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
    description: "An editorial display of the Arc Lounge Chair nestled in a minimal light-flooded concrete interior.",
    slug: "arc-lounge-chair",
  },
  {
    id: 2,
    title: "Sculptural Bouclé Armchair Close Up",
    category: "Chairs",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200",
    description: "Capturing the organic contours and woven loops of our signature cream bouclé upholstery.",
    slug: "sculptural-boucle-armchair",
  },
  {
    id: 3,
    title: "Linear Dining Arrangement",
    category: "Dining Table",
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1200",
    description: "The Linear Oak Dining Table paired with minimalist concrete benches under muted gallery lighting.",
    slug: "linear-oak-dining-table",
  },
  {
    id: 4,
    title: "Plinth Bedroom Aesthetics",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    description: "Low-profile ebonized bed frame and integrated floating nightstand showcase minimalist sleeping solutions.",
    slug: "plinth-oak-bed-frame",
  },
  {
    id: 5,
    title: "Travertine Raw Texture",
    category: "Details",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    description: "Close-up detailing highlighting the porous cavities and honed surface of Italian Travertine stone.",
    slug: "travertine-bench",
  },
  {
    id: 6,
    title: "Monolith Media Concept",
    category: "Details",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
    description: "The vertical fluting of the Monolith Credenza paired with neutral travertine ceramics.",
    slug: "monolith-credenza",
  },
  {
    id: 7,
    title: "Nouveau L-Shape Setup",
    category: "Sofa",
    image: "/images/WhatsApp Image 2026-01-28 at 10.24.23 (1).jpeg",
    description: "A wide modular layout of the Nouveau Sofa in raw Italian linen, styled with organic wool throws.",
    slug: "nouveau-modular-sofa",
  },
  {
    id: 8,
    title: "Linear Wood Joints",
    category: "Details",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
    description: "Showcasing structural mortise & tenon joints, engineered for generations of heavy use.",
    slug: "linear-oak-dining-table",
  },
  {
    id: 9,
    title: "Cohesive Bedside Lighting",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200",
    description: "Integrated oak shelves with warm recessed LED elements for a serene evening ambience.",
    slug: "plinth-oak-bed-frame",
  },
];

const categories = ["All", "Sofa", "Dining Table", "Chairs", "Bedroom", "Details"];

function GalleryContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Sync category from URL parameter on load or change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // Find case-insensitive or exact match in the categories list
      const matched = categories.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matched) {
        setActiveCategory(matched);
      }
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  // Filter items
  const filteredItems = galleryItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  // Keyboard navigation inside Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    },
    [lightboxIdx, filteredItems]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="pt-8 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
            Visual Portfolio
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900">
            Design Portfolios
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
            A visual showcase of ZOOSH custom layouts, material finishes, and interior styling projects.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-center overflow-x-auto no-scrollbar space-x-2 md:space-x-3 pb-4 mb-8 border-b border-neutral-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIdx(null); // Reset lightbox on category change
              }}
              className={`text-[10px] tracking-widest uppercase py-2.5 px-5 transition-all duration-300 font-light border whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-neutral-500 border-neutral-100 hover:text-black hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry CSS Column layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid relative overflow-hidden group bg-neutral-50 shadow-sm border border-neutral-100/50 flex flex-col cursor-pointer"
            >
              {/* Wrapping card in Next Link */}
              <Link href={`/products/${item.slug}`} className="relative w-full aspect-auto h-auto block">
                {/* Visual Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-102"
                  loading="lazy"
                />
                
                {/* Title Slide-up Info Panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-300 font-sans block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-neutral-200 text-[10px] font-sans font-light leading-relaxed line-clamp-2 mt-1 mb-6">
                    {item.description}
                  </p>
                  
                  <span className="inline-flex items-center text-[9px] tracking-[0.2em] uppercase text-white font-light border-b border-white/20 pb-0.5 max-w-max hover:border-white transition-all">
                    View Product Details &rarr;
                  </span>
                </div>
              </Link>

              {/* Small "View Image" Lightbox Icon Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxIdx(idx);
                }}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-black hover:text-white backdrop-blur-sm p-2 transition-all duration-300 text-neutral-700 shadow-sm opacity-0 group-hover:opacity-100"
                title="View Image Lightbox"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12 select-none"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-55 bg-black/40 rounded-full"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Left selector */}
            <button
              onClick={handlePrev}
              className="absolute left-6 text-white/50 hover:text-white transition-colors p-3 bg-black/40 rounded-full z-55 hidden sm:block"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main view container */}
            <div
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Active Image */}
              <div className="relative max-h-[70vh] aspect-auto flex justify-center">
                <img
                  src={filteredItems[lightboxIdx].image}
                  alt={filteredItems[lightboxIdx].title}
                  className="max-w-full max-h-[70vh] object-contain border border-neutral-800 shadow-2xl"
                />
              </div>

              {/* Text metadata */}
              <div className="text-center text-white max-w-2xl px-4 space-y-1">
                <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans block">
                  {filteredItems[lightboxIdx].category}
                </span>
                <h2 className="font-serif text-xl md:text-2xl font-light tracking-wide">
                  {filteredItems[lightboxIdx].title}
                </h2>
                <p className="text-neutral-400 text-xs font-sans font-light max-w-md mx-auto leading-relaxed mt-2">
                  {filteredItems[lightboxIdx].description}
                </p>
              </div>
            </div>

            {/* Right selector */}
            <button
              onClick={handleNext}
              className="absolute right-6 text-white/50 hover:text-white transition-colors p-3 bg-black/40 rounded-full z-55 hidden sm:block"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>

            {/* Touch swiping triggers for mobile */}
            <div className="absolute bottom-6 flex justify-center space-x-6 sm:hidden text-white/70 text-[10px] tracking-[0.2em] uppercase">
              <button onClick={handlePrev} className="px-4 py-2 bg-neutral-900 border border-neutral-800">
                Prev
              </button>
              <button onClick={handleNext} className="px-4 py-2 bg-neutral-900 border border-neutral-800">
                Next
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-24 bg-white min-h-screen flex items-center justify-center">
          <p className="text-neutral-400 font-light font-sans text-sm animate-pulse">
            Loading gallery...
          </p>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}

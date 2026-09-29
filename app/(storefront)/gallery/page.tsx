"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryProject {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const projects: GalleryProject[] = [
  {
    id: 1,
    title: "Ajmal Residence",
    category: "Living Space",
    image: "/images/catalog/page_14_img_00.webp",
    description: "Custom modular solid wood sectional sofa with natural linen upholstery and matching centre plinth.",
  },
  {
    id: 2,
    title: "Rajesh Menon Residence",
    category: "Dining Suite",
    image: "/images/catalog/page_32_img_00.webp",
    description: "Solid Teakwood 8-seater dining table with hand-woven radio cane backrest ergonomic chairs.",
  },
  {
    id: 3,
    title: "Akhil Residence",
    category: "Lounge Suite",
    image: "/images/catalog/page_29_img_00.webp",
    description: "Sculptural low-slung armchairs with solid Ash wood structure and tailored textured weave.",
  },
  {
    id: 4,
    title: "Sufaina Residence",
    category: "Dining & Benches",
    image: "/images/catalog/page_44_img_00.webp",
    description: "Monolithic solid wood dining table with chamfered edge profiling and matching solid bench.",
  },
  {
    id: 5,
    title: "Sanjeevan Residence",
    category: "Bedroom Sanctuary",
    image: "/images/catalog/page_35_img_00.webp",
    description: "Solid Teakwood platform cot with woven natural cane headboard and floating bedside units.",
  },
  {
    id: 6,
    title: "Brown Barrel Cafe",
    category: "Commercial Fitout",
    image: "/images/catalog/page_51_img_01.webp",
    description: "Heavy-duty commercial solid hardwood table tops, fluted counter stools, and lounge benches.",
  },
  {
    id: 7,
    title: "Precision Wood Joinery",
    category: "Workshop Craft",
    image: "/images/catalog/page_06_img_01.webp",
    description: "Traditional mortise and tenon jointing executed by master carpenters at our Pattambi factory.",
  },
  {
    id: 8,
    title: "Timber Seasoning",
    category: "Material Curation",
    image: "/images/catalog/page_02_img_01.webp",
    description: "Kiln-dried solid Teakwood seasoned to optimal moisture levels to ensure generational stability.",
  },
  {
    id: 9,
    title: "Custom Dining Fabrication",
    category: "Workshop Craft",
    image: "/images/catalog/page_10_img_00.webp",
    description: "Hand-sanding and matte melamine sealer application on custom bespoke table commission.",
  },
];

function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const categories = ["All", "Living Space", "Dining Suite", "Bedroom Sanctuary", "Workshop Craft"];

  const filtered = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="py-8 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Bespoke Portfolio
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-900">
            Completed Projects
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light leading-relaxed">
            A curated visual archive of bespoke furniture installations handcrafted at our Pattambi workshop for homes across India.
          </p>
        </div>

        {/* Category Filters (Mobile Edge Bleed) */}
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-1.5 scroll-smooth mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] sm:text-[10px] tracking-wider uppercase py-2 px-3.5 sm:px-4.5 transition-all whitespace-nowrap font-medium border ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-neutral-600 border-neutral-200 hover:text-black hover:border-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Mobile Grid / 3-Column Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="group cursor-pointer flex flex-col space-y-2"
              onClick={() => setLightboxIdx(idx)}
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100 border border-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                
                <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-xs flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                </div>
              </div>

              <div className="space-y-0.5 px-0.5">
                <span className="text-[8px] sm:text-[9px] tracking-wider uppercase text-neutral-400 font-sans block">
                  {item.category}
                </span>
                <h3 className="font-serif text-xs sm:text-sm md:text-base text-neutral-900 group-hover:text-neutral-600 transition-colors leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Commission Banner */}
        <div className="mt-16 bg-neutral-50 p-8 sm:p-12 text-center border border-neutral-100 space-y-4">
          <h2 className="font-serif text-xl sm:text-3xl text-neutral-900 font-light">
            Commission a Design for Your Home
          </h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
            Have an architectural floor plan or sketch? Our master carpenters will fabricate bespoke solid wood pieces matching your exact proportions.
          </p>
          <div className="pt-2">
            <Link
              href="/custom"
              className="inline-flex items-center justify-center bg-black hover:bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase py-3.5 px-8 font-medium transition-colors"
            >
              Start Custom Blueprint
            </Link>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md select-none p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-3 z-10 bg-white/10 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1));
            }}
            className="absolute left-3 sm:left-8 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square max-h-[65vh] w-full bg-neutral-900 mb-3">
              <Image
                src={filtered[lightboxIdx].image}
                alt={filtered[lightboxIdx].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center text-white space-y-1 max-w-lg">
              <h3 className="font-serif text-lg">{filtered[lightboxIdx].title}</h3>
              <p className="text-xs text-neutral-400 font-sans font-light">
                {filtered[lightboxIdx].description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-3 sm:right-8 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin" />
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}

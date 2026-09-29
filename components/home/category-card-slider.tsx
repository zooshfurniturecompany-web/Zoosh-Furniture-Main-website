"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CategorySpace {
  title: string;
  subtitle: string;
  slug: string;
  image: string;
}

const spaces: CategorySpace[] = [
  {
    title: "Living Space",
    subtitle: "Modular Sofas, Lounges & Centre Tables",
    slug: "living",
    image: "/images/catalog/page_14_img_00.webp",
  },
  {
    title: "Dining Room",
    subtitle: "Solid Hardwood Tables & Dining Chairs",
    slug: "dining",
    image: "/images/catalog/page_21_img_00.webp",
  },
  {
    title: "Bedroom Sanctuary",
    subtitle: "Plinth Bed Cots & Floating Nightstands",
    slug: "bedroom",
    image: "/images/catalog/page_22_img_00.webp",
  },
  {
    title: "Accent Seating",
    subtitle: "Sculptural Bouclé & Cane Armchairs",
    slug: "living/lounge-chairs",
    image: "/images/catalog/page_15_img_00.webp",
  },
  {
    title: "Entryway & Consoles",
    subtitle: "Monolithic Consoles & Entry Benches",
    slug: "entryway",
    image: "/images/catalog/page_27_img_00.webp",
  },
];

export default function CategoryCardSlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header with Desktop Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3">
          <div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans block mb-1.5 font-semibold">
              Curated Spaces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Shop by Room
            </h2>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleScroll(-320)}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white hover:border-black transition-colors"
              aria-label="Previous space"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll(320)}
              className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white hover:border-black transition-colors"
              aria-label="Next space"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Category Image Cards Horizontal Slider (Mobile Edge Bleed) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scroll-smooth no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
        >
          {spaces.map((space) => (
            <div
              key={space.title}
              className="flex-shrink-0 w-[220px] sm:w-[280px] md:w-[310px] group cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={`/${space.slug}`} className="block">
                {/* Card Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100 border border-neutral-100">
                  <Image
                    src={space.image}
                    alt={space.title}
                    fill
                    sizes="(max-width: 640px) 220px, 310px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Floating Card Title on Image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                    <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium tracking-wide leading-tight">
                      {space.title}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/80 font-sans mt-1 block truncate">
                      {space.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

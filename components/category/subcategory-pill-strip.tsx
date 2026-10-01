"use client";

import Link from "next/link";
import Image from "next/image";

export interface SubcategoryItem {
  name: string;
  slug: string;
  image: string;
}

interface SubcategoryPillStripProps {
  roomSlug: string;
  subcategories: SubcategoryItem[];
  activeSlug?: string;
}

export default function SubcategoryPillStrip({
  roomSlug,
  subcategories,
  activeSlug = "",
}: SubcategoryPillStripProps) {
  return (
    <div className="w-full bg-white border-b border-neutral-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* "All [Room]" Pill Card */}
          <Link
            href={`/${roomSlug}`}
            className={`flex items-center gap-2.5 px-3 py-2 shrink-0 border transition-all duration-200 ${
              !activeSlug
                ? "bg-black text-white border-black shadow-xs"
                : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200"
            }`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 relative bg-neutral-200 overflow-hidden shrink-0">
              <Image
                src={subcategories[0]?.image || "/images/catalog/page_14_img_00.webp"}
                alt={`All ${roomSlug}`}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="pr-1 text-left">
              <span className="block text-[11px] sm:text-xs font-sans font-medium whitespace-nowrap leading-tight">
                All {roomSlug.charAt(0).toUpperCase() + roomSlug.slice(1)}
              </span>
              <span className="block text-[9px] opacity-70 tracking-wider uppercase font-sans">
                Explore All
              </span>
            </div>
          </Link>

          {/* Individual Subcategory Pill Cards (D'TALE Modern Style) */}
          {subcategories.map((sub) => {
            const isActive = activeSlug.toLowerCase() === sub.slug.toLowerCase();
            return (
              <Link
                key={sub.slug}
                href={`/${roomSlug}/${sub.slug}`}
                className={`flex items-center gap-2.5 px-3 py-2 shrink-0 border transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200"
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 relative bg-neutral-100 overflow-hidden shrink-0">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="pr-1 text-left">
                  <span className="block text-[11px] sm:text-xs font-sans font-medium whitespace-nowrap leading-tight">
                    {sub.name}
                  </span>
                  <span className="block text-[9px] opacity-70 tracking-wider uppercase font-sans">
                    View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase py-2.5 px-4 text-center border-b border-neutral-800 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span>Bespoke Solid Wood Furniture • Handcrafted in Pattambi Workshop • Pan-India Delivery</span>
        <Link href="/custom" className="underline hover:opacity-80 transition-opacity hidden sm:inline">
          Custom Dimensions
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, X, Check, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { Product, useProducts, getRoomAndSubcategory } from "@/hooks/use-products";

const roomMetadata: Record<string, {
  name: string;
  heroImage: string;
  description: string;
  subcategories: { name: string; slug: string }[];
}> = {
  living: {
    name: "Living",
    heroImage: "/images/catalog/page_14_img_00.webp",
    description: "Furniture designed around the way you live — modular sofas, lounge chairs, and custom tables.",
    subcategories: [
      { name: "Sofas", slug: "sofas" },
      { name: "Lounge Chairs", slug: "lounge-chairs" },
      { name: "Arm Chairs", slug: "arm-chairs" },
      { name: "Centre Tables", slug: "centre-tables" },
      { name: "Side Tables", slug: "side-tables" },
      { name: "Console Tables", slug: "console-tables" }
    ]
  },
  dining: {
    name: "Dining",
    heroImage: "/images/catalog/page_21_img_00.webp",
    description: "Crafted for connection — solid wood dining tables, woven cane chairs, benches, and stools.",
    subcategories: [
      { name: "Dining Tables", slug: "dining-tables" },
      { name: "Dining Chairs", slug: "dining-chairs" },
      { name: "Dining Benches", slug: "dining-benches" },
      { name: "Bar Stools", slug: "bar-stools" }
    ]
  },
  bedroom: {
    name: "Bedroom",
    heroImage: "/images/catalog/page_22_img_00.webp",
    description: "Peaceful sanctuary furniture — platform bed cots, canopy frames, and floating nightstands.",
    subcategories: [
      { name: "Bed Cots", slug: "bed-cots" },
      { name: "Bedside Tables", slug: "bedside-tables" },
      { name: "Bedroom Chairs", slug: "bedroom-chairs" },
      { name: "Benches", slug: "benches" }
    ]
  },
  entryway: {
    name: "Entryway",
    heroImage: "/images/catalog/page_27_img_00.webp",
    description: "Minimalist console tables, hallway benches, and sculptural mirror units.",
    subcategories: [
      { name: "Console Tables", slug: "console-tables" },
      { name: "Mirror Units", slug: "mirror-units" },
      { name: "Benches", slug: "benches" }
    ]
  }
};

interface RoomPageProps {
  params: Promise<{ room: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = params && typeof (params as any).then === "function" ? use(params) : (params as any);
  const roomSlug = (resolvedParams?.room || "").toLowerCase();
  const roomData = roomMetadata[roomSlug];

  if (!roomData) {
    notFound();
  }

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [materialFilter, setMaterialFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  const allProducts = useProducts();
  const rawProducts = allProducts.filter((p) => getRoomAndSubcategory(p.category).room === roomSlug);

  const WOOD_FILTERS = ["Teak Wood", "Ash Wood", "Mahogany Wood"];

  // Filter products
  const filteredProducts = rawProducts.filter((product) => {
    if (materialFilter === "All") return true;
    const mat = (product.material || "").toLowerCase();
    const wood = (product.specs?.woodType || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();
    const name = (product.name || "").toLowerCase();

    if (materialFilter === "Teak Wood") {
      return mat.includes("teak") || wood.includes("teak") || desc.includes("teak") || name.includes("teak");
    }
    if (materialFilter === "Ash Wood") {
      return mat.includes("ash") || wood.includes("ash") || desc.includes("ash") || name.includes("ash");
    }
    if (materialFilter === "Mahogany Wood") {
      return mat.includes("mahogany") || wood.includes("mahogany") || desc.includes("mahogany") || name.includes("mahogany");
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortOption === "Price: High to Low") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortOption === "Name: A to Z") {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === "Name: Z to A") {
      return b.name.localeCompare(a.name);
    }
    if (sortOption === "Newest") {
      return a.sku.localeCompare(b.sku);
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="bg-white min-h-screen">
      
      {/* Room Header & Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50/40 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-3">
          
          <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-medium">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-neutral-900">{roomData.name} Space</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-light tracking-wide">
              {roomData.name} Furniture
            </h1>
            <span className="text-xs text-neutral-400 font-sans font-light">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Creation" : "Creations"}
            </span>
          </div>

          <p className="text-neutral-500 font-sans text-xs sm:text-sm font-light max-w-xl">
            {roomData.description}
          </p>

          {/* Subcategories Horizontal Scroll Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href={`/${roomSlug}`}
              className="text-[9px] sm:text-[10px] uppercase tracking-wider py-1.5 px-3 bg-black text-white whitespace-nowrap font-medium shrink-0"
            >
              All {roomData.name}
            </Link>
            {roomData.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/${roomSlug}/${sub.slug}`}
                className="text-[9px] sm:text-[10px] uppercase tracking-wider py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 whitespace-nowrap font-light transition-colors shrink-0"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Action Bar (Count, Sort, Filter) */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-6 text-xs font-sans">
            <span className="text-neutral-500 font-light text-[11px] sm:text-xs">
              Showing <strong>{sortedProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Filter Trigger */}
              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 border border-neutral-200 text-neutral-800 hover:border-black text-[10px] sm:text-xs uppercase tracking-wider font-medium"
              >
                <SlidersHorizontal size={13} />
                <span>{materialFilter === "All" ? "Filter" : materialFilter}</span>
              </button>

              {/* Sort Control */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortModalOpen(true)}
                  className="flex sm:hidden items-center gap-1.5 py-1.5 px-3 border border-neutral-200 text-neutral-800 text-[10px] uppercase tracking-wider font-medium"
                >
                  <ArrowUpDown size={13} />
                  <span>Sort</span>
                </button>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="hidden sm:block bg-transparent border border-neutral-200 text-xs py-1.5 px-3 text-neutral-800 focus:outline-none focus:border-black font-sans"
                >
                  <option value="Featured">Sort: Featured</option>
                  <option value="Newest">Sort: Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Name: A to Z">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2-Column Mobile Grid / 3-Column Desktop Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="text-neutral-500 font-sans text-sm font-light">
                No products found matching the selected filter options.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaterialFilter("All");
                  setSortOption("Featured");
                }}
                className="inline-flex items-center text-[10px] tracking-widest uppercase text-black font-semibold border-b border-black pb-0.5 hover:opacity-75 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Mobile Filter Sheet */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Hardwood</h3>
              <button type="button" onClick={() => setFilterModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {["All", ...WOOD_FILTERS].map((wood) => (
                <button
                  key={wood}
                  type="button"
                  onClick={() => {
                    setMaterialFilter(wood);
                    setFilterModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 text-sm text-left border-b border-neutral-50"
                >
                  <span className={materialFilter === wood ? "font-semibold text-black" : "text-neutral-600 font-light"}>
                    {wood === "All" ? "All Wood Types" : wood}
                  </span>
                  {materialFilter === wood && <Check size={16} className="text-black" />}
                </button>
              ))}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMaterialFilter("All");
                  setFilterModalOpen(false);
                }}
                className="w-full py-3 text-xs tracking-widest uppercase font-medium text-neutral-500 hover:text-black border border-neutral-200 text-center"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Sheet */}
      {sortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:hidden">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Sort Catalog</h3>
              <button type="button" onClick={() => setSortModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Name: A to Z"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSortOption(opt);
                    setSortModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 text-sm text-left border-b border-neutral-50"
                >
                  <span className={sortOption === opt ? "font-semibold text-black" : "text-neutral-600 font-light"}>
                    {opt}
                  </span>
                  {sortOption === opt && <Check size={16} className="text-black" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

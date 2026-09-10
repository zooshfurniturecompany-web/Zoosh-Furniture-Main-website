"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { ArrowRight, Filter, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import Button from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { Product, getProductsByRoom } from "@/hooks/use-products";

// Metadata and details for each specific Space room
const roomMetadata: Record<string, {
  name: string;
  heroImage: string;
  description: string;
  subcategories: { name: string; slug: string }[];
}> = {
  living: {
    name: "Living",
    heroImage: "/images/catalog/page_14_img_00.webp",
    description: "Furniture designed around the way you live — sofas, lounge chairs, and custom tables.",
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
    description: "Peaceful sanctuary furniture — platform bed cots, canopy posts, and nightstands.",
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
    description: "Minimalist console tables, hallway benches, and sculptural mirror frames.",
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

  const rawProducts = getProductsByRoom(roomSlug);

  // Extract unique materials dynamically
  const uniqueMaterials = Array.from(
    new Set(rawProducts.map((p) => p.material || "Solid Wood"))
  );

  // Filter products
  const filteredProducts = rawProducts.filter((product) => {
    if (materialFilter === "All") return true;
    return product.material === materialFilter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortOption === "Price: High to Low") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortOption === "Newest") {
      return a.sku.localeCompare(b.sku);
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="bg-white min-h-screen">
      
      {/* Compact Header & Subcategory Bar (Brings Products Immediately to the Front) */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-4 pb-2 sm:pt-6 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-neutral-900 font-light tracking-wide">
              {roomData.name} Furniture
            </h1>
            <span className="text-[10px] sm:text-xs text-neutral-400 font-sans font-light">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"} Available
            </span>
          </div>

          {/* Compressed Horizontal Scrolling Subcategories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href={`/${roomSlug}`}
              className="text-[10px] sm:text-[11px] uppercase tracking-wider py-1.5 px-3.5 bg-black text-white whitespace-nowrap font-medium rounded-xs shrink-0"
            >
              All {roomData.name}
            </Link>
            {roomData.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/${roomSlug}/${sub.slug}`}
                className="text-[10px] sm:text-[11px] uppercase tracking-wider py-1.5 px-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 whitespace-nowrap font-light rounded-xs transition-colors shrink-0"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sort & Filter Bar (DTALEMODERN Style) */}
      <div className="grid grid-cols-2 border-b border-neutral-200 divide-x divide-neutral-200 sm:hidden">
        <button
          onClick={() => setSortModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 text-xs tracking-wider uppercase font-sans text-neutral-800 font-medium active:bg-neutral-100"
        >
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
        <button
          onClick={() => setFilterModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 text-xs tracking-wider uppercase font-sans text-neutral-800 font-medium active:bg-neutral-100"
        >
          <SlidersHorizontal size={14} />
          <span>Filter</span>
        </button>
      </div>

      {/* Main 2-Columns Products Grid (Immediately Visible on Front Page) */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Desktop Filters and Sorting Bar */}
          <div className="hidden sm:flex items-center justify-between pb-6 mb-6 border-b border-neutral-100 gap-4">
            {/* Material Filters */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 font-sans font-semibold mr-1 flex items-center">
                <Filter size={10} className="mr-1" /> Wood:
              </span>
              <button
                onClick={() => setMaterialFilter("All")}
                className={`text-[9px] tracking-widest uppercase py-1 px-3 transition-all font-light border ${
                  materialFilter === "All"
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
                }`}
              >
                All
              </button>
              {uniqueMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setMaterialFilter(mat)}
                  className={`text-[9px] tracking-widest uppercase py-1 px-3 transition-all font-light border ${
                    materialFilter === mat
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 font-sans font-semibold flex items-center">
                <ArrowUpDown size={10} className="mr-1" /> Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border border-neutral-200 text-[10px] tracking-wider uppercase py-1 px-2.5 text-neutral-700 font-sans font-light focus:outline-none focus:border-black"
              >
                <option value="Featured">Featured</option>
                <option value="Newest">Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* 2-Columns Mobile Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
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

      {/* Mobile Sort Sheet */}
      {sortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:hidden">
          <div className="w-full bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Sort By</h3>
              <button onClick={() => setSortModalOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {["Featured", "Newest", "Price: Low to High", "Price: High to Low"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOption(option);
                    setSortModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 text-sm text-left border-b border-neutral-50"
                >
                  <span className={sortOption === option ? "font-semibold text-black" : "text-neutral-600 font-light"}>
                    {option}
                  </span>
                  {sortOption === option && <Check size={16} className="text-black" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Sheet */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:hidden">
          <div className="w-full bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Wood / Material</h3>
              <button onClick={() => setFilterModalOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {["All", ...uniqueMaterials].map((mat) => (
                <button
                  key={mat}
                  onClick={() => {
                    setMaterialFilter(mat);
                    setFilterModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 text-sm text-left border-b border-neutral-50"
                >
                  <span className={materialFilter === mat ? "font-semibold text-black" : "text-neutral-600 font-light"}>
                    {mat === "All" ? "All Materials" : mat}
                  </span>
                  {materialFilter === mat && <Check size={16} className="text-black" />}
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

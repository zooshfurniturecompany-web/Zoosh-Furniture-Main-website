"use client";

import Link from "next/link";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, Filter, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import Button from "@/components/ui/button";
import { Product, useProducts, getRoomAndSubcategory } from "@/hooks/use-products";

// Human-readable labels for slugs
const roomLabels: Record<string, string> = {
  living: "Living",
  dining: "Dining",
  bedroom: "Bedroom",
  entryway: "Entryway"
};

const subcategoryLabels: Record<string, string> = {
  sofas: "Sofas",
  "lounge-chairs": "Lounge Chairs",
  "arm-chairs": "Arm Chairs",
  "centre-tables": "Centre Tables",
  "side-tables": "Side Tables",
  "console-tables": "Console Tables",
  "dining-tables": "Dining Tables",
  "dining-chairs": "Dining Chairs",
  "dining-benches": "Dining Benches",
  "bar-stools": "Bar Stools",
  "bed-cots": "Bed Cots",
  "bedside-tables": "Bedside Tables",
  "bedroom-chairs": "Bedroom Chairs",
  "mirror-units": "Mirror Units",
  benches: "Benches"
};

interface SubcategoryPageProps {
  params: Promise<{ room: string; subcategory: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const resolvedParams = params && typeof (params as any).then === "function" ? use(params) : (params as any);
  const roomSlug = (resolvedParams?.room || "").toLowerCase();
  const subcategorySlug = (resolvedParams?.subcategory || "").toLowerCase();

  const roomName = roomLabels[roomSlug];
  const subcategoryName = subcategoryLabels[subcategorySlug];

  if (!roomName || !subcategoryName) {
    notFound();
  }

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [materialFilter, setMaterialFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Get live catalog products for this subcategory from CMS
  const allProducts = useProducts();
  const rawProducts = allProducts.filter((p) => {
    const mapped = getRoomAndSubcategory(p.category);
    return mapped.room === roomSlug && mapped.subcategory === subcategorySlug;
  });

  const WOOD_FILTERS = ["Teak Wood", "Ash Wood", "Mahogany Wood"];

  // Filter products by selected primary wood species
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
    if (sortOption === "Newest") {
      return a.sku.localeCompare(b.sku);
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="pt-4 sm:pt-8 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 mb-4 sm:mb-8 font-sans font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href={`/${roomSlug}`} className="hover:text-black transition-colors">
            {roomName}
          </Link>
          <ChevronRight size={10} />
          <span className="text-neutral-800">{subcategoryName}</span>
        </div>

        {/* Section Header */}
        <div className="mb-4 sm:mb-8 space-y-1 sm:space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
            {roomName} Collection
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900 leading-tight">
            {subcategoryName}
          </h1>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm font-light max-w-xl">
            Custom made-to-order {subcategoryName.toLowerCase()} crafted directly in our Pattambi factory from solid wood and cane weaves.
          </p>
        </div>

        {/* Mobile Sort & Filter Bar (DTALEMODERN Style) */}
        <div className="grid grid-cols-2 border-t border-b border-neutral-200 divide-x divide-neutral-200 mb-6 sm:hidden">
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

        {/* Main Workspace with Dtale Modern Left Sidebar & 3-Columns Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Desktop Left Filter Sidebar (Dtale Modern Style) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6 pr-6 border-r border-neutral-100">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Browse by
              </h3>
              {(materialFilter !== "All" || sortOption !== "Featured") && (
                <button
                  onClick={() => {
                    setMaterialFilter("All");
                    setSortOption("Featured");
                  }}
                  className="text-[10px] text-neutral-400 hover:text-black uppercase tracking-wider font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Product Type / Subcategories */}
            <div className="space-y-3">
              <h4 className="font-sans text-xs font-semibold text-neutral-900 tracking-wide">
                Product Type
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <Link
                  href={`/${roomSlug}`}
                  className="flex items-center justify-between py-1 text-neutral-600 hover:text-black transition-colors font-light"
                >
                  <span>All {roomName}</span>
                </Link>
                {Object.entries(subcategoryLabels)
                  .filter(([slug]) => {
                    // Match subcategories belonging to this room
                    const sample = allProducts.find(p => getRoomAndSubcategory(p.category).subcategory === slug && getRoomAndSubcategory(p.category).room === roomSlug);
                    return sample !== undefined || slug === subcategorySlug;
                  })
                  .map(([slug, name]) => {
                    const isActive = slug === subcategorySlug;
                    const count = allProducts.filter(p => {
                      const m = getRoomAndSubcategory(p.category);
                      return m.room === roomSlug && m.subcategory === slug;
                    }).length;
                    return (
                      <Link
                        key={slug}
                        href={`/${roomSlug}/${slug}`}
                        className={`flex items-center justify-between py-1 transition-colors ${
                          isActive ? "text-black font-semibold" : "text-neutral-600 hover:text-black font-light"
                        }`}
                      >
                        <span>{name}</span>
                        <span className="text-neutral-400 text-[10px]">({count})</span>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Wood / Material Filters */}
            <div className="space-y-3 pt-5 border-t border-neutral-100">
              <h4 className="font-sans text-xs font-semibold text-neutral-900 tracking-wide">
                Wood & Material
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <button
                  onClick={() => setMaterialFilter("All")}
                  className={`w-full flex items-center justify-between py-1 text-left transition-colors ${
                    materialFilter === "All" ? "text-black font-semibold" : "text-neutral-600 hover:text-black font-light"
                  }`}
                >
                  <span>All Materials</span>
                  <span className="text-neutral-400 text-[10px]">({rawProducts.length})</span>
                </button>
                {WOOD_FILTERS.map((wood) => {
                  const count = rawProducts.filter((product) => {
                    const mat = (product.material || "").toLowerCase();
                    const w = (product.specs?.woodType || "").toLowerCase();
                    const desc = (product.description || "").toLowerCase();
                    const name = (product.name || "").toLowerCase();
                    const target = wood.toLowerCase().replace(" wood", "");
                    return mat.includes(target) || w.includes(target) || desc.includes(target) || name.includes(target);
                  }).length;
                  return (
                    <button
                      key={wood}
                      onClick={() => setMaterialFilter(wood)}
                      className={`w-full flex items-center justify-between py-1 text-left transition-colors ${
                        materialFilter === wood ? "text-black font-semibold" : "text-neutral-600 hover:text-black font-light"
                      }`}
                    >
                      <span>{wood}</span>
                      <span className="text-neutral-400 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Header Bar with Count & Sort (Dtale Modern style) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
              <span className="text-xs text-neutral-500 font-sans font-light">
                <strong className="text-neutral-900 font-medium">{sortedProducts.length}</strong> {sortedProducts.length === 1 ? "Result" : "Results"}
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-sans font-medium">
                  Sort:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent border border-neutral-200 text-xs py-1.5 px-3 text-neutral-800 font-sans focus:outline-none focus:border-black rounded-xs"
                >
                  <option value="Featured">Featured</option>
                  <option value="Newest">Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid (Dtale Modern 3-Columns Layout) */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
        </div>
      </div>

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
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Wood</h3>
              <button onClick={() => setFilterModalOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {["All", ...WOOD_FILTERS].map((wood) => (
                <button
                  key={wood}
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

"use client";

import Link from "next/link";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, Filter, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import Button from "@/components/ui/button";
import { Product, getProductsBySubcategory } from "@/hooks/use-products";

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
  const resolvedParams = use(params);
  const roomSlug = resolvedParams.room.toLowerCase();
  const subcategorySlug = resolvedParams.subcategory.toLowerCase();

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

  // Get catalog products for this subcategory
  const rawProducts = getProductsBySubcategory(roomSlug, subcategorySlug);

  // Extract available unique materials dynamically for this specific subcategory list
  const uniqueMaterials = Array.from(
    new Set(rawProducts.map((p) => p.material || "Solid Wood"))
  );

  // Filter products based on selected options
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

        {/* Desktop Filters and Sorting Bar */}
        <div className="hidden sm:flex items-center justify-between border-t border-b border-neutral-100 py-4 mb-8 gap-4">
          {/* Material Filters */}
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="text-[9px] tracking-widest uppercase text-neutral-400 font-sans font-semibold mr-1.5 flex items-center">
              <Filter size={10} className="mr-1" /> Material:
            </span>
            <button
              onClick={() => setMaterialFilter("All")}
              className={`text-[9px] tracking-widest uppercase py-1.5 px-3.5 transition-all font-light border ${
                materialFilter === "All"
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
              }`}
            >
              All Materials
            </button>
            {uniqueMaterials.map((mat) => (
              <button
                key={mat}
                onClick={() => setMaterialFilter(mat)}
                className={`text-[9px] tracking-widest uppercase py-1.5 px-3.5 transition-all font-light border ${
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
              <ArrowUpDown size={10} className="mr-1" /> Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent border border-neutral-200 text-[10px] tracking-wider uppercase py-1.5 px-3 text-neutral-700 font-sans font-light focus:outline-none focus:border-black"
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

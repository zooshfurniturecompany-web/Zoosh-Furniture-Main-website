"use client";

import Link from "next/link";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { Product, useProducts, getRoomAndSubcategory } from "@/hooks/use-products";

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

  const allProducts = useProducts();
  const rawProducts = allProducts.filter((p) => {
    const mapped = getRoomAndSubcategory(p.category);
    return mapped.room === roomSlug && mapped.subcategory === subcategorySlug;
  });

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
      
      {/* Subcategory Header & Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50/40 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-2.5">
          
          <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-medium">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href={`/${roomSlug}`} className="hover:text-black transition-colors">{roomName}</Link>
            <ChevronRight size={10} />
            <span className="text-neutral-900">{subcategoryName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              {subcategoryName}
            </h1>
            <span className="text-xs text-neutral-400 font-sans font-light">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Creation" : "Creations"}
            </span>
          </div>

          <p className="text-neutral-500 font-sans text-xs sm:text-sm font-light max-w-lg">
            Custom made-to-order {subcategoryName.toLowerCase()} handcrafted in our Pattambi factory workshop.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
        
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
              No products found matching the selected criteria.
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

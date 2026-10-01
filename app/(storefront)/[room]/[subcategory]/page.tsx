"use client";

import Link from "next/link";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import SubcategoryPillStrip from "@/components/category/subcategory-pill-strip";
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

const roomSubcategoriesMap: Record<string, { name: string; slug: string; image: string }[]> = {
  living: [
    { name: "Sofas", slug: "sofas", image: "/images/products/sf002-main.jpg" },
    { name: "Lounge Chairs", slug: "lounge-chairs", image: "/images/catalog/page_15_img_00.webp" },
    { name: "Arm Chairs", slug: "arm-chairs", image: "/images/catalog/page_16_img_00.webp" },
    { name: "Centre Tables", slug: "centre-tables", image: "/images/catalog/page_17_img_00.webp" },
    { name: "Side Tables", slug: "side-tables", image: "/images/catalog/page_18_img_00.webp" },
    { name: "Console Tables", slug: "console-tables", image: "/images/catalog/page_27_img_00.webp" }
  ],
  dining: [
    { name: "Dining Tables", slug: "dining-tables", image: "/images/catalog/page_21_img_00.webp" },
    { name: "Dining Chairs", slug: "dining-chairs", image: "/images/catalog/page_23_img_00.webp" },
    { name: "Dining Benches", slug: "dining-benches", image: "/images/catalog/page_24_img_00.webp" },
    { name: "Bar Stools", slug: "bar-stools", image: "/images/catalog/page_25_img_00.webp" }
  ],
  bedroom: [
    { name: "Bed Cots", slug: "bed-cots", image: "/images/catalog/page_22_img_00.webp" },
    { name: "Bedside Tables", slug: "bedside-tables", image: "/images/catalog/page_26_img_00.webp" },
    { name: "Bedroom Chairs", slug: "bedroom-chairs", image: "/images/catalog/page_15_img_00.webp" },
    { name: "Benches", slug: "benches", image: "/images/catalog/page_24_img_00.webp" }
  ],
  entryway: [
    { name: "Console Tables", slug: "console-tables", image: "/images/catalog/page_27_img_00.webp" },
    { name: "Mirror Units", slug: "mirror-units", image: "/images/catalog/page_28_img_00.webp" },
    { name: "Benches", slug: "benches", image: "/images/catalog/page_24_img_00.webp" }
  ]
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
  const subcategoriesList = roomSubcategoriesMap[roomSlug] || [];

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
    return (a.display_order ?? 9999) - (b.display_order ?? 9999);
  });

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Header & Breadcrumbs */}
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

      {/* 2. Visual Subcategory Thumbnail Pill Strip (D'TALE MODERN STYLE) */}
      {subcategoriesList.length > 0 && (
        <SubcategoryPillStrip
          roomSlug={roomSlug}
          subcategories={subcategoriesList}
          activeSlug={subcategorySlug}
        />
      )}

      {/* 3. D'TALE Modern Split Sort & Filter Bar (Mobile Split 50/50 / Desktop Action Bar) */}
      <div className="sticky top-[84px] z-30 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Mobile Split 50/50 Bar */}
          <div className="grid grid-cols-2 divide-x divide-neutral-200 sm:hidden py-0">
            <button
              type="button"
              onClick={() => setSortModalOpen(true)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium text-neutral-900 active:bg-neutral-100"
            >
              <ArrowUpDown size={14} />
              <span>Sort</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium text-neutral-900 active:bg-neutral-100"
            >
              <SlidersHorizontal size={14} />
              <span>Filter {materialFilter !== "All" ? `(1)` : ""}</span>
            </button>
          </div>

          {/* Desktop Toolbar */}
          <div className="hidden sm:flex items-center justify-between py-3 text-xs font-sans">
            <span className="text-neutral-500 font-light text-xs">
              Showing <strong className="text-neutral-900 font-semibold">{sortedProducts.length}</strong> creations
            </span>

            <div className="flex items-center gap-3">
              {/* Hardwood Material Filter Chips */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMaterialFilter("All")}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    materialFilter === "All"
                      ? "bg-black text-white border-black"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black"
                  }`}
                >
                  All Woods
                </button>
                {WOOD_FILTERS.map((wood) => (
                  <button
                    key={wood}
                    type="button"
                    onClick={() => setMaterialFilter(wood)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      materialFilter === wood
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-black"
                    }`}
                  >
                    {wood}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 text-xs py-1.5 px-3 text-neutral-800 focus:outline-none focus:border-black font-sans font-medium"
              >
                <option value="Featured">Sort: Recommended</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Name: A to Z">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Filter Chips Display */}
      {materialFilter !== "All" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-3 flex items-center gap-2">
          <span className="text-[11px] text-neutral-500 font-sans">Active:</span>
          <button
            type="button"
            onClick={() => setMaterialFilter("All")}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[10px] font-sans font-medium rounded-full hover:bg-neutral-200 transition-colors"
          >
            <span>{materialFilter}</span>
            <X size={12} />
          </button>
        </div>
      )}

      {/* 5. 2-Column Luxury Mobile Product Grid / 3-Column Desktop Grid */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
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
                No creations found in {subcategoryName} matching the selected filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaterialFilter("All");
                  setSortOption("Featured");
                }}
                className="inline-flex items-center text-[10px] tracking-widest uppercase text-black font-semibold border-b border-black pb-0.5"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Filter Bottom Sheet */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Hardwood</h3>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMaterialFilter("All");
                  setFilterModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 border text-xs font-sans ${
                  materialFilter === "All"
                    ? "border-black bg-black text-white font-medium"
                    : "border-neutral-200 text-neutral-800"
                }`}
              >
                <span>All Hardwoods</span>
                {materialFilter === "All" && <Check size={16} />}
              </button>

              {WOOD_FILTERS.map((wood) => {
                const isSelected = materialFilter === wood;
                return (
                  <button
                    key={wood}
                    type="button"
                    onClick={() => {
                      setMaterialFilter(wood);
                      setFilterModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 border text-xs font-sans ${
                      isSelected
                        ? "border-black bg-black text-white font-medium"
                        : "border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <span>{wood}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {sortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Sort Creations</h3>
              <button
                type="button"
                onClick={() => setSortModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                "Featured",
                "Newest",
                "Price: Low to High",
                "Price: High to Low",
                "Name: A to Z",
              ].map((opt) => {
                const isSelected = sortOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSortOption(opt);
                      setSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 border text-xs font-sans ${
                      isSelected
                        ? "border-black bg-black text-white font-medium"
                        : "border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

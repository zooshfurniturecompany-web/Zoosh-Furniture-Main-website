"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X, Check, RefreshCw } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, getCategories, Product } from "@/hooks/use-products";

function CollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const products = useProducts();
  const categories = ["All", ...getCategories()];

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeMaterial, setActiveMaterial] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  const WOOD_OPTIONS = ["Teak Wood", "Ash Wood", "Mahogany Wood"];

  // Sync category state with search query param
  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams(window.location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`/collection?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveMaterial("All");
    handleCategoryChange("All");
    setSortOption("Featured");
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category.toLowerCase() === activeCategory.toLowerCase();
    
    let matchesMaterial = true;
    if (activeMaterial !== "All") {
      const mat = (product.material || "").toLowerCase();
      const wood = (product.specs?.woodType || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();
      const name = (product.name || "").toLowerCase();
      const target = activeMaterial.toLowerCase().replace(" wood", "");
      matchesMaterial = mat.includes(target) || wood.includes(target) || desc.includes(target) || name.includes(target);
    }

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesMaterial && matchesSearch;
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
    <div className="w-full bg-white min-h-screen">
      
      {/* 1. Header section */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 py-8 sm:py-14 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Signature Collection
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-950">
            Solid Hardwood Catalog
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-md mx-auto">
            Browse our complete signature collection. Handcrafted to order in solid Teak, Ash, and Mahogany hardwood.
          </p>
        </div>
      </div>

      {/* 2. Horizontal Category Filter Pills (Mobile Edge Bleed) */}
      <div className="border-b border-neutral-100 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-center overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-2 scroll-smooth">
            {categories.map((category) => {
              const isActive = activeCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`text-[10px] sm:text-[11px] tracking-wider uppercase py-2 px-3.5 sm:px-4.5 transition-all whitespace-nowrap font-medium border ${
                    isActive
                      ? "bg-black text-white border-black shadow-xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:text-black hover:border-black"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. D'TALE Modern Style Split Sort & Filter Bar (Sticky) */}
      <div className="sticky top-[84px] z-30 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          {/* Mobile Split 50/50 Bar */}
          <div className="grid grid-cols-2 divide-x divide-neutral-200 sm:hidden">
            <button
              type="button"
              onClick={() => setSortDrawerOpen(true)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium text-neutral-900 active:bg-neutral-100"
            >
              <ArrowUpDown size={14} />
              <span>Sort</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium text-neutral-900 active:bg-neutral-100"
            >
              <SlidersHorizontal size={14} />
              <span>Filter {activeMaterial !== "All" ? `(1)` : ""}</span>
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
                  onClick={() => setActiveMaterial("All")}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    activeMaterial === "All"
                      ? "bg-black text-white border-black"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black"
                  }`}
                >
                  All Woods
                </button>
                {WOOD_OPTIONS.map((wood) => (
                  <button
                    key={wood}
                    type="button"
                    onClick={() => setActiveMaterial(wood)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                      activeMaterial === wood
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
      {activeMaterial !== "All" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-3 flex items-center gap-2">
          <span className="text-[11px] text-neutral-500 font-sans">Active:</span>
          <button
            type="button"
            onClick={() => setActiveMaterial("All")}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[10px] font-sans font-medium rounded-full hover:bg-neutral-200 transition-colors"
          >
            <span>{activeMaterial}</span>
            <X size={12} />
          </button>
        </div>
      )}

      {/* 5. 2-Column Luxury Mobile Grid / 3-Column Desktop Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
        <div className="min-h-[300px]">
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
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <p className="text-neutral-500 font-sans text-sm font-light">
                No products found matching the selected filter options.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-semibold border-b border-black pb-0.5 hover:opacity-75 transition-opacity"
              >
                <RefreshCw size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile Filter Bottom Sheet */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Hardwood</h3>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {["All", ...WOOD_OPTIONS].map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => {
                    setActiveMaterial(mat);
                    setFilterDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 border text-xs font-sans ${
                    activeMaterial === mat
                      ? "border-black bg-black text-white font-medium"
                      : "border-neutral-200 text-neutral-800"
                  }`}
                >
                  <span>{mat === "All" ? "All Hardwoods" : mat}</span>
                  {activeMaterial === mat && <Check size={16} />}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMaterial("All");
                  setFilterDrawerOpen(false);
                }}
                className="w-full py-3 text-xs tracking-widest uppercase font-medium text-neutral-500 hover:text-black border border-neutral-200 text-center"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {sortDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Sort Catalog</h3>
              <button
                type="button"
                onClick={() => setSortDrawerOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full"
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
                      setSortDrawerOpen(false);
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

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CollectionContent />
    </Suspense>
  );
}

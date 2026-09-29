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
      activeCategory === "All" || product.category === activeCategory;
    
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
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="w-full bg-white min-h-screen">
      
      {/* Header section */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 py-10 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-2 sm:space-y-3">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Pattambi Workshop
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-950">
            Solid Hardwood Catalog
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-md mx-auto">
            Browse our bespoke solid wood designs. All pieces are custom manufactured in our Kerala workshop to your exact dimensions.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-12">
        
        {/* Horizontal Category Filter Pills (Mobile Edge Bleed) */}
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-1.5 scroll-smooth mb-6">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`text-[9px] sm:text-[10.5px] tracking-wider uppercase py-2 px-3.5 sm:px-4.5 transition-all whitespace-nowrap font-medium border ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-neutral-600 border-neutral-200 hover:text-black hover:border-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Mobile & Desktop Action Bar (Count, Sort, Filter Drawer Trigger) */}
        <div className="flex items-center justify-between border-t border-b border-neutral-100 py-3 mb-6 sm:mb-8 text-xs font-sans">
          
          {/* Result Count */}
          <span className="text-neutral-500 font-light text-[11px] sm:text-xs">
            <strong className="text-neutral-900 font-semibold">{sortedProducts.length}</strong> {sortedProducts.length === 1 ? "Creation" : "Creations"}
          </span>

          {/* Controls: Filter & Sort */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 border border-neutral-200 text-neutral-800 hover:border-black hover:text-black transition-colors text-[10px] sm:text-xs uppercase tracking-wider font-medium"
            >
              <SlidersHorizontal size={13} />
              <span>{activeMaterial === "All" ? "Filter" : activeMaterial}</span>
            </button>

            {/* Sort Control (Mobile Trigger / Desktop Select) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDrawerOpen(true)}
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

      {/* Mobile Filter Bottom Sheet */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Filter by Timber Material</h3>
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
                  className="w-full flex items-center justify-between py-3 text-sm text-left border-b border-neutral-50"
                >
                  <span className={activeMaterial === mat ? "font-semibold text-black" : "text-neutral-600 font-light"}>
                    {mat === "All" ? "All Hardwoods" : mat}
                  </span>
                  {activeMaterial === mat && <Check size={16} className="text-black" />}
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:hidden">
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-5 max-h-[80vh] overflow-y-auto shadow-2xl">
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
              {["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Name: A to Z"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSortOption(opt);
                    setSortDrawerOpen(false);
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

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light">
              Loading Catalog...
            </span>
          </div>
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}

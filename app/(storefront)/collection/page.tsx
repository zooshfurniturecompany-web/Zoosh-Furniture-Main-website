"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, getCategories, Product } from "@/hooks/use-products";

// Inner component to safely use search params inside Suspense
function CollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const products = useProducts();
  const categories = ["All", ...getCategories()];

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync category state with search query param
  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  // Update query params when category changes
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
    handleCategoryChange("All");
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
            Pattambi Workshop
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-950">
            Custom Solid Wood Catalog
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed max-w-lg mx-auto">
            Browse our solid wood designs. All pieces are made-to-order at our Pattambi factory to your exact dimensions and finish choices.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Filtering & Searching controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100 pb-8 mb-12">
          {/* Categories list */}
          <div className="flex items-center overflow-x-auto no-scrollbar py-2 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth space-x-2 md:space-x-3">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`text-[10px] tracking-widest uppercase py-2.5 px-5 transition-all duration-300 whitespace-nowrap font-light border ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search size={14} className="stroke-[1.5]" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-light font-sans tracking-wide bg-transparent border border-neutral-200 pl-10 pr-4 py-3 focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Results grid */}
        <div className="min-h-[300px]">
          {filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <p className="text-neutral-500 font-sans text-sm font-light">
                No products found matching the criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-2 text-[10px] tracking-widest uppercase text-black font-medium border-b border-black pb-0.5 hover:opacity-75 transition-opacity"
              >
                <RefreshCw size={10} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

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
    <div className="pt-20">
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
    </div>
  );
}

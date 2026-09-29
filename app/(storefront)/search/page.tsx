"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { Product, useProducts } from "@/hooks/use-products";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [searchInput, setSearchInput] = useState(query);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const allProducts = useProducts();

  const filteredProducts = allProducts.filter((product) => {
    if (!query) return false;
    const term = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.material.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 font-sans font-medium">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-neutral-900">Catalog Search</span>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center border border-neutral-200 focus-within:border-black">
            <span className="pl-4 text-neutral-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search catalog by name, wood, space..."
              className="w-full py-3.5 pl-3 pr-10 text-xs sm:text-sm font-sans focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 text-neutral-400 hover:text-black p-1"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-baseline justify-between border-b border-neutral-100 pb-3">
          <h1 className="font-serif text-xl sm:text-2xl text-neutral-900 font-light">
            {query ? `Results for "${query}"` : "Search Catalog"}
          </h1>
          <span className="text-xs text-neutral-400 font-sans font-light">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Found
          </span>
        </div>

        {/* 2-Column Mobile Grid / 3-Column Desktop Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24 space-y-4 max-w-md mx-auto">
            <Search size={36} className="mx-auto text-neutral-300 stroke-[1.2]" />
            <h3 className="font-serif text-lg text-neutral-900">No products found</h3>
            <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
              We couldn't find any designs matching your search. Try searching for woods like "Teak", "Ash", or spaces like "Dining" or "Living".
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["Sofa", "Dining Table", "Teak Wood", "Lounge Chair", "Bed Cot"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchInput(tag);
                    router.push(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="text-xs bg-neutral-100 hover:bg-black hover:text-white px-3 py-1.5 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Quick View Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light">
              Searching Catalog...
            </span>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}

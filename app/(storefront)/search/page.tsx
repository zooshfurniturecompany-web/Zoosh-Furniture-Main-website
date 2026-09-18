"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import Button from "@/components/ui/button";
import { Product, useProducts } from "@/hooks/use-products";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const allProducts = useProducts();

  // Simple, robust search matching logic
  const filteredProducts = allProducts.filter((product) => {
    if (!query) return false;
    const term = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.material.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="pt-8 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[10px] tracking-widest uppercase text-neutral-400 mb-6 font-sans font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-neutral-800">Search Results</span>
        </div>

        {/* Section Header */}
        <div className="mb-8 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
            Catalog Search
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900 leading-tight flex items-center">
            <Search size={24} className="mr-3 opacity-60 text-black stroke-[1.5]" />
            <span>Search results for: "{query || "None"}"</span>
          </h1>
          <p className="text-neutral-500 font-sans text-xs md:text-sm font-light">
            Showing all custom made-to-order furniture and solid wood products matching your search criteria.
          </p>
        </div>

        {/* Results grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-8 md:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-5 border border-neutral-100 bg-neutral-50/20 max-w-xl mx-auto p-8 shadow-sm">
            <Search size={48} className="text-neutral-300 stroke-[1.2]" />
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg text-neutral-900 font-light">No products found</h3>
              <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed max-w-sm">
                We couldn't find any catalog matches. Try searching for woods like "Teak", "Ash", or spaces like "Dining" or "Living".
              </p>
            </div>
            <div className="pt-2">
              <Button href="/" variant="primary">
                Return to Homepage
              </Button>
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

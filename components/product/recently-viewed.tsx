"use client";

import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { Product } from "@/hooks/use-products";

interface RecentlyViewedProps {
  currentProduct: Product;
  allProducts: Product[];
}

export default function RecentlyViewed({ currentProduct, allProducts }: RecentlyViewedProps) {
  const [viewedList, setViewedList] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load existing history
    const historyRaw = localStorage.getItem("zoosh_recent_products");
    let history: string[] = historyRaw ? JSON.parse(historyRaw) : [];

    // Remove current product if already there to push to top
    history = history.filter((slug) => slug !== currentProduct.slug);

    // Add current product at the beginning
    history.unshift(currentProduct.slug);

    // Limit to 5 items
    history = history.slice(0, 5);

    // Save back
    localStorage.setItem("zoosh_recent_products", JSON.stringify(history));

    // Filter out current product from display list
    const displaySlugs = history.filter((slug) => slug !== currentProduct.slug);

    // Get actual product objects
    const productsList = displaySlugs
      .map((slug) => allProducts.find((p) => p.slug === slug))
      .filter(Boolean) as Product[];

    setViewedList(productsList);
  }, [currentProduct.slug, allProducts]);

  if (viewedList.length === 0) return null;

  return (
    <div className="border-t border-neutral-100 mt-24 pt-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-sans block">
          Your Browsing History
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
          Recently Viewed Pieces
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {viewedList.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/use-products";
import { useCart } from "@/components/cart/cart-context";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  showSecondaryImage?: boolean;
}

export default function ProductCard({
  product,
  onQuickView,
  showSecondaryImage = true,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const primaryImage = product.images[0] || "/images/products/sf001-1.jpg";
  const secondaryImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { quantity: 1 });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  // Indian Currency Formatter
  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString("en-IN")}`
      : "₹40,000";

  // Calculate subtle MRP comparison reference (18-25% higher) for luxury retail feel
  const mrpPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${Math.round(product.price * 1.2).toLocaleString("en-IN")}`
      : "₹48,000";

  // Dynamic D'TALE Modern style tag
  let badgeLabel = "ZOOSH EDIT";
  if (product.featured) {
    badgeLabel = "BEST SELLER";
  } else if (product.sku.endsWith("1") || product.sku.endsWith("2")) {
    badgeLabel = "NEW ARRIVAL";
  }

  return (
    <div
      className="product-card group relative flex flex-col justify-between bg-white text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1:1 Aspect Ratio Luxury Square Image Container (D'TALE Modern Style) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f7f7f7] border border-neutral-100">
        
        {/* Top-Left Corner Tag Badge (D'TALE MODERN / LUXURY STYLE) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-black text-white text-[8px] sm:text-[9px] font-sans font-semibold tracking-[0.14em] uppercase px-2 py-1 shadow-xs">
            {badgeLabel}
          </span>
        </div>

        {/* Top-Right Circular Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-sm"
          aria-label="Save to wishlist"
        >
          <Heart
            size={13}
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-neutral-700"}`}
          />
        </button>

        {/* Product Image Link */}
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <div className="absolute inset-0">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              unoptimized={primaryImage.startsWith("data:") || primaryImage.startsWith("http")}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                showSecondaryImage && product.images.length > 1 && isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
            {/* Secondary Image on Hover */}
            {showSecondaryImage && product.images.length > 1 && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                unoptimized={secondaryImage.startsWith("data:") || secondaryImage.startsWith("http")}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover object-center absolute inset-0 transition-all duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />
            )}
          </div>
        </Link>

        {/* Desktop Quick Add Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden sm:block z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-white/95 hover:bg-black hover:text-white text-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase py-2.5 font-medium transition-colors duration-200 shadow-sm border border-neutral-200"
          >
            {addedNotice ? "Added to Bag ✓" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Product Details Section (Matching D'TALE Modern Architecture) */}
      <div className="flex flex-col pt-2.5 sm:pt-3 space-y-1.5">
        {/* Made to Order Pill + Timber Spec */}
        <div className="flex items-center justify-between">
          <span className="inline-block bg-[#f0f0f0] text-neutral-800 text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5">
            Made to Order
          </span>
          {product.material && (
            <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-widest font-sans truncate max-w-[100px]">
              {product.material.split(" ")[0]}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-xs sm:text-sm md:text-[14px] text-neutral-900 group-hover:text-neutral-600 transition-colors duration-200 leading-snug line-clamp-2 font-normal">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing Block with Indian Rupee & MRP Strikethrough */}
        <div className="pt-0.5 flex items-baseline gap-2">
          <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-950 font-sans tracking-tight tabular-nums">
            {formattedPrice}
          </span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through font-sans tabular-nums font-light">
            {mrpPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

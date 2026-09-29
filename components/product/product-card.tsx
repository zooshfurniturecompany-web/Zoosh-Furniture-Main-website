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

  return (
    <div
      className="product-card group relative flex flex-col justify-between bg-white text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect Square (1:1) Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 border border-neutral-100">
        
        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-black transition-colors shadow-xs"
          aria-label="Save to wishlist"
        >
          <Heart
            size={13}
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-neutral-700"}`}
          />
        </button>

        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {/* Primary Image */}
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

        {/* Quick Add Overlay on Desktop & Quick Touch Bar */}
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

      {/* Product Information */}
      <div className="flex flex-col pt-2.5 sm:pt-3 space-y-1">
        {/* Subtle Made to Order badge */}
        <div className="flex items-center justify-between">
          <span className="inline-block bg-[#f4f4f4] text-neutral-800 text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5">
            Made to Order
          </span>
          {product.material && (
            <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-widest font-sans truncate max-w-[100px]">
              {product.material.split(" ")[0]}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-xs sm:text-sm md:text-[15px] text-neutral-900 group-hover:text-neutral-600 transition-colors duration-200 leading-snug line-clamp-1 font-medium">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Clean Bold Price (Homework Living minimal format) */}
        <div className="pt-0.5">
          <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-950 font-sans tracking-tight block tabular-nums">
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

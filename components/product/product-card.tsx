"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/hooks/use-products";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const primaryImage = product.images[0];

  return (
    <div
      className="group relative flex flex-col justify-between bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Gallery Container with 1:1 square ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-black transition-colors shadow-xs"
          aria-label="Save to wishlist"
        >
          <Heart
            size={14}
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-neutral-700"}`}
          />
        </button>

        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {/* Primary Image - square cropped like Siena L Shape Sofa */}
          <div className="absolute inset-0">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              unoptimized={primaryImage?.startsWith("data:") || primaryImage?.startsWith("http")}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority={false}
            />
          </div>
        </Link>

        {/* Quick View Floating Overlay (Desktop) */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-white/95 text-black text-[9px] tracking-[0.2em] uppercase py-3 hover:bg-black hover:text-white transition-colors duration-300 shadow-md font-light border border-neutral-100"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Info Section - Dtale Modern Style */}
      <div className="flex flex-col pt-3.5 space-y-1.5">
        {/* Made to order badge */}
        <div>
          <span className="inline-block bg-[#f0f0f0] text-neutral-800 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5">
            Made to Order
          </span>
        </div>
        
        {/* Product Title */}
        <h3 className="font-sans text-sm sm:text-base md:text-[15px] text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300 leading-snug line-clamp-1 font-medium">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Bold Price Block */}
        <div className="pt-0.5">
          {product.price && product.price > 0 ? (
            <div className="space-y-0.5">
              <span className="text-base sm:text-lg font-bold text-neutral-950 font-sans tracking-tight block tabular-nums">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 font-sans font-light tracking-wide block truncate">
                Excl. GST & Taxes | Custom made in Pattambi factory
              </span>
            </div>
          ) : (
            <span className="text-neutral-500 font-sans text-xs italic">Enquire for Price</span>
          )}
        </div>
      </div>
    </div>
  );
}

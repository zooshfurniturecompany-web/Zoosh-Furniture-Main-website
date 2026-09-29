"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Truck, ShieldCheck, Check, CornerDownLeft } from "lucide-react";
import { Product } from "@/lib/products-utils";
import { useCart } from "@/components/cart/cart-context";
import ShareButton from "@/components/product/share-button";

interface ProductDetailViewProps {
  product: Product;
  subcategoryName: string;
  roomSlug: string;
  subcategorySlug: string;
}

export default function ProductDetailView({
  product,
  subcategoryName,
  roomSlug,
  subcategorySlug,
}: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Formatted Price in Indian Rupees
  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString("en-IN")}`
      : "₹40,000";

  const handleAddToCart = () => {
    addItem(product, { quantity });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // WhatsApp Customization Link
  const phoneNumber = "919567193992";
  const whatsappMessage = `Hello ZOOSH,

I would like to enquire about / customise this product:

Product: ${product.name} (SKU: ${product.sku})
Price: ${formattedPrice}

Could you please share custom finish & dimensional options?

Thank you.`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full space-y-5 lg:sticky lg:top-32 bg-white">
      
      {/* 1. Header: Category & Share */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-semibold">
            {subcategoryName} • Bespoke Atelier
          </span>
          <ShareButton />
        </div>

        {/* Product Title */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 tracking-wide leading-tight">
          {product.name}
        </h1>

        {/* SKU & Stock Status */}
        <div className="flex items-center justify-between text-[10px] tracking-wider text-neutral-400 font-sans uppercase pt-0.5">
          <span>SKU: {product.sku}</span>
          <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-xs">
            Made to Order in Kerala
          </span>
        </div>
      </div>

      {/* 2. Clean Minimal Price Display */}
      <div className="py-3 border-t border-b border-neutral-100 space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight tabular-nums">
            {formattedPrice}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-sans font-light tracking-wide">
          Tax included • Shipping calculated at checkout
        </p>
      </div>

      {/* 3. PRODUCT OVERVIEW (Between Price & Add to Cart) */}
      <div className="pt-1 pb-3 space-y-2 border-b border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold">
          Product Overview
        </h3>
        <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
          {product.description ||
            "Handcrafted in treated solid hardwood with a smooth melamine matte finish. Built specifically to order with reinforced mortise-and-tenon structural joints."}
        </p>
      </div>

      {/* 4. TECHNICAL SPECIFICATIONS (Between Price & Add to Cart) */}
      <div className="py-2 space-y-3 font-sans text-xs border-b border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold">
          Specifications
        </h3>
        <div className="space-y-2 divide-y divide-neutral-100">
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 font-light">Timber Material</span>
            <span className="text-neutral-900 font-medium">{product.material || product.specs?.material || "Solid Teakwood"}</span>
          </div>

          {product.finish && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400 font-light">Finish / Sealer</span>
              <span className="text-neutral-900 font-medium">{product.finish}</span>
            </div>
          )}

          {product.fabric && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400 font-light">Fabric Upholstery</span>
              <span className="text-neutral-900 font-medium">{product.fabric}</span>
            </div>
          )}

          {product.rattan && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400 font-light">Rattan Crafting</span>
              <span className="text-neutral-900 font-medium">{product.rattan}</span>
            </div>
          )}

          {/* Dimensions */}
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 font-light">Dimensions</span>
            <span className="text-neutral-900 font-medium tabular-nums">{product.dimensions || product.specs?.dimensions || "Standard"}</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 font-light">Atelier Origin</span>
            <span className="text-neutral-900 font-medium">Pattambi Workshop, Kerala</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-400 font-light">Structural Warranty</span>
            <span className="text-neutral-900 font-medium">5-Year Frame Warranty</span>
          </div>
        </div>
      </div>

      {/* 5. Delivery Information Callout Box */}
      <div className="p-3.5 sm:p-4 bg-neutral-50 border border-neutral-100 flex items-start gap-3 text-xs font-sans text-neutral-700">
        <Truck size={18} className="text-neutral-900 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold text-neutral-900 block">White-Glove Insured Delivery:</strong>
          <p className="font-light text-neutral-600 leading-relaxed">
            Custom built to order in our Pattambi factory workshop. Estimated dispatch within 10–15 business days across India.
          </p>
        </div>
      </div>

      {/* 6. Quantity Selector & CTAs (ADD TO CART & CUSTOMISE) */}
      <div className="space-y-4 pt-1">
        
        {/* Quantity Stepper (44px min touch target) */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-800 font-sans">
            Quantity
          </label>
          <div className="inline-flex items-center border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:text-black font-mono text-base active:bg-neutral-100 transition-colors"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="w-12 text-center text-sm font-sans font-medium tabular-nums select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:text-black font-mono text-base active:bg-neutral-100 transition-colors"
              aria-label="Increase quantity"
            >
              &#43;
            </button>
          </div>
        </div>

        {/* Primary CTA: ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white text-xs font-sans tracking-[0.25em] uppercase py-4 font-medium transition-all shadow-sm text-center flex items-center justify-center gap-2"
        >
          {addedNotice ? (
            <>
              <Check size={16} className="text-emerald-400" />
              <span>Added to Bag ✓</span>
            </>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>

        {/* Secondary CTA: CUSTOMISE THIS PRODUCT */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-sans tracking-[0.25em] uppercase py-3.5 font-medium transition-colors"
        >
          <Send size={13} />
          <span>Customise This Product</span>
        </a>
      </div>

      {/* Return Navigation */}
      <div className="pt-2 text-center">
        <Link
          href={`/${roomSlug}/${subcategorySlug}`}
          className="inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors"
        >
          <CornerDownLeft size={10} />
          <span>Back to {subcategoryName}</span>
        </Link>
      </div>

    </div>
  );
}

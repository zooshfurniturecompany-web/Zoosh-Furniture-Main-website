"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Truck, ShieldCheck, Check, CornerDownLeft, Sparkles, Ruler, Award } from "lucide-react";
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

  // Available options
  const woodOptions = product.variants?.woods && product.variants.woods.length > 0
    ? product.variants.woods
    : ["Solid Teak Wood", "Premium Ash Wood", "Selected Mahogany Wood"];
  
  const [selectedWood, setSelectedWood] = useState(woodOptions[0]);

  const finishOptions = ["Matte Natural Polish", "Warm Walnut Polish", "Smoked Charcoal"];
  const [selectedFinish, setSelectedFinish] = useState(finishOptions[0]);

  // Formatted Price in Indian Rupees
  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString("en-IN")}`
      : "₹40,000";

  // Comparison MRP Price for retail reference
  const mrpPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${Math.round(product.price * 1.2).toLocaleString("en-IN")}`
      : "₹48,000";

  const handleAddToCart = () => {
    addItem(product as any, {
      quantity,
      wood: selectedWood,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // WhatsApp Customization Link
  const phoneNumber = "919567193992";
  const whatsappMessage = `Hello ZOOSH,

I would like to enquire about / customise this product:

Product: ${product.name} (SKU: ${product.sku})
Selected Timber: ${selectedWood}
Finish: ${selectedFinish}
Price: ${formattedPrice}

Could you please share dimensional customisations and timeline?

Thank you.`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full space-y-6 lg:sticky lg:top-28 bg-white">
      
      {/* 1. Header: Category Tag & Share */}
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

        {/* SKU & Made to order badge */}
        <div className="flex items-center justify-between text-[10px] tracking-wider text-neutral-400 font-sans uppercase pt-0.5">
          <span>SKU: {product.sku}</span>
          <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-xs">
            Made to Order in Kerala
          </span>
        </div>
      </div>

      {/* 2. D'TALE Modern / Luxury Pricing Block */}
      <div className="py-3.5 border-t border-b border-neutral-100 space-y-1.5 bg-neutral-50/40 p-4 rounded-lg">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight tabular-nums">
            {formattedPrice}
          </span>
          <span className="font-sans text-xs sm:text-sm text-neutral-400 line-through tabular-nums font-light">
            {mrpPrice}
          </span>
          <span className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
            Save 18%
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 font-sans font-light tracking-wide flex items-center gap-1.5">
          <span>Inclusive of all taxes</span>
          <span>•</span>
          <span className="text-neutral-800 font-medium">Free White-Glove Installation</span>
        </p>
      </div>

      {/* 3. Timber Selection (Interactive Pills) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-sans">
          <span className="font-semibold text-neutral-900">Timber Hardwood:</span>
          <span className="text-neutral-500 font-light">{selectedWood}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {woodOptions.map((wood) => {
            const isSelected = selectedWood === wood;
            return (
              <button
                key={wood}
                type="button"
                onClick={() => setSelectedWood(wood)}
                className={`text-xs px-3.5 py-2 border font-sans transition-all text-left ${
                  isSelected
                    ? "border-black bg-black text-white font-medium shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-400 text-neutral-700"
                }`}
              >
                {wood}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Finish Selection (Interactive Pills) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-sans">
          <span className="font-semibold text-neutral-900">Finish / Sealer:</span>
          <span className="text-neutral-500 font-light">{selectedFinish}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {finishOptions.map((finish) => {
            const isSelected = selectedFinish === finish;
            return (
              <button
                key={finish}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                className={`text-xs px-3.5 py-2 border font-sans transition-all text-left ${
                  isSelected
                    ? "border-black bg-black text-white font-medium shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-400 text-neutral-700"
                }`}
              >
                {finish}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PRODUCT OVERVIEW (Between Price & Add to Cart — Open & Un-collapsed) */}
      <div className="pt-2 pb-3 space-y-2 border-t border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-1.5">
          <Sparkles size={13} className="text-neutral-500" />
          <span>Product Overview</span>
        </h3>
        <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
          {product.description ||
            "Masterfully handcrafted in seasoned Kerala hardwood with a tactile matte finish. Built specifically to order with reinforced mortise-and-tenon structural joinery for multi-generational durability."}
        </p>
      </div>

      {/* 6. TECHNICAL SPECIFICATIONS (Between Price & Add to Cart — Clean Structured Table) */}
      <div className="py-2 space-y-3 font-sans text-xs border-t border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-1.5">
          <Ruler size={13} className="text-neutral-500" />
          <span>Technical Specifications</span>
        </h3>
        <div className="space-y-1.5 divide-y divide-neutral-100 bg-neutral-50/60 p-3.5 rounded-lg border border-neutral-100">
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Timber Wood</span>
            <span className="text-neutral-900 font-medium text-right">{selectedWood}</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Finish / Polish</span>
            <span className="text-neutral-900 font-medium text-right">{selectedFinish}</span>
          </div>

          {product.fabric && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500 font-light">Fabric Upholstery</span>
              <span className="text-neutral-900 font-medium text-right">{product.fabric}</span>
            </div>
          )}

          {product.rattan && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500 font-light">Rattan Crafting</span>
              <span className="text-neutral-900 font-medium text-right">{product.rattan}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Standard Dimensions</span>
            <span className="text-neutral-900 font-medium text-right tabular-nums">
              {product.dimensions || product.specs?.dimensions || "Standard"}
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Structural Warranty</span>
            <span className="text-neutral-900 font-medium text-right">5-Year Generational Warranty</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Atelier Origin</span>
            <span className="text-neutral-900 font-medium text-right">Pattambi Workshop, Kerala</span>
          </div>
        </div>
      </div>

      {/* 7. Insured Delivery & Service Value Pillars */}
      <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-lg space-y-2 text-xs font-sans text-neutral-700">
        <div className="flex items-start gap-3">
          <Truck size={17} className="text-neutral-900 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-semibold text-neutral-900 block">Pan-India White-Glove Delivery:</strong>
            <p className="font-light text-neutral-600 leading-relaxed text-[11px]">
              Custom handcrafted to order in our Kerala workshop. Dispatched with insured freight in 10–15 business days.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-600 font-light border-t border-neutral-200/60">
          <Award size={14} className="text-neutral-800 shrink-0" />
          <span>Custom dimensions and stain customization available on request.</span>
        </div>
      </div>

      {/* 8. Quantity Stepper & Primary CTAs */}
      <div className="space-y-3.5 pt-1">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-800 font-sans">
            Quantity
          </span>
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

        {/* Primary CTA: ADD TO BAG */}
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

        {/* Secondary CTA: CUSTOMISE VIA WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-sans tracking-[0.25em] uppercase py-3.5 font-medium transition-colors"
        >
          <Send size={13} />
          <span>Customise via WhatsApp</span>
        </a>
      </div>

      {/* Return Link */}
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

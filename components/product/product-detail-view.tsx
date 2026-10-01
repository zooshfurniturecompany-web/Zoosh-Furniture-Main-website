"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Truck, ShieldCheck, Check, CornerDownLeft, Sparkles, Ruler, Calendar, CheckCircle2 } from "lucide-react";
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

  // Dynamic 30-45 days estimated delivery calculation based on today's live date
  const [deliveryInfo, setDeliveryInfo] = useState({
    startStr: "",
    endStr: "",
    daysRange: "30–45 Days",
  });

  useEffect(() => {
    const today = new Date();
    let minDays = 30;
    let maxDays = 45;

    const cat = (product.category || "").toLowerCase();
    if (cat.includes("sofa") || cat.includes("bed") || cat.includes("sectional")) {
      minDays = 35;
      maxDays = 45;
    } else if (
      cat.includes("chair") ||
      cat.includes("table") ||
      cat.includes("stool") ||
      cat.includes("bench") ||
      cat.includes("mirror")
    ) {
      minDays = 30;
      maxDays = 40;
    }

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + minDays);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + maxDays);

    const formatShort: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const formatFull: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };

    setDeliveryInfo({
      startStr: startDate.toLocaleDateString("en-IN", formatShort),
      endStr: endDate.toLocaleDateString("en-IN", formatFull),
      daysRange: `${minDays}–${maxDays} Days`,
    });
  }, [product.category]);

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
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // WhatsApp Customization Link
  const phoneNumber = "919567193992";
  const whatsappMessage = `Hello ZOOSH,

I would like to enquire about / customise this product:

Product: ${product.name} (SKU: ${product.sku})
Price: ${formattedPrice} (Inclusive of all taxes & PAN India shipping)

Could you please share details on custom sizes and timeline?

Thank you.`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full space-y-6 lg:sticky lg:top-28 bg-white">
      
      {/* 1. Header: Subcategory & Share */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-semibold">
            {subcategoryName}
          </span>
          <ShareButton />
        </div>

        {/* Product Title */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 tracking-wide leading-tight">
          {product.name}
        </h1>

        {/* SKU & Made to Order Tag */}
        <div className="flex items-center justify-between text-[10px] tracking-wider text-neutral-400 font-sans uppercase pt-0.5">
          <span>SKU: {product.sku}</span>
          <span className="text-neutral-800 font-medium bg-neutral-100 px-2 py-0.5">
            Made to Order
          </span>
        </div>
      </div>

      {/* 2. D'TALE Modern / Homework Living Style Price & Value Block */}
      <div className="py-4 px-4 sm:px-5 border border-neutral-200 bg-neutral-50/50 rounded-sm space-y-2.5">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight tabular-nums">
            {formattedPrice}
          </span>
          <span className="font-sans text-xs sm:text-sm text-neutral-400 line-through tabular-nums font-light">
            {mrpPrice}
          </span>
        </div>

        {/* Highlight: Inclusive of Taxes & PAN India Shipping */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-sans text-neutral-700 pt-1 border-t border-neutral-200/70">
          <div className="flex items-center gap-1 text-emerald-800 font-medium">
            <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
            <span>Inclusive of all taxes</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-900 font-medium">
            <Truck size={13} className="text-neutral-700 shrink-0" />
            <span>Free PAN India Shipping</span>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Estimated Delivery Date Box (Updates live tomorrow to next 30-45 days) */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50/40 border border-amber-200/60 rounded-sm text-xs font-sans">
        <Calendar size={16} className="text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              Estimated Delivery: {deliveryInfo.daysRange}
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 font-light">
            {deliveryInfo.startStr && deliveryInfo.endStr ? (
              <>
                Order today to receive between{" "}
                <strong className="font-medium text-neutral-900">
                  {deliveryInfo.startStr} – {deliveryInfo.endStr}
                </strong>
                .
              </>
            ) : (
              "Standard dispatch & delivery time is 30–45 days."
            )}
          </p>
        </div>
      </div>

      {/* 4. PRODUCT OVERVIEW (Clean, un-collapsed text) */}
      <div className="pt-2 pb-1 space-y-2 border-t border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-1.5">
          <Sparkles size={13} className="text-neutral-500" />
          <span>Product Overview</span>
        </h3>
        <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
          {product.description ||
            "Masterfully handcrafted in premium solid wood with fine joinery and durable finishing. Each piece is individually crafted to order with uncompromising attention to detail."}
        </p>
      </div>

      {/* 5. TECHNICAL SPECIFICATIONS (Clean Open Key-Value Table) */}
      <div className="py-2 space-y-2.5 font-sans text-xs border-t border-neutral-100">
        <h3 className="font-serif text-xs uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-1.5">
          <Ruler size={13} className="text-neutral-500" />
          <span>Technical Specifications</span>
        </h3>
        <div className="space-y-1 divide-y divide-neutral-100 bg-neutral-50/50 p-3.5 rounded-sm border border-neutral-100">
          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Dimensions</span>
            <span className="text-neutral-900 font-medium text-right tabular-nums">
              {product.dimensions || product.specs?.dimensions || "Standard"}
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Primary Material</span>
            <span className="text-neutral-900 font-medium text-right">
              {product.material || product.specs?.material || "Solid Hardwood"}
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Finish / Polish</span>
            <span className="text-neutral-900 font-medium text-right">
              {product.finish || product.specs?.finish || "Natural Matte Finish"}
            </span>
          </div>

          {/* Only render fabric if defined in product data */}
          {product.fabric && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500 font-light">Fabric Upholstery</span>
              <span className="text-neutral-900 font-medium text-right">{product.fabric}</span>
            </div>
          )}

          {/* Only render rattan if defined in product data */}
          {product.rattan && (
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500 font-light">Rattan Crafting</span>
              <span className="text-neutral-900 font-medium text-right">{product.rattan}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Warranty</span>
            <span className="text-neutral-900 font-medium text-right">5 Years Warranty</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-neutral-500 font-light">Shipping</span>
            <span className="text-neutral-900 font-medium text-right">PAN India Insured Shipping</span>
          </div>
        </div>
      </div>

      {/* 6. Trust Assurance Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs font-sans text-neutral-700 pt-1">
        <div className="flex items-center gap-2 p-2.5 bg-neutral-50 border border-neutral-100 rounded-sm">
          <ShieldCheck size={16} className="text-neutral-800 shrink-0" />
          <span className="text-[11px] font-medium">5 Years Warranty</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-neutral-50 border border-neutral-100 rounded-sm">
          <Truck size={16} className="text-neutral-800 shrink-0" />
          <span className="text-[11px] font-medium">PAN India Delivery</span>
        </div>
      </div>

      {/* 7. Quantity Stepper & Primary CTAs */}
      <div className="space-y-3 pt-1">
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

        {/* Primary CTA: ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white text-xs font-sans tracking-[0.25em] uppercase py-4 font-medium transition-all shadow-sm text-center flex items-center justify-center gap-2"
        >
          {addedNotice ? (
            <>
              <Check size={16} className="text-emerald-400" />
              <span>Added to Cart ✓</span>
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

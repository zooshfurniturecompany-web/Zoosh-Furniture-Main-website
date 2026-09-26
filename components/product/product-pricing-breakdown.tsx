"use client";

import { Send, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { Product } from "@/hooks/use-products";

interface ProductPricingBreakdownProps {
  product?: Product;
  productName: string;
  productSku: string;
  basePrice?: number;
  priceBreakdown?: Array<{ label: string; price: number; note?: string }>;
}

export default function ProductPricingBreakdown({
  product,
  productName,
  productSku,
  basePrice,
  priceBreakdown,
}: ProductPricingBreakdownProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedWood, setSelectedWood] = useState<string>(product?.material || "Teak Wood");

  const priceInfo = basePrice ? ` (Base Price: ₹${basePrice.toLocaleString("en-IN")})` : "";
  const customWhatsAppMsg = `Hello ZOOSH,

I am interested in:
Product: ${productName} (SKU: ${productSku})${priceInfo}
Wood Choice: ${selectedWood}

Please share available finishes, custom dimensions, and delivery timeframe.

Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(customWhatsAppMsg)}`;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, { wood: selectedWood });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Price breakdown table if multiple sizing tiers exist */}
      {priceBreakdown && priceBreakdown.length > 0 && (
        <div className="bg-neutral-50/70 border border-neutral-100 rounded p-3.5 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-sans block font-semibold">
            Dimension & Size Pricing:
          </span>
          <div className="space-y-1.5 text-xs font-sans">
            {priceBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-neutral-700">
                <span className="font-light">{item.label}</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add to Bag and WhatsApp CTA Buttons */}
      <div className="flex flex-col gap-3">
        {product && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-black text-white text-xs tracking-[0.2em] uppercase py-4 transition-all duration-200 font-sans font-medium shadow-xs group"
          >
            {added ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        )}

        <a
          href={dynamicWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center space-x-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs tracking-[0.2em] uppercase py-3.5 transition-all duration-200 font-sans font-medium"
        >
          <Send size={13} />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>

      <p className="text-center text-[10px] text-neutral-400 leading-relaxed font-sans font-light">
        Bespoke dimensions & timber polish options available at our Pattambi factory.<br />
        Direct WhatsApp: +91 9567193992
      </p>
    </div>
  );
}

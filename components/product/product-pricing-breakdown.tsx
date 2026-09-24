"use client";

import { Send } from "lucide-react";

interface ProductPricingBreakdownProps {
  productName: string;
  productSku: string;
  basePrice?: number;
  priceBreakdown?: Array<{ label: string; price: number; note?: string }>;
}

export default function ProductPricingBreakdown({
  productName,
  productSku,
  basePrice,
  priceBreakdown,
}: ProductPricingBreakdownProps) {
  const priceInfo = basePrice ? ` (Base Price: ₹${basePrice.toLocaleString("en-IN")})` : "";
  const customWhatsAppMsg = `Hello ZOOSH,

I am interested in:
Product: ${productName} (SKU: ${productSku})${priceInfo}

Please share available finishes, custom dimensions, and delivery timeframe.

Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(customWhatsAppMsg)}`;

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

      <a
        href={dynamicWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center space-x-3 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.25em] uppercase py-4.5 transition-colors font-sans font-medium shadow-sm group"
      >
        <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
        <span>Enquire on WhatsApp</span>
      </a>
      <p className="text-center text-[10px] text-neutral-400 leading-relaxed font-sans font-light">
        Bespoke dimensions & timber polish options available at our Pattambi factory.<br />
        Direct WhatsApp: +91 9567193992
      </p>
    </div>
  );
}


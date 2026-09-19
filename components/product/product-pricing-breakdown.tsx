"use client";

import { Send } from "lucide-react";

interface ProductPricingBreakdownProps {
  productName: string;
  productSku: string;
  basePrice: number;
}

export default function ProductPricingBreakdown({
  productName,
  productSku,
  basePrice,
}: ProductPricingBreakdownProps) {
  const formattedPrice = basePrice ? basePrice.toLocaleString("en-IN") : "Price on Request";
  const customWhatsAppMsg = `Hello ZOOSH,

I am interested in:
Product: ${productName} (SKU: ${productSku})
Price: ₹${formattedPrice} (Excl. GST)

Please share availability, finish options, and delivery timeframe.

Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(customWhatsAppMsg)}`;

  return (
    <div className="space-y-4 pt-1">
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


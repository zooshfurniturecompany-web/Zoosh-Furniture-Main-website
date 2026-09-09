"use client";

import { useState } from "react";
import { PriceOption, DimensionItem, getWhatsAppLink } from "@/hooks/use-products";
import { Send, CheckCircle2 } from "lucide-react";

interface ProductPricingBreakdownProps {
  productName: string;
  productSku: string;
  basePrice: number;
  priceBreakdown?: PriceOption[] | null;
  dimensionBreakdown?: DimensionItem[] | null;
}

export default function ProductPricingBreakdown({
  productName,
  productSku,
  basePrice,
  priceBreakdown,
  dimensionBreakdown
}: ProductPricingBreakdownProps) {
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(
    priceBreakdown && priceBreakdown.length > 0 ? priceBreakdown[0] : null
  );

  const activePrice = selectedOption ? selectedOption.price : basePrice;
  const activeLabel = selectedOption ? selectedOption.label : "Standard";

  const customWhatsAppMsg = `Hello ZOOSH,

I am interested in:
Product Name: ${productName} (SKU: ${productSku})
Selected Option: ${activeLabel}
Price: ₹${activePrice.toLocaleString("en-IN")} (Excl. GST)

Please share availability and delivery timeframe. Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(customWhatsAppMsg)}`;

  return (
    <div className="space-y-5">
      {/* Dynamic Main Bold Price */}
      <div className="pt-1">
        <div className="space-y-1">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight block">
            ₹{activePrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-neutral-500 font-sans font-light tracking-wide block">
            Excl. GST & Taxes | Custom made to order in Pattambi factory
          </span>
        </div>
      </div>

      {/* Dedicated Set Configuration & Individual Pricing Box */}
      {priceBreakdown && priceBreakdown.length > 0 && (
        <div className="border border-neutral-200 bg-neutral-50/80 p-4 rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-sans font-semibold">
              Select Configuration:
            </span>
            <span className="text-[9px] text-neutral-400 font-sans">Click to select piece</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {priceBreakdown.map((opt) => {
              const isSelected = selectedOption?.label === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`flex items-center justify-between p-3 text-left transition-all rounded-xs border ${
                    isSelected
                      ? "bg-white border-black shadow-xs ring-1 ring-black/10"
                      : "bg-white/70 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? "border-black bg-black text-white" : "border-neutral-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span
                      className={`text-xs font-sans ${
                        isSelected ? "font-medium text-neutral-950" : "font-light text-neutral-700"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>

                  <span className="text-xs font-bold font-sans text-neutral-950">
                    ₹{opt.price.toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WhatsApp Enquiry Button linked to active selection */}
      <div className="space-y-4 pt-1">
        <a
          href={dynamicWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center space-x-3 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.25em] uppercase py-4.5 transition-colors font-light shadow-md"
        >
          <Send size={14} className="animate-pulse" />
          <span>Enquire on WhatsApp</span>
        </a>
        <p className="text-center text-[10px] text-neutral-400 leading-relaxed font-sans font-light">
          Our bespoke design advisor is available to guide your configuration.<br />
          WhatsApp Direct: +91 9567193992
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Variants {
  woods?: string[];
  colors?: string[];
  fabrics?: string[];
  sizes?: string[];
}

interface VariantSelectorProps {
  variants: Variants;
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  const [selectedWood, setSelectedWood] = useState(variants.woods?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(variants.colors?.[0] || "");
  const [selectedFabric, setSelectedFabric] = useState(variants.fabrics?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(variants.sizes?.[0] || "");

  const hasVariants =
    (variants.woods && variants.woods.length > 0) ||
    (variants.colors && variants.colors.length > 0) ||
    (variants.fabrics && variants.fabrics.length > 0) ||
    (variants.sizes && variants.sizes.length > 0);

  if (!hasVariants) return null;

  return (
    <div className="space-y-6 border-t border-neutral-100 pt-6">
      {/* Wood Options */}
      {variants.woods && variants.woods.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-sans block">
            Select Finish / Material: <span className="text-black font-medium">{selectedWood}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.woods.map((wood) => (
              <button
                key={wood}
                onClick={() => setSelectedWood(wood)}
                className={`text-[10px] font-sans tracking-wider px-3.5 py-2 border transition-all duration-300 ${
                  selectedWood === wood
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {wood}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fabric Options */}
      {variants.fabrics && variants.fabrics.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-sans block">
            Select Fabric Type: <span className="text-black font-medium">{selectedFabric}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.fabrics.map((fabric) => (
              <button
                key={fabric}
                onClick={() => setSelectedFabric(fabric)}
                className={`text-[10px] font-sans tracking-wider px-3.5 py-2 border transition-all duration-300 ${
                  selectedFabric === fabric
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {fabric}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Options */}
      {variants.colors && variants.colors.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-sans block">
            Select Color tone: <span className="text-black font-medium">{selectedColor}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`text-[10px] font-sans tracking-wider px-3.5 py-2 border transition-all duration-300 ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Options */}
      {variants.sizes && variants.sizes.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-sans block">
            Select Size Scale: <span className="text-black font-medium">{selectedSize}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[10px] font-sans tracking-wider px-3.5 py-2 border transition-all duration-300 ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

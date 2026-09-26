"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, Send, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalCount } = useCart();

  const freeShippingThreshold = 50000;
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Generate customized WhatsApp Order message
  const whatsappItemsText = items
    .map((item, idx) => `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${item.quantity} - ₹${((item.product.price || 0) * item.quantity).toLocaleString("en-IN")}`)
    .join("\n");

  const whatsappCheckoutMsg = `Hello ZOOSH,

I would like to place an order for the items in my shopping bag:

${whatsappItemsText}

Subtotal: ₹${subtotal.toLocaleString("en-IN")}

Please confirm delivery timeline and payment details.

Thank you.`;

  const dynamicWhatsAppUrl = `https://wa.me/919567193992?text=${encodeURIComponent(whatsappCheckoutMsg)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-neutral-900 uppercase tracking-wider">
                  Shopping Bag
                </h3>
                <span className="text-xs font-mono text-neutral-400">({totalCount})</span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-xs font-sans text-neutral-600">
              <p className="mb-1.5 font-light">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-medium">✓ You qualify for Free Factory Crating & Pan-India Transport</span>
                ) : (
                  <span>Add <strong>₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")}</strong> more for Free Shipping</span>
                )}
              </p>
              <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-black h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 pb-6 border-b border-neutral-100 items-start">
                    <div className="w-20 h-20 aspect-square bg-neutral-100 flex-shrink-0 overflow-hidden relative border border-neutral-100">
                      <Image
                        src={item.product.images[0] || "/images/products/sf001-1.jpg"}
                        alt={item.product.name}
                        fill
                        unoptimized={item.product.images[0]?.startsWith("data:") || item.product.images[0]?.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-sans text-xs font-medium text-neutral-900 line-clamp-1">
                        <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-sans tracking-wide uppercase">
                        {item.selectedWood || item.product.material}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-neutral-200 rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-mono">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-neutral-950 font-sans tabular-nums">
                          ₹{((item.product.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag size={36} className="mx-auto text-neutral-300 stroke-[1.2]" />
                  <p className="font-sans text-sm text-neutral-400 font-light">Your bag is currently empty.</p>
                  <button
                    onClick={closeCart}
                    className="inline-block text-xs font-sans tracking-widest uppercase font-semibold border-b border-black pb-0.5"
                  >
                    Explore Furniture
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-white space-y-4">
                <div className="flex items-center justify-between font-sans text-sm">
                  <span className="text-neutral-500 font-light uppercase tracking-wider text-xs">Subtotal</span>
                  <span className="font-semibold text-neutral-950 text-base tabular-nums">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans font-light">
                  Excl. GST & Taxes. Handcrafted & custom built at Pattambi workshop.
                </p>

                <div className="space-y-2.5">
                  <a
                    href={dynamicWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-900 text-white text-xs font-sans tracking-[0.25em] uppercase py-4 font-medium transition-colors shadow-sm"
                  >
                    <Send size={14} />
                    <span>Order / Confirm on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

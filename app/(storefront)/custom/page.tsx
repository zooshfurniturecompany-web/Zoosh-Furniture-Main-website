"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, FileText, Monitor, Compass, Hammer, Sparkles, Check } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function CustomFurniturePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roomType: "Living Room",
    woodPreference: "Solid Teakwood",
    dimensions: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const allProds = useProducts();
  const products = allProds.slice(0, 4);
  const whatsappUrl = getGeneralWhatsAppLink("custom");

  const processSteps = [
    {
      number: "01",
      title: "Blueprint & Concept",
      description: "Share your room floor plan, sketches, or reference photographs with our bespoke design team.",
    },
    {
      number: "02",
      title: "Material & Wood Selection",
      description: "Choose seasoned solid Teakwood, Ash, or Mahogany with custom stains (Natural, Walnut, Charcoal) and bouclé/linen fabrics.",
    },
    {
      number: "03",
      title: "CAD & Sizing Verification",
      description: "We verify exact length, width, seat depth, and structural joinery before manufacturing.",
    },
    {
      number: "04",
      title: "Pattambi Factory Fabrication",
      description: "Crafted by master carpenters with traditional mortise-and-tenon structural joints.",
    },
    {
      number: "05",
      title: "PAN India Insured Delivery",
      description: "Safely crated and shipped directly to your residence across any state in India.",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello ZOOSH,

I would like to commission a custom furniture piece:

• Name: ${formData.name}
• Phone: ${formData.phone}
• Room Type: ${formData.roomType}
• Wood Preference: ${formData.woodPreference}
• Dimensions: ${formData.dimensions || "To be discussed"}
• Details: ${formData.notes || "Standard specification"}

Please share a consultation & quote.

Thank you.`;

    window.open(`https://wa.me/919567193992?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      
      {/* 1. Header Hero */}
      <section className="relative h-[40vh] sm:h-[48vh] flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog/page_10_img_00.webp"
            alt="Bespoke furniture crafting at ZOOSH"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-neutral-300 font-sans font-semibold block">
            Bespoke Craftsmanship
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
            Custom Furniture Blueprint
          </h1>
          <div className="w-12 h-[1px] bg-white/40 mx-auto mt-4" />
        </div>
      </section>

      {/* 2. Process Section */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 border-b border-neutral-100">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            The Bespoke Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide text-neutral-900">
            How Custom Sizing Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="p-5 sm:p-6 border border-neutral-100 bg-neutral-50/40 space-y-2 relative"
            >
              <span className="font-mono text-xs font-bold text-neutral-400 block">{step.number}</span>
              <h3 className="font-serif text-base text-neutral-900 font-medium">{step.title}</h3>
              <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Custom Enquiry Form */}
      <section className="py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Direct Consultation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900">
            Submit Your Custom Specifications
          </h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm font-light">
            Fill in your preferred dimensions and wood species. Our workshop team will respond with blueprints and pricing.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 border border-neutral-200 p-6 sm:p-8 bg-neutral-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Phone / WhatsApp</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Room Space</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
              >
                <option>Living Room Space</option>
                <option>Dining Suite</option>
                <option>Bedroom Sanctuary</option>
                <option>Entryway / Console</option>
                <option>Full Home Interior</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Timber Species</label>
              <select
                value={formData.woodPreference}
                onChange={(e) => setFormData({ ...formData, woodPreference: e.target.value })}
                className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
              >
                <option>Solid Teakwood</option>
                <option>Solid Ash Wood</option>
                <option>Solid Mahogany</option>
                <option>Woven Cane + Hardwood</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Target Dimensions (Approx Length × Width × Height in cm or feet)</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="e.g. 210 cm L × 90 cm D × 80 cm H"
              className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">Design Notes / Specific Requirements</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe upholstery fabric choice, stain color, or architectural details..."
              className="w-full text-xs font-sans p-3 bg-white border border-neutral-200 focus:outline-none focus:border-black"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-900 text-white text-xs font-sans tracking-[0.2em] uppercase py-4 font-medium transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send size={13} />
              <span>Send Blueprint Request via WhatsApp</span>
            </button>
          </div>
        </form>
      </section>

      {/* 4. Signature Bespoke Inspirations */}
      {products.length > 0 && (
        <section className="py-12 sm:py-20 bg-white border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
                Catalog Basis
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900">
                Customizable Base Models
              </h2>
            </div>

            {/* 2-Column Mobile Grid / 4-Column Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setSelectedProduct(prod)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

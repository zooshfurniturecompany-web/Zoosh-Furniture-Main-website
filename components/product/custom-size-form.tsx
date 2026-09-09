"use client";

import { useState } from "react";
import { Send, FileText } from "lucide-react";
import Button from "@/components/ui/button";

interface CustomSizeFormProps {
  productName: string;
  productSku: string;
  productUrl: string;
}

export default function CustomSizeForm({ productName, productSku, productUrl }: CustomSizeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dimensions: "",
    material: "Teak Wood",
    finish: "Matte Natural",
    upholstery: "",
    additional: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumber = "919567193992";
    const text = `Hello ZOOSH,

I would like to request a Custom Size Enquiry for:
Product: ${productName} (SKU: ${productSku})
URL: ${productUrl}

My Specifications:
• Name: ${formData.name || "N/A"}
• Phone: ${formData.phone || "N/A"}
• Target Dimensions: ${formData.dimensions || "N/A"}
• Wood Selection: ${formData.material}
• Finish Preference: ${formData.finish}
• Upholstery Requirement: ${formData.upholstery || "N/A"}
• Additional Notes: ${formData.additional || "N/A"}

Thank you.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="bg-neutral-50 border border-neutral-100 p-6 md:p-8 space-y-6 mt-12">
      <div className="space-y-2">
        <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-medium block">
          Custom Fabrication
        </span>
        <h3 className="font-serif text-lg md:text-xl text-neutral-900 font-light">
          Need a different size or configuration?
        </h3>
        <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
          ZOOSH designs are built exclusively against order. Submit your dimensions and preferences below, and our workshop team will review the custom specs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Nair"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
              Contact Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
            Required Dimensions *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 180cm Width x 90cm Depth x 75cm Height"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
              Wood / Material Preference
            </label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black text-neutral-700"
            >
              <option value="Teak Wood">Solid Kerala Teak Wood</option>
              <option value="Ash Wood">Solid Open-Pore Ash Wood</option>
              <option value="Mahogany Wood">Warm Solid Mahogany Wood</option>
              <option value="Rattan & Teak">Natural Rattan Cane & Teak</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
              Finish Preference
            </label>
            <select
              value={formData.finish}
              onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black text-neutral-700"
            >
              <option value="Matte Natural">Matte Natural Sealant</option>
              <option value="Semi-Gloss">Semi-Gloss Oil Wax</option>
              <option value="Walnut Stain">Dark Walnut Stain Finish</option>
              <option value="Charcoal Finish">Charcoal / Black Stain</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
            Upholstery / Fabric Requirements (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Cream Linen fabric, Olive Bouclé, High-density foam seating"
            value={formData.upholstery}
            onChange={(e) => setFormData({ ...formData, upholstery: e.target.value })}
            className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-wider uppercase text-neutral-500 font-sans font-medium mb-1.5">
            Additional Requirements / Details (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Rounded leg shapes, matching sideboard requests, custom back height..."
            value={formData.additional}
            onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
            className="w-full bg-white border border-neutral-200 px-4 py-2.5 text-xs font-sans font-light focus:outline-none focus:border-black resize-none"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center space-x-2.5 py-4"
          >
            <Send size={12} />
            <span>Send Custom Enquiry via WhatsApp</span>
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="text-[11px] text-emerald-700 font-sans font-medium bg-emerald-50 p-3 text-center border border-emerald-100">
          Enquiry form generated! If WhatsApp did not open automatically, check your browser block settings.
        </div>
      )}
    </div>
  );
}

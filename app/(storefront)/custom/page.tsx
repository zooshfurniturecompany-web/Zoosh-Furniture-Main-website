"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Send, FileText, Monitor, Compass, Hammer, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function CustomFurniturePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const allProds = useProducts();
  const products = allProds.slice(0, 3);
  const whatsappUrl = getGeneralWhatsAppLink("custom");

  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  } as const;

  const processSteps = [
    {
      icon: <FileText size={20} className="stroke-[1.2]" />,
      number: "01",
      title: "Design Consultation",
      description: "Collaborate with our designers to sketch concepts, define proportions, and align with your interior blueprint layouts.",
    },
    {
      icon: <Monitor size={20} className="stroke-[1.2]" />,
      number: "02",
      title: "3D Rendering & CADs",
      description: "Our studio converts concepts into three-dimensional rendering models, allowing you to review geometries and details before fabrication.",
    },
    {
      icon: <Compass size={20} className="stroke-[1.2]" />,
      number: "03",
      title: "Material Selection",
      description: "Select from premium solid wood timbers—including aged Kerala Teak Wood, Mahogany, and imported Ash Wood—complemented by natural rattan cane weaves and premium upholstery fabrics.",
    },
    {
      icon: <Hammer size={20} className="stroke-[1.2]" />,
      number: "04",
      title: "Master Construction",
      description: "Our veteran carpenters craft the piece manually, leveraging traditional joineries (mortise & tenon) for structural supremacy.",
    },
    {
      icon: <Sparkles size={20} className="stroke-[1.2]" />,
      number: "05",
      title: "White-Glove Delivery",
      description: "The custom furniture piece is packed inside wooden crates and delivered directly to your room with full installation assistance.",
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000"
            alt="Bespoke furniture crafting workshop"
            fill
            priority
            className="object-cover opacity-35 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/30" />
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6 space-y-6">
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 font-sans font-light block">
            Tailor-Made Artistry
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
            Custom Furniture Services
          </h1>
          <p className="text-neutral-300 font-sans text-xs sm:text-sm font-light tracking-wider max-w-xl mx-auto leading-relaxed">
            Co-design unique layouts. Tailor dimensions, timber grains, or fabrics to harmonize with your high-end interior concepts.
          </p>
          <div className="w-12 h-[1px] bg-white/35 mx-auto pt-4" />
        </div>
      </section>

      {/* 2. Editorial Description */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeInUp} className="lg:col-span-5 relative aspect-[4/5] bg-neutral-100 overflow-hidden shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000"
              alt="Artisanal drawing concept"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div {...fadeInUp} className="lg:col-span-7 space-y-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              The Bespoke Experience
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 leading-tight">
              Crafting unique pieces that tell your home's story.
            </h2>
            <div className="h-[1px] bg-neutral-100 w-full" />
             <p className="text-neutral-500 font-sans text-sm md:text-base font-light leading-relaxed">
               Standard retail sizes rarely suit architecturally distinct homes. We operate our dedicated made-to-order manufacturing workshop in Pattambi, Kerala, offering complete design flexibility. You can modify any of our signature models or request custom fabrication of entirely new solid wood designs from your own drawings and sketches.
             </p>
             <p className="text-neutral-500 font-sans text-sm md:text-base font-light leading-relaxed">
               Whether configuring a custom size sectional sofa, a solid teak wood dining table, custom cabinets, or bespoke bedroom wardrobes, our master carpenters handle every joint and finish with absolute precision.
             </p>
            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-3 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.2em] uppercase py-4.5 px-8 transition-colors font-light shadow-md"
              >
                <Send size={14} className="animate-pulse" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Design Flow Timeline */}
      <section className="py-16 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Methodology
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              The Custom Crafting Process
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
              Every custom order travels through a structured design and building cycle to guarantee precision.
            </p>
          </motion.div>

          {/* Process steps horizontal/vertical flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-8 space-y-6 relative border border-neutral-100 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Top: Icon & step number */}
                  <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                    <span className="text-black">{step.icon}</span>
                    <span className="font-serif text-xl tracking-wider text-neutral-300 font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg tracking-wide text-neutral-900 font-light leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 text-xs font-sans font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quality Standards banner */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center space-y-6">
          <motion.h2 {...fadeInUp} className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-950">
            Discuss Your Space Concept
          </motion.h2>
          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-neutral-500 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto"
          >
            Ready to design the perfect addition to your home space? Share your blueprints or reference images with our consultants directly via WhatsApp.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.2em] uppercase py-4 px-8 transition-colors font-light"
            >
              <Send size={12} />
              <span>Schedule Consultation</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Showcase Curation Section */}
      <section className="py-16 border-t border-neutral-100 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Bespoke Portfolio
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Custom Crafted Solutions
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              Explore signature custom-designed pieces created for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

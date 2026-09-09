"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Compass, ShieldCheck, Factory, MapPin } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { getAllProducts, Product } from "@/hooks/use-products";

export default function AboutPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = getAllProducts().slice(0, 3);

  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  } as const;

  const timelineEvents = [
    {
      year: "2021",
      title: "The Genesis",
      description: "ZOOSH was founded in Pattambi, Kerala, with a core vision: to break away from generic furniture designs and build hand-crafted structural art.",
    },
    {
      year: "2023",
      title: "Factory Integration",
      description: "We consolidated our dedicated production workshop in Pattambi, focusing entirely on direct-to-consumer solid wood custom fabrication.",
    },
    {
      year: "2026",
      title: "Digital Catalog",
      description: "Establishing our digital catalog and custom configuration system to deliver custom-crafted solid wood designs across India.",
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Hero */}
      <section className="relative h-[45vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000"
            alt="ZOOSH furniture crafting background"
            fill
            priority
            className="object-cover opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6 space-y-4">
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 font-sans font-light block">
            Crafting Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
            Our Story & Design Philosophy
          </h1>
          <div className="w-12 h-[1px] bg-white/35 mx-auto mt-6" />
        </div>
      </section>

      {/* 2. Editorial Profile */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div {...fadeInUp} className="lg:col-span-6 space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              The Brand Vision
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900 leading-tight">
              Bespoke furniture direct from our Pattambi factory.
            </h2>
            <p className="text-neutral-500 font-sans text-sm md:text-base font-light leading-relaxed">
              At ZOOSH, we believe furniture should be custom-tailored to suit the architectural flow of your home. By operating a direct-to-consumer workshop model in Pattambi, Kerala, we design and manufacture modern contemporary designs directly for you—without middleman retail markups.
            </p>
            <p className="text-neutral-500 font-sans text-sm md:text-base font-light leading-relaxed">
              We do not mass produce or store excess inventory. Instead, we craft pieces only after receiving confirmed orders, allowing our master carpenters to focus on natural grain selection, structural wood jointing (mortise & tenon), and handmade finishes.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative aspect-[4/5] bg-neutral-100 overflow-hidden shadow-sm"
          >
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000"
              alt="Premium living space design"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Core Pillars Grid */}
      <section className="py-16 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Operational Standards
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              The Pillars of ZOOSH Excellence
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
              We govern every step of our designing and assembly procedures through four core principles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 space-y-6 shadow-sm border border-neutral-100"
            >
              <div className="w-10 h-10 bg-brand-grey flex items-center justify-center text-black">
                <Compass size={18} className="stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl tracking-wide text-neutral-900 font-light">
                Design Philosophy
              </h3>
              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                Sculptural minimalism. We strip away unnecessary ornaments to emphasize pure form, raw texture, and natural proportions, creating pieces that act as visual anchors.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white p-10 space-y-6 shadow-sm border border-neutral-100"
            >
              <div className="w-10 h-10 bg-brand-grey flex items-center justify-center text-black">
                <ShieldCheck size={18} className="stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl tracking-wide text-neutral-900 font-light">
                Quality Standards
              </h3>
              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                White-glove quality assurance. Every joint is hand-inspected, every stone polished, and every textile double-stitched. We build furniture to bridge generations.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-10 space-y-6 shadow-sm border border-neutral-100"
            >
              <div className="w-10 h-10 bg-brand-grey flex items-center justify-center text-black">
                <Factory size={18} className="stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl tracking-wide text-neutral-900 font-light">
                Manufacturing Excellence
              </h3>
              <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
                Master carpentry. We merge modern 3D rendering designs with traditional woodworking joints (mortise & tenon) to deliver structural superiority and flawless finishes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Timeline Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Chronology
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Established in 2021
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              A brief walkthrough of our growth and design expansion.
            </p>
          </motion.div>

          {/* Timeline cards */}
          <div className="relative border-l border-neutral-200 ml-4 md:ml-32 space-y-12">
            {timelineEvents.map((evt, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Year tag left aligned on desktop */}
                <div className="absolute right-full mr-8 md:mr-12 top-0 hidden md:block text-right">
                  <span className="font-serif text-2xl tracking-wider text-black font-light block">
                    {evt.year}
                  </span>
                  <div className="w-8 h-[1px] bg-neutral-200 inline-block -mt-1" />
                </div>

                {/* Bullet circle */}
                <div className="absolute -left-[5px] top-2.5 w-2.5 h-2.5 bg-black rounded-full ring-4 ring-neutral-100" />

                {/* Content Box */}
                <div className="space-y-2">
                  <span className="font-serif text-xs text-neutral-400 md:hidden tracking-wider block font-semibold mb-1">
                    {evt.year}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-neutral-900 font-light">
                    {evt.title}
                  </h3>
                  <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed max-w-xl">
                    {evt.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom Curation Section */}
      <section className="py-16 border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Curated Showcase
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              Signature Collection
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              A handpicked selection of our most popular modern creations.
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

      {/* 5. Location CTA */}
      <section className="py-12 bg-brand-grey border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-black">
              <MapPin size={16} className="stroke-[1.5]" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                Production Factory
              </span>
            </div>
            <h3 className="font-serif text-2xl font-light text-neutral-900">
              Pattambi, Cherpullassery Road
            </h3>
            <p className="text-neutral-500 text-xs font-sans font-light">
              Kumbankallu, Cherpullassery Road, Pattambi, Kerala, India 679313
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.2em] uppercase py-4 px-8 transition-colors font-light"
          >
            Contact Our Team
          </Link>
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

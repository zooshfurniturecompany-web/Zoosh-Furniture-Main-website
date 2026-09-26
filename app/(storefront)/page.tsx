"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Send,
  Truck,
  ShieldCheck,
  Ruler,
  Award,
  Sparkles,
  Layers,
  Clock
} from "lucide-react";
import Button from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import CategoryCardSlider from "@/components/home/category-card-slider";
import { useProducts, getCategories, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

const valueProps = [
  {
    icon: <Truck size={24} className="stroke-[1.2] text-neutral-800" />,
    title: "Pan-India White Glove Delivery",
    desc: "Insured door-to-door transit directly from our Pattambi manufacturing facility to your home.",
  },
  {
    icon: <Layers size={24} className="stroke-[1.2] text-neutral-800" />,
    title: "100% Solid Hardwoods",
    desc: "Kiln-dried Kerala Teak, imported Ash wood, and rich Mahogany with zero particle boards.",
  },
  {
    icon: <Ruler size={24} className="stroke-[1.2] text-neutral-800" />,
    title: "Bespoke Custom Sizing",
    desc: "Every single piece is manufactured to your architectural floor plan and exact dimensions.",
  },
  {
    icon: <ShieldCheck size={24} className="stroke-[1.2] text-neutral-800" />,
    title: "5-Year Structural Warranty",
    desc: "Engineered with traditional mortise-and-tenon joineries built to last generations.",
  },
];

const completedProjects = [
  {
    title: "Ajmal Residence",
    image: "/images/catalog/page_14_img_00.webp",
    category: "Residential Living Room Space"
  },
  {
    title: "Rajesh Menon Residence",
    image: "/images/catalog/page_32_img_00.webp",
    category: "Teak Dining Suite"
  },
  {
    title: "Akhil Residence",
    image: "/images/catalog/page_29_img_00.webp",
    category: "Sculptural Lounge Chairs"
  },
  {
    title: "Sufaina Residence",
    image: "/images/catalog/page_44_img_00.webp",
    category: "Solid Wood Dining & Benches"
  },
  {
    title: "Sanjeevan Residence",
    image: "/images/catalog/page_35_img_00.webp",
    category: "Cane Back Bedroom Retreat"
  },
  {
    title: "Brown Barrel Cafe",
    image: "/images/catalog/page_51_img_01.webp",
    category: "Commercial Hospitality Fitout"
  }
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const allProducts = useProducts();
  const categories = ["All", ...getCategories()];
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = allProducts.filter(
    (product) => activeTab === "All" || product.category === activeTab
  );

  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" },
  } as const;

  return (
    <div className="overflow-hidden bg-white">
      {/* 01. HERO SLIDESHOW / HERO SECTION (Prestige Luxury Minimalist Style) */}
      <section 
        className="relative min-h-[85vh] md:min-h-[calc(100vh-80px)] h-auto py-16 md:py-24 w-full flex items-center justify-start bg-neutral-950 overflow-hidden select-none"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="ZOOSH luxury modern furniture"
            fill
            priority
            unoptimized
            quality={100}
            sizes="100vw"
            style={{ objectPosition: "center 70%" }}
            className="object-cover"
          />
          {/* Subtle cinematic gradient preserving legibility with rich contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-start pointer-events-none">
          <div className="max-w-[660px] w-full text-left flex flex-col items-start cursor-default pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-neutral-300 font-sans font-medium px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/20">
                Bespoke Hardwood Architecture
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="font-serif text-[clamp(32px,5vw,68px)] font-light tracking-wide leading-[1.08] text-white mb-5"
            >
              Every Home Deserves Furniture Built Specifically For It.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="text-xs sm:text-sm md:text-base text-neutral-200 font-sans font-light tracking-wide mb-8 leading-relaxed max-w-xl"
            >
              Crafted in solid Teak, Ash & Mahogany woods, natural woven cane, and premium tailored fabrics. Zero ready-made stock—custom manufactured in our Kerala workshop.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <Link 
                href="/collection" 
                className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase py-4 px-8 font-medium transition-all duration-300 min-w-[180px] text-center"
              >
                Explore Collections
              </Link>
              <Link 
                href="/custom" 
                className="inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-black text-xs tracking-[0.2em] uppercase py-4 px-8 font-medium transition-all duration-300 min-w-[180px] text-center"
              >
                Custom Commission
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-1 text-white/40 animate-pulse">
          <span className="text-[8px] tracking-[0.3em] uppercase font-light">Scroll Down</span>
        </div>
      </section>

      {/* 02. CATEGORY CARD SLIDER (Homework Living Curated Spaces) */}
      <CategoryCardSlider />

      {/* 03. SIGNATURE CATALOG & BEST SELLERS (Filterable Grid / Carousel) */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-100 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block mb-2">
                Curated Catalog
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
                Signature Collection
              </h2>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex items-center overflow-x-auto no-scrollbar py-2 -mx-6 px-6 md:mx-0 md:px-0 space-x-2 scroll-smooth">
              {categories.map((category) => {
                const isActive = activeTab === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`text-[9px] tracking-widest uppercase py-2 px-4 transition-all duration-300 whitespace-nowrap font-medium border ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-transparent text-neutral-500 border-neutral-200 hover:text-black hover:border-black"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProductCard
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 04. EDITORIAL STORY: THE ARTISANAL JOURNEY (Split Image With Text) */}
      <section className="py-16 sm:py-24 bg-neutral-50/50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story Text */}
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
                Factory Direct Craftsmanship
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-900 leading-tight">
                Shaped by time,<br />engineered for life.
              </h2>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
                Founded in Kerala, ZOOSH operates a dedicated manufacturing facility in Pattambi. By managing every stage in-house—from selecting raw Teak logs at licensed timber yards to hand-jointing frames and tailoring custom cushions—we ensure uncompromising quality with zero retail middleman markup.
              </p>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
                We believe that furniture should adapt to the architecture of your home, not the other way around. Every piece is fabricated to order with your choice of solid hardwood, dimensions, and fabric textures.
              </p>
              
              <div className="pt-2 flex items-center space-x-6">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-black font-medium border-b border-black pb-1 hover:pr-2 transition-all"
                >
                  <span>Our Heritage & Process</span>
                  <ArrowRight size={12} className="ml-2" />
                </Link>
              </div>
            </motion.div>

            {/* Right Collage Imagery */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-6 grid grid-cols-12 gap-4"
            >
              <div className="col-span-8 relative aspect-[4/5] bg-neutral-200 overflow-hidden shadow-sm">
                <Image
                  src="/images/catalog/page_10_img_00.webp"
                  alt="ZOOSH master carpenters crafting dining table"
                  fill
                  sizes="(max-width: 1024px) 70vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="relative aspect-square bg-neutral-200 overflow-hidden shadow-sm">
                  <Image
                    src="/images/catalog/page_06_img_01.webp"
                    alt="Precision mortise and tenon wood joinery"
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden shadow-sm">
                  <Image
                    src="/images/catalog/page_02_img_01.webp"
                    alt="Timber seasoning and finishing"
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 05. MULTI-COLUMN VALUE PROPOSITIONS (Prestige Theme Style) */}
      <section className="py-16 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-start space-y-3 p-6 border border-neutral-100 bg-neutral-50/30 hover:border-neutral-200 transition-colors"
              >
                <div className="p-3 bg-white border border-neutral-100 rounded-sm mb-1 shadow-xs">
                  {prop.icon}
                </div>
                <h3 className="font-serif text-base sm:text-lg text-neutral-950 font-medium tracking-wide">
                  {prop.title}
                </h3>
                <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                  {prop.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. SELECTED COMPLETED PROJECTS (Real Installed Homes) */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              Architectural Installations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-neutral-900">
              Completed Spaces
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light">
              A gallery of custom bespoke furniture installations handcrafted for residences across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {completedProjects.map((project, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col space-y-3"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-50 border border-neutral-100">
                  <Image
                    src={project.image}
                    alt={`${project.title} - ${project.category}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
                </div>
                <div className="space-y-0.5 px-1">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-sans font-medium block">
                    {project.category}
                  </span>
                  <h3 className="font-serif text-base text-neutral-950 font-medium group-hover:text-neutral-600 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. ARCHITECTURAL COMMISSION CTA (WhatsApp Concierge & Consultation) */}
      <section className="relative py-20 sm:py-28 flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog/page_10_img_00.webp"
            alt="ZOOSH workshop custom manufacturing background"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center text-white space-y-6">
          <motion.span {...fadeInUp} className="text-[10px] tracking-[0.35em] uppercase text-neutral-300 font-sans font-medium block">
            Custom Commissions
          </motion.span>
          <motion.h2
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-light tracking-wide max-w-2xl mx-auto leading-tight"
          >
            Have a blueprint or bespoke design in mind?
          </motion.h2>
          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-300 font-sans text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto"
          >
            Share your room dimensions, floor plans, or moodboards. Our craftsmen and designers will engineer furniture tailored specifically for your space.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase py-4 px-8 font-medium transition-all duration-300 min-w-[200px]"
            >
              Request A Quote
            </Link>
            <a
              href={customEnquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 border border-white text-white text-xs tracking-[0.2em] uppercase py-4 px-8 hover:bg-white hover:text-black transition-colors font-medium min-w-[200px]"
            >
              <Send size={13} />
              <span>WhatsApp Concierge</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

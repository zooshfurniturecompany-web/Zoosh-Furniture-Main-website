"use client";

import Link from "next/link";
import Image from "next/image";
import { Compass, ShieldCheck, Factory, MapPin, Send } from "lucide-react";
import { getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function AboutPage() {
  const customEnquiryLink = getGeneralWhatsAppLink("custom");

  const timelineEvents = [
    {
      year: "2021",
      title: "The Genesis",
      description: "ZOOSH was founded in Pattambi, Kerala, with a clear vision: to break away from generic flatpack furniture and craft bespoke structural hardwood art.",
    },
    {
      year: "2023",
      title: "Direct Workshop Consolidation",
      description: "We established our dedicated manufacturing facility in Pattambi, focusing entirely on direct-to-consumer custom solid wood fabrication.",
    },
    {
      year: "2026",
      title: "Pan-India Bespoke Delivery",
      description: "Delivering architectural solid wood sofas, dining suites, and bedroom sanctuaries directly to private residences across India.",
    },
  ];

  return (
    <div className="bg-white">
      
      {/* 1. Header Hero */}
      <section className="relative h-[40vh] sm:h-[48vh] flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/catalog/page_10_img_00.webp"
            alt="ZOOSH workshop master carpenters"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-neutral-300 font-sans font-semibold block">
            Crafting Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
            Our Story & Heritage
          </h1>
          <div className="w-12 h-[1px] bg-white/40 mx-auto mt-4" />
        </div>
      </section>

      {/* 2. Editorial Profile */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
              The Brand Vision
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-900 leading-tight">
              Bespoke furniture direct from our Pattambi factory.
            </h2>
            <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
              At ZOOSH, we believe furniture should be custom-tailored to suit the architectural flow of your home. By operating a direct-to-consumer workshop model in Pattambi, Kerala, we design and manufacture modern contemporary designs directly for you—without middleman retail markups.
            </p>
            <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
              We do not mass produce or store excess inventory. Instead, we craft pieces only after receiving confirmed orders, allowing our master carpenters to focus on natural grain selection, structural wood jointing (mortise & tenon), and handmade finishes.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/5] bg-neutral-100 overflow-hidden shadow-xs border border-neutral-100">
            <Image
              src="/images/catalog/page_06_img_01.webp"
              alt="Precision joinery in Pattambi workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Pillars Grid */}
      <section className="py-12 sm:py-20 bg-neutral-50 border-t border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
              Operational Standards
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-neutral-900">
              The Pillars of ZOOSH
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 sm:p-8 border border-neutral-100 space-y-3">
              <Compass size={24} className="text-neutral-900 stroke-[1.3]" />
              <h3 className="font-serif text-lg text-neutral-900 font-medium">100% Bespoke Fabrication</h3>
              <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                Every dimension, wood selection, and textile finish is customizable to match your room blueprints.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-neutral-100 space-y-3">
              <Factory size={24} className="text-neutral-900 stroke-[1.3]" />
              <h3 className="font-serif text-lg text-neutral-900 font-medium">Direct Workshop Transparency</h3>
              <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                Full insight into the timber seasoning, mortise jointing, and upholstery tailoring at our Kerala facility.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-neutral-100 space-y-3">
              <ShieldCheck size={24} className="text-neutral-900 stroke-[1.3]" />
              <h3 className="font-serif text-lg text-neutral-900 font-medium">5-Year Structural Frame Warranty</h3>
              <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed">
                Traditional joinery techniques engineered to endure generational everyday residential use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Timeline */}
      <section className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Milestones
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900">
            Our Journey
          </h2>
        </div>

        <div className="space-y-6 sm:space-y-8 border-l-2 border-neutral-200 ml-4 sm:ml-8 pl-6 sm:pl-8">
          {timelineEvents.map((evt) => (
            <div key={evt.year} className="relative space-y-1">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 bg-black rounded-full ring-4 ring-white" />
              <span className="text-xs font-mono font-bold text-neutral-900">{evt.year}</span>
              <h3 className="font-serif text-lg text-neutral-900 font-medium">{evt.title}</h3>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm font-light leading-relaxed">
                {evt.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Workshop CTA */}
      <section className="py-14 sm:py-20 bg-neutral-950 text-white text-center px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl font-light">Visit Our Workshop</h2>
          <p className="text-neutral-300 font-sans text-xs sm:text-sm font-light leading-relaxed">
            We welcome architects, interior designers, and clients to visit our workshop at Pattambi, Kerala.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-black text-xs tracking-[0.2em] uppercase py-3.5 px-8 font-medium hover:bg-neutral-100 transition-colors"
            >
              Get Directions
            </Link>
            <a
              href={customEnquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white text-white text-xs tracking-[0.2em] uppercase py-3.5 px-8 font-medium hover:bg-white hover:text-black transition-colors"
            >
              <Send size={13} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

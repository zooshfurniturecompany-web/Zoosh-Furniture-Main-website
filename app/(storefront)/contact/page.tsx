"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Phone, Mail, CheckCircle2, MessageSquare } from "lucide-react";
import Button from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function ContactPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = useProducts().slice(0, 3);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const whatsappLink = getGeneralWhatsAppLink("general");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate database submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  } as const;

  return (
    <div className="pt-8 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-neutral-900">
            Contact ZOOSH
          </h1>
          <p className="text-neutral-500 text-xs md:text-sm font-sans font-light leading-relaxed">
            Have an inquiry about our custom designs or want to collaborate on a home interior project? Contact our team below.
          </p>
        </div>

        {/* Main Columns Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="font-serif text-2xl tracking-wide text-neutral-950 font-light">
                Production Factory
              </h2>
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-grey flex items-center justify-center text-black flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="stroke-[1.5]" />
                  </div>
                  <div className="text-xs md:text-sm font-sans leading-relaxed font-light">
                    <p className="font-semibold uppercase tracking-wider text-black mb-1">
                      Factory Address
                    </p>
                    <p className="text-neutral-500">
                      Pattambi, Kumbankallu,<br />
                      Cherpullassery Road,<br />
                      Kerala, PIN 679313
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-grey flex items-center justify-center text-black flex-shrink-0 mt-0.5">
                    <Phone size={14} className="stroke-[1.5]" />
                  </div>
                  <div className="text-xs md:text-sm font-sans leading-relaxed font-light">
                    <p className="font-semibold uppercase tracking-wider text-black mb-1">
                      Call Us
                    </p>
                    <p className="text-neutral-500 space-y-1">
                      <a href="tel:9544571992" className="hover:text-black block transition-colors">
                        +91 9544571992
                      </a>
                      <a href="tel:9567193992" className="hover:text-black block transition-colors">
                        +91 9567193992
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-grey flex items-center justify-center text-black flex-shrink-0 mt-0.5">
                    <Mail size={14} className="stroke-[1.5]" />
                  </div>
                  <div className="text-xs md:text-sm font-sans leading-relaxed font-light">
                    <p className="font-semibold uppercase tracking-wider text-black mb-1">
                      Email Inquiries
                    </p>
                    <a
                      href="mailto:zooshfurniturcompany@gmail.com"
                      className="text-neutral-500 hover:text-black block transition-colors break-all"
                    >
                      zooshfurniturcompany@gmail.com
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-brand-grey flex items-center justify-center text-black flex-shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div className="text-xs md:text-sm font-sans leading-relaxed font-light">
                    <p className="font-semibold uppercase tracking-wider text-black mb-1">
                      Follow Us
                    </p>
                    <a
                      href="https://instagram.com/zooshfurniture"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-black block transition-colors"
                    >
                      @zooshfurniture
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick WhatsApp CTA box */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-brand-grey p-8 border border-neutral-100 flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-2 text-black">
                <MessageSquare size={16} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-semibold">
                  WhatsApp Support
                </span>
              </div>
              <p className="text-neutral-500 text-xs font-sans leading-relaxed font-light">
                Need answers regarding customization, quotes, or delivery immediately? Chat with our coordinators via WhatsApp.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-black text-white hover:bg-neutral-900 text-xs tracking-[0.2em] uppercase py-3.5 transition-colors font-light font-sans"
              >
                <Send size={12} />
                <span>Chat Instantly</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="bg-neutral-50/50 p-8 md:p-12 border border-neutral-100/50"
            >
              <h2 className="font-serif text-2xl tracking-wide text-neutral-950 font-light mb-8">
                Send A Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans font-medium block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full text-xs font-sans font-light bg-white border border-neutral-200 px-4 py-3.5 focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-300"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans font-medium block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full text-xs font-sans font-light bg-white border border-neutral-200 px-4 py-3.5 focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-300"
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans font-medium block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full text-xs font-sans font-light bg-white border border-neutral-200 px-4 py-3.5 focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-300"
                    placeholder="Enquiry topic"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans font-medium block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full text-xs font-sans font-light bg-white border border-neutral-200 px-4 py-3.5 focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-neutral-300 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Button & Success block */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[150px]"
                  >
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </Button>

                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center space-x-2 text-green-600 font-sans text-xs"
                      >
                        <CheckCircle2 size={16} />
                        <span>Message submitted successfully. Thank you!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Custom Map section */}
        <div className="mt-16 border-t border-neutral-100 pt-10">
          <motion.div {...fadeInUp} className="space-y-4 mb-6 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
              Interactive Location Map
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              Visit our production factory in Pattambi. Search coordinates: Cherpullassery Road, Kumbankallu.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[450px] bg-neutral-100 border border-neutral-200 overflow-hidden relative"
          >
            {/* Custom monochrome iframe google map */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15659.882194605912!2d76.22384758781738!3d10.820302302322305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d4c82b09a473%3A0xe54d8fb8dbb3b44b!2sCherpullassery%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-80 invert hover:grayscale-0 hover:opacity-100 hover:invert-0 transition-all duration-750"
            />
          </motion.div>
        </div>

        {/* Showcase Curation Section */}
        <div className="mt-16 border-t border-neutral-100 pt-10">
          <motion.div {...fadeInUp} className="space-y-4 mb-8 text-center max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-medium block">
              In-Demand Pieces
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
              Popular Custom Enquiries
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm font-sans font-light">
              Most requested models available for customization. Click to enquire on WhatsApp.
            </p>
          </motion.div>

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

        {/* Quick View Modal */}
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}

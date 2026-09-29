"use client";

import { useState, FormEvent } from "react";
import { Send, MapPin, Phone, Mail, CheckCircle2, MessageSquare } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import QuickViewModal from "@/components/product/quick-view-modal";
import { useProducts, Product, getGeneralWhatsAppLink } from "@/hooks/use-products";

export default function ContactPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = useProducts().slice(0, 4);

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

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="py-8 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
            Direct Concierge
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-neutral-900">
            Contact ZOOSH
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light leading-relaxed">
            Have questions about custom sizing, wood species, or room blueprints? Reach out to our factory team.
          </p>
        </div>

        {/* Main Columns Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl tracking-wide text-neutral-950 font-light">
                Pattambi Factory HQ
              </h2>

              <div className="space-y-4 text-xs sm:text-sm font-sans font-light">
                {/* Address */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-neutral-50 border border-neutral-100">
                  <MapPin size={18} className="text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-neutral-900 block mb-0.5">Workshop Address</strong>
                    <p className="text-neutral-600 leading-relaxed">
                      Pattambi, Kumbankallu, Cherpullassery Road, Kerala, PIN 679313
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-neutral-50 border border-neutral-100">
                  <Phone size={18} className="text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-neutral-900 block mb-0.5">Direct Phone Lines</strong>
                    <div className="space-y-1 text-neutral-600">
                      <a href="tel:9544571992" className="hover:text-black block underline">
                        +91 9544571992
                      </a>
                      <a href="tel:9567193992" className="hover:text-black block underline">
                        +91 9567193992
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-neutral-50 border border-neutral-100">
                  <Mail size={18} className="text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-neutral-900 block mb-0.5">Email</strong>
                    <a
                      href="mailto:zooshfurniturcompany@gmail.com"
                      className="text-neutral-600 hover:text-black block underline break-all"
                    >
                      zooshfurniturcompany@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Box */}
            <div className="bg-neutral-950 text-white p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">
                  Instant WhatsApp Concierge
                </span>
              </div>
              <p className="text-neutral-300 text-xs font-light leading-relaxed">
                Connect with our coordinators via WhatsApp for instant finish samples and dimensions.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase py-3.5 font-medium transition-colors"
              >
                <Send size={12} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-50/50 p-6 sm:p-10 border border-neutral-200/80">
              <h2 className="font-serif text-xl sm:text-2xl tracking-wide text-neutral-950 font-light mb-6">
                Send Us A Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full text-xs font-sans bg-white border border-neutral-200 px-3.5 py-3 focus:outline-none focus:border-black"
                      placeholder="e.g. Ananya Nair"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full text-xs font-sans bg-white border border-neutral-200 px-3.5 py-3 focus:outline-none focus:border-black"
                      placeholder="e.g. ananya@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                    Subject / Project Reference
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleInputChange}
                    className="w-full text-xs font-sans bg-white border border-neutral-200 px-3.5 py-3 focus:outline-none focus:border-black"
                    placeholder="e.g. Custom 6-Seater Teak Dining Table"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full text-xs font-sans bg-white border border-neutral-200 px-3.5 py-3 focus:outline-none focus:border-black resize-none"
                    placeholder="Share your requirements or questions..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-black hover:bg-neutral-900 text-white text-xs font-sans tracking-[0.2em] uppercase py-3.5 px-8 font-medium transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </button>

                  {isSubmitted && (
                    <div className="flex items-center space-x-2 text-emerald-700 font-sans text-xs pt-3">
                      <CheckCircle2 size={16} />
                      <span>Thank you! Your message has been sent to our workshop team.</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Popular Custom Enquiries (2-Column Mobile Grid) */}
        <div className="mt-16 border-t border-neutral-100 pt-10">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-sans font-semibold block">
              In-Demand Pieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900">
              Popular Custom Enquiries
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
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

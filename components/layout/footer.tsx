import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Profile */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-6">
          <div>
            <span className="font-serif text-3xl tracking-[0.2em] block">ZOOSH</span>
          </div>
          <p className="text-neutral-400 text-sm font-light max-w-sm leading-relaxed font-sans italic">
            "An addition that makes something more stylish, lively, and attractive."
          </p>
          <p className="text-xs text-neutral-500 font-light max-w-sm leading-relaxed">
            Bespoke solid wood furniture crafted to order in our Kerala factory workshop.
          </p>
        </div>

        {/* Sitemap Links */}
        <div>
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-neutral-300 mb-6">
            Bespoke Factory
          </h4>
          <ul className="space-y-4">
            {[
              { label: "Home", href: "/" },
              { label: "Collection Catalog", href: "/collection" },
              { label: "Custom Crafting", href: "/custom" },
              { label: "Inspiration Gallery", href: "/gallery" },
              { label: "Our Story", href: "/about" },
              { label: "Contact Details", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs tracking-wider uppercase font-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-neutral-300 mb-6">
            HQ Factory
          </h4>
          <div className="space-y-6 text-xs text-neutral-400 font-light leading-relaxed">
            <div>
              <span className="block text-neutral-300 tracking-wider font-semibold uppercase mb-1">
                Location
              </span>
              <p>
                Pattambi, Kumbankallu,<br />
                Cherpullassery Road,<br />
                Kerala, PIN 679313
              </p>
            </div>
            <div>
              <span className="block text-neutral-300 tracking-wider font-semibold uppercase mb-1">
                Inquiries
              </span>
              <p className="space-y-1">
                <a href="tel:9544571992" className="hover:text-white transition-colors block">
                  +91 9544571992
                </a>
                <a href="tel:9567193992" className="hover:text-white transition-colors block">
                  +91 9567193992
                </a>
                <a
                  href="mailto:zooshfurniturcompany@gmail.com"
                  className="hover:text-white transition-colors block mt-2 text-[11px] break-all"
                >
                  zooshfurniturcompany@gmail.com
                </a>
              </p>
            </div>
            <div>
              <span className="block text-neutral-300 tracking-wider font-semibold uppercase mb-1">
                Social
              </span>
              <a
                href="https://instagram.com/zooshfurniture"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors block"
              >
                @zooshfurniture
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 font-light">
        <div>© 2026 ZOOSH Furniture Company. All Rights Reserved.</div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/about" className="hover:text-white transition-colors">
            Established 2021
          </Link>
          <span>Pattambi, Cherpullassery</span>
        </div>
      </div>
    </footer>
  );
}

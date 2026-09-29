import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
        
        {/* Brand Profile */}
        <div className="md:col-span-2 space-y-4">
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] block">ZOOSH</span>
          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-sm leading-relaxed font-sans italic">
            "An addition that makes something more stylish, lively, and attractive."
          </p>
          <p className="text-[11px] text-neutral-500 font-light max-w-sm leading-relaxed">
            Bespoke solid wood furniture custom manufactured to order in our Pattambi workshop, Kerala.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-neutral-300">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400 font-light">
            <li>
              <Link href="/collection" className="hover:text-white transition-colors">
                All Furniture Catalog
              </Link>
            </li>
            <li>
              <Link href="/living" className="hover:text-white transition-colors">
                Living Room Space
              </Link>
            </li>
            <li>
              <Link href="/dining" className="hover:text-white transition-colors">
                Dining Room Space
              </Link>
            </li>
            <li>
              <Link href="/bedroom" className="hover:text-white transition-colors">
                Bedroom Sanctuary
              </Link>
            </li>
            <li>
              <Link href="/custom" className="hover:text-white transition-colors">
                Custom Blueprint Commission
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white transition-colors">
                Completed Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Our Story & Heritage
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Workshop HQ */}
        <div className="space-y-3">
          <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-neutral-300">
            Factory HQ
          </h4>
          <div className="space-y-3 text-xs text-neutral-400 font-light leading-relaxed">
            <p>
              Pattambi, Kumbankallu,<br />
              Cherpullassery Road,<br />
              Palakkad, Kerala - 679313
            </p>
            <div className="space-y-1">
              <a href="tel:9544571992" className="hover:text-white block underline">
                +91 9544571992
              </a>
              <a href="tel:9567193992" className="hover:text-white block underline">
                +91 9567193992
              </a>
            </div>
            <a
              href="mailto:zooshfurniturcompany@gmail.com"
              className="hover:text-white block underline text-[11px] break-all"
            >
              zooshfurniturcompany@gmail.com
            </a>
            <a
              href="https://instagram.com/zooshfurniture"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white block pt-1"
            >
              Instagram: @zooshfurniture
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Origin */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-light gap-2 text-center sm:text-left">
        <div>© 2026 ZOOSH Furniture Company. All Rights Reserved.</div>
        <div className="flex items-center space-x-4">
          <span>Pattambi, Kerala</span>
          <span>•</span>
          <span>Bespoke Solid Wood Architecture</span>
        </div>
      </div>
    </footer>
  );
}

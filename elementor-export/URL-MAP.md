# ZOOSH Website — Elementor URL Mapping Sheet

This document maps the original React/Next.js routes and dynamic links to the matching page structure in Elementor/WordPress. Use this guide to update the `href` attributes on all extracted HTML link anchor tags (`<a>`).

---

## 🔗 Route Redirections Reference

| Next.js App Route | Target Page Slug | WordPress / Elementor Relative URL | Action / Notes |
| :--- | :--- | :--- | :--- |
| **Homepage** (`/`) | `home` | `/` | Standard redirect |
| **About Story** (`/about`) | `about` | `/about/` | Standard redirect |
| **Custom Services** (`/custom`) | `custom` | `/custom/` | Standard redirect |
| **Contact Info** (`/contact`) | `contact` | `/contact/` | Standard redirect |
| **Gallery Portfolio** (`/gallery`) | `gallery` | `/gallery/` | Standard redirect |
| **Catalog Listing** (`/collection`) | `collection` | `/collection/` | Standard redirect |
| **Search Query** (`/search`) | `search` | `/search/` | Requires dynamic query support (Vanilla JS) |
| **Living Room** (`/living`) | `living` | `/living/` | Static page extraction |
| **Dining Space** (`/dining`) | `dining` | `/dining/` | Static page extraction |
| **Bedroom Space** (`/bedroom`) | `bedroom` | `/bedroom/` | Static page extraction |
| **Entryway Space** (`/entryway`) | `entryway` | `/entryway/` | Static page extraction |

---

## 🏷️ Dynamic Subcategory Slugs

For subcategories, standard Next.js folders like `/[room]/[subcategory]` should translate to nested sub-pages in WordPress:

| Next.js Dynamic URL | Target WordPress URL | Description |
| :--- | :--- | :--- |
| `/living/sofas` | `/living/sofas/` | Living room sofas |
| `/living/lounge-chairs` | `/living/lounge-chairs/` | Living room lounge chairs |
| `/living/arm-chairs` | `/living/arm-chairs/` | Living room arm chairs |
| `/living/centre-tables` | `/living/centre-tables/` | Living room centre tables |
| `/living/side-tables` | `/living/side-tables/` | Living room side tables |
| `/living/console-tables` | `/living/console-tables/` | Living room console tables |
| `/dining/dining-tables` | `/dining/dining-tables/` | Dining tables |
| `/dining/dining-chairs` | `/dining/dining-chairs/` | Dining chairs |
| `/dining/dining-benches` | `/dining/dining-benches/` | Dining benches |
| `/dining/bar-stools` | `/dining/bar-stools/` | Dining bar stools |
| `/bedroom/bed-cots` | `/bedroom/bed-cots/` | Bed cots |
| `/bedroom/bedside-tables` | `/bedroom/bedside-tables/` | Bedside tables |
| `/bedroom/bedroom-chairs` | `/bedroom/bedroom-chairs/` | Bedroom chairs |
| `/bedroom/benches` | `/bedroom/benches/` | Bedroom benches |
| `/entryway/console-tables` | `/entryway/console-tables/` | Entryway console tables |
| `/entryway/mirror-units` | `/entryway/mirror-units/` | Entryway mirror units |
| `/entryway/benches` | `/entryway/benches/` | Entryway benches |

---

## 🛋️ Individual Product Detail Slugs

Individual product details pages (`/products/[slug]`) should be mapped as nested page layouts in WordPress under `/products/`:

| Next.js Dynamic Product Link | Target WordPress URL |
| :--- | :--- |
| `/products/[slug]` (e.g. `/products/mahogany-accent-chair`) | `/products/[slug]/` (e.g. `/products/mahogany-accent-chair/`) |

---

## 💬 WhatsApp Custom Link Handlers

Next.js links calling `getGeneralWhatsAppLink` or custom messages should map directly to WhatsApp APIs:
- **General Inquiries**: `https://wa.me/919567193992?text=Hello%20ZOOSH...`
- **Product Specifics**: `https://wa.me/919567193992?text=Hello%20ZOOSH%20I%20am%20interested%20in...` (prefilled dynamically via Javascript click listeners on the product detail page).

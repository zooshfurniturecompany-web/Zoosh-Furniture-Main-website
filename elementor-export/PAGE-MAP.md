# ZOOSH Website — Elementor Page Map Manifest

This document catalogs every route, source page, shared component, and client-side interaction script within the ZOOSH website. It classifies each page by its suitability for flat extraction into Elementor.

---

## 🌐 Page Index & Classification

| Page Name | Current Route | Next.js Source File | Category | Flat Export Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/` | `app/(storefront)/page.tsx` | Storefront | **High** (Marketing Content) |
| **About Story** | `/about` | `app/(storefront)/about/page.tsx` | Storefront | **High** (Marketing Content) |
| **Custom Services** | `/custom` | `app/(storefront)/custom/page.tsx` | Storefront | **High** (Marketing Content) |
| **Contact Info** | `/contact` | `app/(storefront)/contact/page.tsx` | Storefront | **High** (Interactive Form) |
| **Gallery Portfolio**| `/gallery` | `app/(storefront)/gallery/page.tsx` | Storefront | **High** (Filtered Portfolio) |
| **Catalog Listing** | `/collection` | `app/(storefront)/collection/page.tsx` | Storefront | **Medium** (Needs Client-side JS Search) |
| **Room Categories** | `/[room]` | `app/(storefront)/[room]/page.tsx` | Storefront | **Medium** (Static Page per Room slug) |
| **Subcategories** | `/[room]/[subcategory]` | `app/(storefront)/[room]/[subcategory]/page.tsx` | Storefront | **Medium** (Static Page per Subcategory) |
| **Product Detail** | `/products/[slug]` | `app/(storefront)/products/[slug]/page.tsx` | Storefront | **Medium** (Static Page per Product SKU) |
| **Search Results** | `/search` | `app/(storefront)/search/page.tsx` | Storefront | **Medium** (Needs Client-side JS Query) |
| **Custom Estimator** | `/new`, `/admin`, `/dashboard`, `/history`, `/result/[id]`, `/login` | `app/(estimator)/*` | Application | **Low** (Dynamic App / DB-linked, mockups only) |
| **Furniture Control System (FCS)** | `/fcs/*` | `app/(fcs)/*` | Admin ERP | **Low** (ERP DB Dashboard, mockups only) |

---

## 🛠️ Page Analysis Details

### 1. Homepage (`/`)
- **Visual Sections**:
  - Fullscreen Hero Slideshow (Crossfade carousel, hover-pause, arrows, dot page indicators).
  - Rooms Navigation Grid (Living, Dining, Bedroom, Entryway).
  - Key Brand Pillars (Grid of 4 with Lucide icons).
  - Selected Projects (Card rows).
  - Dynamic Products Tabs ("All" + categories, quick-view popup trigger).
  - Instagram Portfolio Feed (Grid of 4).
- **Elementor Implementation**: 
  - Pasted inside Elementor HTML widget.
  - Requires Custom vanilla JS slideshow engine and category-tab grid toggles.

### 2. About Page (`/about`)
- **Visual Sections**:
  - Accent Header Banner.
  - Editorial Column (Brand vision text block).
  - Core Pillars Grid (3 cards with Lucide icons).
  - Vertical Growth Timeline (Linear markers for years 2021, 2023, 2026).
  - Curated Showcase Grid (3 signature product cards).
- **Elementor Implementation**:
  - Very high layout fidelity, no complex client-side JS needed except for quick-view modal support.

### 3. Custom Page (`/custom`)
- **Visual Sections**:
  - Hero banner.
  - Concept Drawing Columns (Visual image + details).
  - Custom Crafting Sequence (Horizontal flow of 5 steps with custom icon dividers).
  - Space Blueprint Call-To-Action (WhatsApp redirect button).
  - Bespoke Portfolio Grid (3 custom product cards).
- **Elementor Implementation**:
  - Fully static, maps perfectly to responsive CSS.

### 4. Contact Page (`/contact`)
- **Visual Sections**:
  - Header contact title.
  - Address details with inline SVG icons.
  - Instant WhatsApp chat card.
  - Interactive Contact Form (Inputs for Name, Email, Subject, Message).
- **Elementor Implementation**:
  - Requires vanilla JS validation and submission listener to handle simulated loading spinner and success checkbox popup.

### 5. Gallery Page (`/gallery`)
- **Visual Sections**:
  - Gallery header title.
  - Category Filter tags ("All", "Sofa", "Dining Table", "Chairs", "Bedroom", "Details").
  - Responsive Masonry image grid (slide-up metadata panels and product redirect links).
  - Fullscreen Lightbox Modal (Zoom overlay, navigation arrows, ESC key listener).
- **Elementor Implementation**:
  - Requires a vanilla JS Masonry layout engine (or CSS column layout fallback) and lightbox index manager.

### 6. Catalog Listing Page (`/collection`)
- **Visual Sections**:
  - Header title.
  - Category horizontal filter tags.
  - Real-time text search input field.
  - Catalog Grid displaying product cards.
- **Elementor Implementation**:
  - Requires a client-side vanilla JS script that reads the catalog data from a local variable (embedded `products.json` array) to handle instant filtering and text matches.

### 7. Room Categories (`/[room]`)
- **Current Dynamic Slugs**: `/living`, `/dining`, `/bedroom`, `/entryway`
- **Visual Sections**:
  - Cover hero banner.
  - Subcategory navigational pills.
  - Highlights grid.
  - Full space catalog grid.
  - Bottom customized sizing CTA banner.
- **Elementor Implementation**:
  - Exported as 4 separate static HTML files (one for each room category), replacing dynamic Next.js param inputs.

### 8. Subcategory Listings (`/[room]/[subcategory]`)
- **Visual Sections**:
  - Breadcrumb trails (`Home > Room > Subcategory`).
  - Catalog listing grid with material filter pills.
  - Sort selection dropdown (Price high/low, newest, featured).
- **Elementor Implementation**:
  - Exported as static HTML templates for individual subcategories with client-side JS sorting.

### 9. Product Details (`/products/[slug]`)
- **Visual Sections**:
  - Breadcrumb navigation.
  - Product Image Gallery (Thumbnails grid, main picture slider, zoom actions).
  - Sticky details column: variant selectors (wood choices, fabric selection), custom size calculator, and direct WhatsApp request link.
  - Specifications table (Dimensions, Wood type, Assembly status).
  - Custom size calculation drawer.
  - Recommended products grid.
- **Elementor Implementation**:
  - Exported as static HTML files per product, containing custom size forms and gallery slide JS triggers.

# ZOOSH Website — Elementor Dynamic Data Guide

This document lists the React state and data files that drive the Next.js storefront pages, providing instructions on how to handle these dynamic dependencies inside flat Elementor HTML widgets.

---

## 🗄️ Database & Catalog State

The storefront uses a static JSON file (`data/products.json`) as its core database, containing details on materials, wood types, pricing, descriptions, and catalog images.

### 1. Storefront Product Grid & Tabs Filtering
- **How it works in Next.js**: 
  - `activeTab` React state filters the products array.
  - Clicking cards updates `selectedProduct` to open a quick-view modal.
- **How to replicate in Elementor**:
  - We will embed a minified catalog array inside `zoosh-global.js` or page-specific files.
  - A client-side JavaScript loop will render product cards dynamically, enabling filters, search keywords, and quick-view popups directly in the widget without page reloads.

### 2. Search Page Filtering (`/search?q=query`)
- **How it works in Next.js**:
  - `useSearchParams` retrieves the query string.
  - Filters are run on the products array, and results are displayed in a responsive grid.
- **How to replicate in Elementor**:
  - We will write a vanilla JS script that parses the URL query parameter `window.location.search`, filters the embedded catalog array, and updates the search results grid.

### 3. Contact Form Submission
- **How it works in Next.js**:
  - React states (`isSubmitting`, `isSubmitted`) toggle a loading state for 1.5s and then show a success check icon popup.
- **How to replicate in Elementor**:
  - We will include an event listener (`form.addEventListener('submit', ...)`) that intercepts submissions, displays a CSS-based spinner, and highlights a success toast.
  - *Recommendation*: Connect the form action attributes to custom WordPress endpoints or use Elementor Form widgets to receive entries via email or webhook.

### 4. Custom Size Estimator & ERP Panels (`(estimator)` / `(fcs)`)
- **How they work in Next.js**:
  - These tools communicate with Supabase database tables to pull client sheets, cashbooks, and expense metrics in real-time.
- **How to replicate in Elementor**:
  - **IMPORTANT**: These are database applications. Pasting them inside Elementor HTML widgets will only yield static visual mockup layouts with zero database connections.
  - *Recommendation*: Host the Next.js admin app on a separate subdomain (e.g. `fcs.zooshfurniture.com`) and embed link targets in your WordPress/Elementor header to point there, rather than hosting database panels within WordPress widgets.

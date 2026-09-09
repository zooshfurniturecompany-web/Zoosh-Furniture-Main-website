# ZOOSH Website — Space Categories Elementor Integration Guide

This directory contains the Elementor-ready flat code for the 4 primary Space category templates:
1. **Living Room** (`room-living.html`)
2. **Dining Space** (`room-dining.html`)
3. **Bedroom Retreat** (`room-bedroom.html`)
4. **Entryway & Mirrors** (`room-entryway.html`)

They share a single stylesheet (`room.css`) and scripting modules file (`room.js`) to simplify styles management.

---

## 📂 Files Overview
- **`room-*.html`**: The HTML layouts for individual rooms, detailing unique space headers, subcategory menus, highlights, and custom sizing banners.
- **`room.css`**: Common styling rules, subcategory navigational pills, layout alignments, and cover page banners.
- **`room.js`**: Core Javascript modules that verify active categories based on the parent wrapper's `data-room` attribute, scan the global catalog array, and render featured highlights and general products dynamically.

---

## ⚙️ Installation Instructions

### Step 1: Create Space Pages in WordPress
Create four individual pages corresponding to your rooms and set their slug routes:
- Living Room Page (slug: `living`)
- Dining Space Page (slug: `dining`)
- Bedroom Retreat Page (slug: `bedroom`)
- Entryway Page (slug: `entryway`)

Set their templates to **Elementor Full Width** and edit them.

### Step 2: Add HTML & CSS/JS Widgets
For each page:
1. Add a **Single Column Section** set to Full Width.
2. Insert an **HTML Widget**.
3. Paste the corresponding HTML code from the files:
   - On `/living/`, paste **`room-living.html`**.
   - On `/dining/`, paste **`room-dining.html`**.
   - On `/bedroom/`, paste **`room-bedroom.html`**.
   - On `/entryway/`, paste **`room-entryway.html`**.
4. Paste the shared styling rules and script triggers inside the widget:
   ```html
   <style>
     /* Paste contents of room.css here */
   </style>
   <script>
     /* Paste contents of room.js here */
   </script>
   ```

---

## ⚠️ Notes & Category Redirects
- The subcategory buttons link to nested sub-pages, e.g. `/living/sofas/` or `/dining/dining-chairs/`. Make sure you create these subcategory pages in WordPress, or redirect them to point to the collection page with query filters:
  - e.g., Replace `/living/sofas/` with `/collection/?category=Sofa` to filter the catalog dynamically.

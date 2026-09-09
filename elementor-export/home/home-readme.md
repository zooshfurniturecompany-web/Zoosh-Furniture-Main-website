# ZOOSH Website — Homepage Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH homepage layout, including the hero slider, space categories, tab-filtered creations catalog, and quick-view modals.

---

## 📂 Files Overview
1. **`home.html`**: The HTML markup containing slideshow slides, spaces grid, catalog tabs placement, brand features, completed projects, and modal placeholders.
2. **`home.css`**: Layout styles, viewport calculation for fullscreen slider height, categories grid alignments, and modal views.
3. **`home.js`**: Core Javascript modules for the slideshow transitions, pausing-on-hover timer, products tabs rendering, and popup modals.

---

## ⚙️ Installation Instructions

### Step 1: Requirements Check
Before publishing the homepage, make sure the shared global layout assets are correctly set up (see [Shared Readme](../shared/shared-readme.md)):
- **`zoosh-global.css`** is loaded.
- **`zoosh-global.js`** is loaded in the header/footer (provides the database variable `window.ZOOSH_PRODUCTS`).

---

### Step 2: Build the Page in Elementor
1. Create a new WordPress Page (Title: **Home**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`home.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of home.css here */
   </style>
   <script>
     /* Paste contents of home.js here */
   </script>
   ```

---

## ⚠️ Notes & Image Recommendations
- All images point to the local server paths (`/images/...`). Once you upload your catalog and brand graphics to the WordPress Media Library, replace these paths inside `home.html` and `home.js` with the corresponding WordPress URL (e.g., `https://yourdomain.com/wp-content/uploads/2026/08/page_15_img_00.webp`).
- Refer to [Asset Manifest](../ASSETS.md) to locate and upload all image files cleanly.

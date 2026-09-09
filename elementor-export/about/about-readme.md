# ZOOSH Website — About Page Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Our Story & Philosophy" page, including the editorial brand vision, core pillars grid, vertical chronology timeline, and curated showcase.

---

## 📂 Files Overview
1. **`about.html`**: The HTML markup containing editorial profile text blocks, growth timeline, and curated collection grids.
2. **`about.css`**: Layout styles, grid alignments, core pillars design, and vertical chronology dash-lines.
3. **`about.js`**: Core Javascript to fetch the first three signature catalog creations from `window.ZOOSH_PRODUCTS` and bind click actions to the quick-view modal.

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Our Story**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`about.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of about.css here */
   </style>
   <script>
     /* Paste contents of about.js here */
   </script>
   ```

---

## ⚠️ Notes & Image Recommendations
- All images point to the local or remote Unsplash server paths. Once you upload your catalog and brand graphics to the WordPress Media Library, replace these paths inside `about.html` and `about.js` with the corresponding WordPress URL.
- Refer to [Asset Manifest](../ASSETS.md) to locate and upload all image files cleanly.

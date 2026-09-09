# ZOOSH Website — Custom Services Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Custom Furniture Services" page, detailing the design consultation flow, CAD/rendering checkpoints, timber materials selections, and custom showcase grid.

---

## 📂 Files Overview
1. **`custom.html`**: The HTML markup detailing the custom consultation column grids, 5-stage carpentry process, and WhatsApp discussion banners.
2. **`custom.css`**: Layout styles, process grids, hover states, and background filters for the blue custom consultation panel.
3. **`custom.js`**: Resolves dynamic WhatsApp redirection API messages and extracts three custom-crafted product models from the catalog database.

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Custom Furniture**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`custom.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of custom.css here */
   </style>
   <script>
     /* Paste contents of custom.js here */
   </script>
   ```

---

## ⚠️ Notes & Image Recommendations
- All images point to the local or remote Unsplash server paths. Once you upload your catalog and brand graphics to the WordPress Media Library, replace these paths inside `custom.html` and `custom.js` with the corresponding WordPress URL.
- Refer to [Asset Manifest](../ASSETS.md) to locate and upload all image files cleanly.

# ZOOSH Website — Catalog Page Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Custom Solid Wood Catalog" page. It features an interactive, search-matched catalog grid driven entirely by client-side JavaScript referencing the global `window.ZOOSH_PRODUCTS` database.

---

## 📂 Files Overview
1. **`collection.html`**: The HTML skeleton for category buttons horizontal list, search box, product grid targets, empty results cards, and quick-view modals.
2. **`collection.css`**: Styling rules, flex-layout alignments for filters rows, search box paddings, and card columns.
3. **`collection.js`**: Integrates search keyword indexing, syncs query parameters with the browser history dynamically, renders matching catalog products, and triggers quick-view modals.

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Collection Catalog**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`collection.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of collection.css here */
   </style>
   <script>
     /* Paste contents of collection.js here */
   </script>
   ```

---

## ⚠️ Notes & dynamic routing parameters
- The collection catalog is designed to automatically capture incoming room filters via URL query parameters, e.g. `/collection/?category=Dining%20Table` or queries `/collection/?q=Sofa`. If a user clicks a room link in the header row, it redirects them here, and the JS updates the active filters instantly.

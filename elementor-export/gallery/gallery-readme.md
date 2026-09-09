# ZOOSH Website — Gallery Page Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Inspiration Gallery" page. It features CSS-column masonry scaling, dynamic category filters, and a dark fullscreen lightbox with full keyboard navigation support.

---

## 📂 Files Overview
1. **`gallery.html`**: The HTML skeleton for category buttons targets, column grid wrappers, and the fullscreen overlay lightbox dialog.
2. **`gallery.css`**: Styling rules, CSS column layouts, slide-up hover details, zoom vectors, and lightbox navigations.
3. **`gallery.js`**: Replicates Next.js category filtering logic, updates dynamic details in the lightbox index on navigation, and listens to keyboard inputs (Esc, Left/Right Arrows).

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Inspiration Gallery**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`gallery.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of gallery.css here */
   </style>
   <script>
     /* Paste contents of gallery.js here */
   </script>
   ```

---

## ⚠️ Notes & Image Recommendations
- The gallery cards link to dynamic product templates `/products/[slug]/`. If your product detail page URLs are different in WordPress, update the anchor target generation inside `gallery.js` line 144:
  ```javascript
  if (lboxLink) lboxLink.href = "/products/" + item.slug + "/";
  ```

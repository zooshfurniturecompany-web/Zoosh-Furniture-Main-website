# ZOOSH Website — Shared Header & Footer Elementor Integration

This directory contains the Elementor-ready assets for the global Header, Footer, stylesheets, and data hooks. Follow these instructions to set them up within your WordPress site.

---

## 📂 Files Overview
1. **`zoosh-global.css`**: Global design system classes (typography tokens, colors, custom scrollbars, keyframe animations).
2. **`zoosh-global.js`**: Global catalog database array (`window.ZOOSH_PRODUCTS`) and WhatsApp enquiry link utilities.
3. **`header.html`**, `header.css`, `header.js`: The two-row header, dynamic category hover mega menus, and mobile sidebar.
4. **`footer.html`**, `footer.css`, `footer.js`: The dark brand footer, map indices, and contact details.

---

## ⚙️ Installation Guide

### Step 1: Add Global Files
To make sure typography, colors, animations, and database arrays are available across all pages, load the global CSS and JS files on every page:

1. **Global Stylesheet (`zoosh-global.css`)**:
   - Go to **WordPress Customizer** → **Additional CSS**, or paste the contents of `zoosh-global.css` into your theme's stylesheet (`style.css`), or load it inside **Elementor Custom Code** as a `<style>` block.
2. **Global JavaScript (`zoosh-global.js`)**:
   - Create a custom script block via your WordPress headers/footers manager, or use **Elementor Custom Code** (Header/Footer location) and paste the code wrapped in a `<script>` tag:
     ```html
     <script>
       /* Paste contents of zoosh-global.js here */
     </script>
     ```

---

### Step 2: Build the Header
You should set up the header template using **Elementor Theme Builder** (Header Template):

1. Add a **Single Column Section** set to Full Width with no columns gap.
2. Inside it, insert an **HTML Widget**.
3. Paste the contents of **`header.html`** into the HTML code panel.
4. Directly below the HTML content inside the same widget (or in Elementor Custom Code), paste the styles and script triggers:
   ```html
   <style>
     /* Paste contents of header.css here */
   </style>
   <script>
     /* Paste contents of header.js here */
   </script>
   ```

---

### Step 3: Build the Footer
You should set up the footer template using **Elementor Theme Builder** (Footer Template):

1. Add a **Single Column Section** set to Full Width.
2. Insert an **HTML Widget**.
3. Paste the contents of **`footer.html`** into the HTML code panel.
4. Paste the styles and script triggers:
   ```html
   <style>
     /* Paste contents of footer.css here */
   </style>
   <script>
     /* Paste contents of footer.js here (optional) */
   </script>
   ```

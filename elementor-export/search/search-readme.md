# ZOOSH Website — Search Page Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Search Results" page. It filters and displays catalog matches dynamically based on incoming text query inputs using client-side JavaScript.

---

## 📂 Files Overview
1. **`search.html`**: The HTML markup containing headers, matching results grid, empty search warnings, and quick-view modals.
2. **`search.css`**: Styling rules, query title sizes, and grid list layouts.
3. **`search.js`**: Parses URL query parameters `?q=...`, performs dynamic catalog scanning against titles, descriptions, categories, and materials, and populates the grid.

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Search Results**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`search.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of search.css here */
   </style>
   <script>
     /* Paste contents of search.js here */
   </script>
   ```

---

## ⚠️ Notes
- The search page relies on search queries input from the header bar (which submits a `GET` request pointing to `/search/?q=xyz`). Ensure that the header search form action attribute is configured correctly to match the search results page URL in WordPress.

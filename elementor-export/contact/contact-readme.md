# ZOOSH Website — Contact Page Elementor Integration Guide

This directory contains the Elementor-ready flat code for the ZOOSH "Contact Our Pattambi Workshop" page, detailing HQ locations, maps coordinates links, dynamic WhatsApp support tiles, and interactive contact message forms.

---

## 📂 Files Overview
1. **`contact.html`**: The HTML markup detailing the address card lists, direct WhatsApp support panel, message input field layout, loading, and success overlay panels.
2. **`contact.css`**: Layout styles, split grids columns, focus borders, spinner rotations, and checked indicators.
3. **`contact.js`**: Resolves WhatsApp chat pre-fills and intercepts submit triggers to display the loading screens and success modals.

---

## ⚙️ Installation Instructions

### Step 1: Add HTML & CSS/JS Widget
1. Create a new WordPress Page (Title: **Contact Us**), set the template to **Elementor Full Width**, and open it in Elementor.
2. Add a **Single Column Section** set to Full Width. Set all margins and column gaps to zero.
3. Insert an **HTML Widget** inside the section.
4. Open **`contact.html`**, copy the entire contents, and paste it into the HTML code field.
5. Paste the style rules and scripting hooks directly inside the widget panel (or link them via Elementor Custom Code):
   ```html
   <style>
     /* Paste contents of contact.css here */
   </style>
   <script>
     /* Paste contents of contact.js here */
   </script>
   ```

---

## ⚠️ Notes & Form Submissions Integration
- **Direct Mail / CRM Integrations**: The contact form contains local JS handlers that simulate loading delays before displaying success messages. If you want emails sent to your inbox, we recommend:
  - Replacing the `<form>` markup with a native **Elementor Pro Form Widget** or **Contact Form 7** shortcode.
  - Applying the classes `.zoosh-form-input` and `.zoosh-form-textarea` directly inside the form settings to match the font styling.

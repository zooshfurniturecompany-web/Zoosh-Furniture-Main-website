# ZOOSH Website — Elementor Typography & Fonts Setup

This document specifies the font import configurations and font-family rules to replicate the premium Granjon-esque editorial styling of the ZOOSH Next.js storefront inside Elementor/WordPress.

---

## 🅰️ Font Selections

The visual system of the website relies on two primary typefaces:
1. **EB Garamond** (Google Fonts): Used for all headings, title elements, and serif text tags, delivering a clean, luxury editorial weight.
2. **Plus Jakarta Sans** (Google Fonts): Used for body content, feature descriptions, UI details, tabs, and form labels, ensuring clear sans-serif legibility.

---

## 📦 Import Methods

Choose one of the following methods to load these fonts in WordPress / Elementor:

### Method A: HTML Header Embed (Recommended)
Add this code to your website's `<head>` section (WordPress Customizer → Custom CSS/JS, or via Elementor Custom Code tool):

```html
<!-- Google Fonts Preconnect and Style Embed for ZOOSH -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
```

### Method B: CSS Import (Theme Stylesheet)
If you prefer loading fonts within your stylesheet, paste this line at the absolute top of your global CSS (`zoosh-global.css`):

```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
```

---

## 🎨 CSS Styling Rules

Use the following font variables in your CSS declarations to apply these typefaces consistently:

```css
/* Custom variables for font selectors */
:root {
  --zoosh-font-serif: "EB Garamond", Georgia, serif;
  --zoosh-font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
}

/* Headings typography reset */
h1, h2, h3, h4, h5, h6, .zoosh-font-serif {
  font-family: var(--zoosh-font-serif);
  letter-spacing: -0.01em;
}

/* Body typography reset */
body, p, span, input, select, textarea, .zoosh-font-sans {
  font-family: var(--zoosh-font-sans);
  font-weight: 300; /* Light text styling is a signature of the ZOOSH aesthetic */
}
```

# ZOOSH Website — Elementor Asset Manifest

This document catalogs every image, SVG, and media asset found in the ZOOSH Next.js storefront, identifying where they are used and outlining recommended destinations when uploading them to the WordPress Media Library.

---

## 🖼️ Media Library Mapping

When uploading these assets to WordPress, we recommend keeping their filenames descriptive. Once uploaded, you should replace the local path `/images/...` in your Elementor HTML widgets with the corresponding WordPress attachment URL (e.g. `https://yourdomain.com/wp-content/uploads/YYYY/MM/filename.ext`).

### 1. Primary Hero Slideshow Images
| File Name | Original path in Public/ | Where Used | Recommended WordPress Destination |
| :--- | :--- | :--- | :--- |
| `page_15_img_00.webp` | `/images/catalog/page_15_img_00.webp` | Homepage Slide 1 | Media Library `/uploads/page_15_img_00.webp` |
| `page_21_img_00.webp` | `/images/catalog/page_21_img_00.webp` | Homepage Slide 2 | Media Library `/uploads/page_21_img_00.webp` |
| `page_22_img_00.webp` | `/images/catalog/page_22_img_00.webp` | Homepage Slide 3 | Media Library `/uploads/page_22_img_00.webp` |
| `IMG_0339.jpg` | `/images/IMG_0339.jpg` | Homepage Slide 4 | Media Library `/uploads/IMG_0339.jpg` |
| `IMG_1167.jpg` | `/images/IMG_1167.jpg` | Homepage Slide 5 | Media Library `/uploads/IMG_1167.jpg` |

### 2. Space Hero Cover Banners
| File Name | Original path in Public/ | Where Used | Recommended WordPress Destination |
| :--- | :--- | :--- | :--- |
| `page_14_img_00.webp` | `/images/catalog/page_14_img_00.webp` | Living Space Hero | Media Library `/uploads/page_14_img_00.webp` |
| `page_21_img_00.webp` | `/images/catalog/page_21_img_00.webp` | Dining Space Hero | Media Library `/uploads/page_21_img_00.webp` |
| `page_22_img_00.webp` | `/images/catalog/page_22_img_00.webp` | Bedroom Space Hero | Media Library `/uploads/page_22_img_00.webp` |
| `page_27_img_00.webp` | `/images/catalog/page_27_img_00.webp` | Entryway Space Hero | Media Library `/uploads/page_27_img_00.webp` |

### 3. Core Storefront Page Graphics
| File Name | Original path in Public/ | Where Used | Recommended WordPress Destination |
| :--- | :--- | :--- | :--- |
| `photo-1618219908412-a29a1bb7b86e.jpg` | Unsplash Remote | About & Custom Hero | Media Library `/uploads/about-hero-bg.jpg` |
| `photo-1616486338812-3dadae4b4ace.jpg` | Unsplash Remote | About editorial column | Media Library `/uploads/about-profile.jpg` |
| `photo-1616046229478-9901c5536a45.jpg` | Unsplash Remote | Custom editorial column | Media Library `/uploads/custom-profile.jpg` |

### 4. Shared Vector SVG Icons
We recommend pasting inline SVGs directly inside the Elementor HTML widget instead of linking to `.svg` files to avoid rendering delay and layout shifts.
- **Sparkles Icon**: Used in Features grids.
- **PenTool Icon**: Used in Features grids & Custom process.
- **Layers Icon**: Used in Features grids.
- **Star Icon**: Used in Features grids & Highlights.
- **Send (WhatsApp) Icon**: Used in Custom CTA & Contact forms.
- **MapPin, Phone, Mail Icons**: Used in Contact details list.

---

## 📁 Catalog Product Images Folder
All dynamic product models in the catalog database map to specific files inside `public/images/catalog/` or WhatsApp media assets. 

> [!TIP]
> Upload the entire contents of `public/images/catalog` (approximately 99 items) directly into your WordPress Media Library directory to support product list rendering. Keep these files grouped for clean referencing.

import json
import csv
import re
import os
import urllib.parse

def clean_image_url(url_or_path: str) -> str:
    if not url_or_path:
        return "https://zoosh.in/images/hero-bg.jpg"
    
    full_url = url_or_path if url_or_path.startswith("http") else f"https://zoosh.in{url_or_path}"
    parts = urllib.parse.urlsplit(full_url)
    clean_path = urllib.parse.quote(parts.path)
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, clean_path, parts.query, parts.fragment))

def export_to_shopify_csv():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_json_path = os.path.join(base_dir, 'data', 'products.json')
    csv_output_path = os.path.join(base_dir, 'zoosh-shopify-products-import.csv')

    with open(products_json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    headers = [
        'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type',
        'Tags', 'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
        'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker',
        'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service',
        'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable',
        'Variant Barcode', 'Image Src', 'Image Position', 'Image Alt Text', 'Gift Card',
        'SEO Title', 'SEO Description', 'Google Shopping / Google Product Category',
        'Status'
    ]

    rows = []

    for p in products:
        title = p.get('name', '').strip()
        sku = p.get('sku', '').strip()
        handle = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        if not handle:
            handle = sku.lower()
        
        cat = p.get('category', 'Furniture')
        material = p.get('material', 'Solid Hardwood').replace('/', '-').strip()
        finish = p.get('finish', 'Matte Polish').replace('/', '-').strip()
        fabric = p.get('fabric', 'Tailored Upholstery')
        rattan = p.get('rattan', '')
        dimensions = p.get('dimensions', 'Custom Dimensions')
        price = p.get('price', 0)
        compare_price = round(price * 1.15) if price > 0 else ''
        desc = p.get('description', '')
        
        # Build clean HTML description
        body_html = f"<p>{desc}</p>\n" \
                    f"<h3>Product Specifications</h3>\n" \
                    f"<ul>\n" \
                    f"  <li><strong>Base Material:</strong> {material}</li>\n" \
                    f"  <li><strong>Finish / Polish:</strong> {finish}</li>\n" \
                    f"  <li><strong>Dimensions:</strong> {dimensions}</li>\n"
        if fabric:
            body_html += f"  <li><strong>Fabric Upholstery:</strong> {fabric}</li>\n"
        if rattan:
            body_html += f"  <li><strong>Rattan Weaving:</strong> {rattan}</li>\n"
        
        body_html += f"  <li><strong>Manufacturing Atelier:</strong> Pattambi Factory, Palakkad, Kerala</li>\n" \
                     f"  <li><strong>Warranty:</strong> 5-Year Structural Frame Warranty</li>\n" \
                     f"  <li><strong>Customization:</strong> Available upon request</li>\n" \
                     f"</ul>\n" \
                     f"<h3>Artisanal Made-to-Order Process</h3>\n" \
                     f"<p>Every piece is fabricated to order by our master carpenters. Zero mass-production or particle board fillers. Insured white-glove transport across India.</p>"

        tags = f"Furniture, {cat}, {material}, {finish}, Made to Order, Solid Wood, Kerala Crafted"
        seo_title = f"{title} | Handcrafted Solid Wood Furniture | ZOOSH"
        seo_desc = f"Handcrafted {title} made from {material} with {finish}. Custom bespoke furniture made to order by ZOOSH Kerala."
        
        images = p.get('images', [])
        if not images:
            images = ['/images/hero-bg.jpg']
        
        # Primary Row
        first_img_url = clean_image_url(images[0])
        clean_dim = dimensions.split('(')[0].replace('/', 'x').strip() if '(' in dimensions else dimensions.replace('/', 'x')
        
        first_row = {
            'Handle': handle,
            'Title': title,
            'Body (HTML)': body_html,
            'Vendor': 'ZOOSH',
            'Product Category': 'Furniture > Sofas',
            'Type': cat,
            'Tags': tags,
            'Published': 'TRUE',
            'Option1 Name': 'Material',
            'Option1 Value': material,
            'Option2 Name': 'Dimensions',
            'Option2 Value': clean_dim,
            'Option3 Name': '',
            'Option3 Value': '',
            'Variant SKU': sku,
            'Variant Grams': '50000',
            'Variant Inventory Tracker': 'shopify',
            'Variant Inventory Qty': '10',
            'Variant Inventory Policy': 'continue',
            'Variant Fulfillment Service': 'manual',
            'Variant Price': f"{price:.2f}" if price > 0 else '0.00',
            'Variant Compare At Price': f"{compare_price:.2f}" if compare_price else '',
            'Variant Requires Shipping': 'TRUE',
            'Variant Taxable': 'TRUE',
            'Variant Barcode': '',
            'Image Src': first_img_url,
            'Image Position': '1',
            'Image Alt Text': f"{title} - {material} by ZOOSH",
            'Gift Card': 'FALSE',
            'SEO Title': seo_title,
            'SEO Description': seo_desc,
            'Google Shopping / Google Product Category': 'Furniture',
            'Status': 'active'
        }
        rows.append(first_row)
        
        # Extra images
        for idx, img in enumerate(images[1:], start=2):
            img_url = clean_image_url(img)
            extra_row = {
                'Handle': handle,
                'Title': '',
                'Body (HTML)': '',
                'Vendor': '',
                'Product Category': '',
                'Type': '',
                'Tags': '',
                'Published': '',
                'Option1 Name': '',
                'Option1 Value': '',
                'Option2 Name': '',
                'Option2 Value': '',
                'Option3 Name': '',
                'Option3 Value': '',
                'Variant SKU': '',
                'Variant Grams': '',
                'Variant Inventory Tracker': '',
                'Variant Inventory Qty': '',
                'Variant Inventory Policy': '',
                'Variant Fulfillment Service': '',
                'Variant Price': '',
                'Variant Compare At Price': '',
                'Variant Requires Shipping': '',
                'Variant Taxable': '',
                'Variant Barcode': '',
                'Image Src': img_url,
                'Image Position': str(idx),
                'Image Alt Text': f"{title} Detail View {idx}",
                'Gift Card': '',
                'SEO Title': '',
                'SEO Description': '',
                'Google Shopping / Google Product Category': '',
                'Status': ''
            }
            rows.append(extra_row)

    with open(csv_output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully regenerated {csv_output_path} with {len(rows)} rows for {len(products)} products.")

if __name__ == '__main__':
    export_to_shopify_csv()

import os
import zipfile

def package_theme():
    theme_dir = os.path.join(os.path.dirname(__file__), '..', 'shopify-theme')
    theme_dir = os.path.abspath(theme_dir)
    output_zip = os.path.join(os.path.dirname(__file__), '..', 'zoosh-homeworkliving-theme.zip')
    output_zip = os.path.abspath(output_zip)

    if os.path.exists(output_zip):
        os.remove(output_zip)

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(theme_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Compute relative path from theme_dir
                rel_path = os.path.relpath(file_path, theme_dir)
                # Normalize slashes to forward slashes for Linux/Shopify compatibility
                arcname = rel_path.replace(os.sep, '/')
                zipf.write(file_path, arcname)
                print(f"Added: {arcname}")

    print(f"\n[SUCCESS] Successfully packaged theme into: {output_zip}")
    print(f"File size: {os.path.getsize(output_zip):,} bytes")

if __name__ == '__main__':
    package_theme()

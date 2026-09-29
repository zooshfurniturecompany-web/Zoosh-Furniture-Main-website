/* ==========================================================================
   ZOOSH SHOPIFY THEME JAVASCRIPT
   ========================================================================== */

// 1. Category Slider Smooth Scrolling
window.scrollCategorySlider = function(offset) {
  const track = document.getElementById('category-slider-track');
  if (track) {
    track.scrollBy({ left: offset, behavior: 'smooth' });
  }
};

// 2. Mobile Navigation Toggle
window.toggleMobileNav = function() {
  const nav = document.getElementById('mobile-nav');
  if (nav) {
    if (nav.style.display === 'none' || nav.classList.contains('hidden')) {
      nav.style.display = 'block';
      nav.classList.remove('hidden');
      nav.classList.add('open');
    } else {
      nav.style.display = 'none';
      nav.classList.add('hidden');
      nav.classList.remove('open');
    }
  }
};

// 3. Cart Drawer Toggle
window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer-container');
  if (drawer) {
    drawer.classList.toggle('open');
  }
};

// 4. Quick Add To Cart via Ajax API
window.quickAddToCart = async function(variantId) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    });
    if (response.ok) {
      window.refreshCartDrawer();
      window.toggleCartDrawer();
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};

// 5. Update Cart Quantity
window.updateCartQuantity = async function(lineKey, quantity) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: lineKey,
        quantity: quantity
      })
    });
    if (response.ok) {
      window.location.reload();
    }
  } catch (err) {
    console.error('Error updating cart:', err);
  }
};

// 6. Refresh Cart Drawer HTML
window.refreshCartDrawer = async function() {
  try {
    const res = await fetch('/?section_id=cart-drawer');
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newItems = doc.getElementById('cart-drawer-items');
    const currItems = document.getElementById('cart-drawer-items');
    if (newItems && currItems) {
      currItems.innerHTML = newItems.innerHTML;
    }
  } catch (err) {
    console.error('Error refreshing cart:', err);
  }
};

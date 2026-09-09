document.addEventListener("DOMContentLoaded", function() {
  
  const container = document.getElementById("zooshRoomContainer");
  if (!container) return;

  const roomSlug = container.getAttribute("data-room");
  const catalog = window.ZOOSH_PRODUCTS || [];

  // Helper function to resolve room and subcategory categories
  function getRoomAndSubcategory(category) {
    const cat = (category || "").toLowerCase();
    if (cat.includes("sofa")) return { room: "living", subcategory: "sofas" };
    if (cat.includes("lounge chair")) return { room: "living", subcategory: "lounge-chairs" };
    if (cat.includes("dining chair")) return { room: "dining", subcategory: "dining-chairs" };
    if (cat.includes("dining table")) return { room: "dining", subcategory: "dining-tables" };
    if (cat.includes("dining bench")) return { room: "dining", subcategory: "dining-benches" };
    if (cat.includes("bar stool")) return { room: "dining", subcategory: "bar-stools" };
    
    if (cat.includes("bed cot") || cat.includes("bed")) return { room: "bedroom", subcategory: "bed-cots" };
    if (cat.includes("side table") && cat.includes("bed")) return { room: "bedroom", subcategory: "bedside-tables" };
    if (cat.includes("bedside table") || cat.includes("nightstand")) return { room: "bedroom", subcategory: "bedside-tables" };
    if (cat.includes("bedroom chair")) return { room: "bedroom", subcategory: "bedroom-chairs" };
    if (cat.includes("bench") && cat.includes("bed")) return { room: "bedroom", subcategory: "benches" };
    
    if (cat.includes("console table") && cat.includes("entry")) return { room: "entryway", subcategory: "console-tables" };
    if (cat.includes("mirror")) return { room: "entryway", subcategory: "mirror-units" };
    if (cat.includes("bench") && cat.includes("entry")) return { room: "entryway", subcategory: "benches" };
    if (cat.includes("bench")) return { room: "entryway", subcategory: "benches" };
    
    if (cat.includes("side table")) return { room: "living", subcategory: "side-tables" };
    if (cat.includes("centre table") || cat.includes("coffee table")) return { room: "living", subcategory: "centre-tables" };
    if (cat.includes("console table")) return { room: "living", subcategory: "console-tables" };
    if (cat.includes("tv unit") || cat.includes("media") || cat.includes("cabinet") || cat.includes("shelving")) return { room: "living", subcategory: "console-tables" };
    if (cat.includes("chair")) return { room: "living", subcategory: "arm-chairs" };
    return { room: "living", subcategory: "sofas" };
  }

  // Filter products by room slug
  const roomProducts = catalog.filter(p => getRoomAndSubcategory(p.category).room === roomSlug);
  
  // Featured Items Grid (p.featured === true, capped at 4)
  const featuredGrid = document.getElementById("zooshFeaturedGrid");
  const featuredProducts = roomProducts.filter(p => p.featured).slice(0, 4);

  if (featuredGrid) {
    if (featuredProducts.length > 0) {
      featuredProducts.forEach(p => {
        const card = createProductCard(p);
        featuredGrid.appendChild(card);
      });
    } else {
      // Hide featured section if no products are marked featured
      const featuredSec = document.getElementById("zooshFeaturedSection");
      if (featuredSec) featuredSec.style.display = "none";
    }
  }

  // All catalog items grid
  const catalogGrid = document.getElementById("zooshCatalogGrid");
  if (catalogGrid) {
    if (roomProducts.length > 0) {
      roomProducts.forEach(p => {
        const card = createProductCard(p);
        catalogGrid.appendChild(card);
      });
    } else {
      catalogGrid.innerHTML = `
        <div class="zoosh-no-results-state active" style="grid-column: 1 / -1; width:100%;">
          <p class="zoosh-no-results-text">No products currently listed under this space category.</p>
          <a href="/contact/" class="zoosh-reset-filters-btn"><span>Request Custom Consultation</span></a>
        </div>
      `;
    }
  }

  // Helper card creator
  function createProductCard(p) {
    const card = document.createElement("div");
    card.className = "zoosh-product-card";
    card.setAttribute("data-id", p.id);
    
    const primaryImage = p.images && p.images.length > 0 ? p.images[0] : "/images/placeholder.jpg";
    const formattedPrice = p.price ? "₹" + p.price.toLocaleString("en-IN") : "Price on Request";

    card.innerHTML = `
      <div class="zoosh-pcard-img-wrapper">
        <img src="${primaryImage}" alt="${p.name}" class="zoosh-pcard-img" loading="lazy" />
      </div>
      <div class="zoosh-pcard-info">
        <div class="zoosh-pcard-meta">
          <span>${p.category}</span>
          <span>${p.material || "Solid Wood"}</span>
        </div>
        <h3 class="zoosh-pcard-title">${p.name}</h3>
        <span class="zoosh-pcard-price">${formattedPrice}</span>
      </div>
    `;

    card.addEventListener("click", function() {
      openQuickView(p.id);
    });

    return card;
  }


  // =====================================================
  // QUICK VIEW OVERLAY MODAL LOGIC (SHARED ENGINE)
  // =====================================================
  const modal = document.getElementById("zooshQuickViewModal");
  const modalBody = document.getElementById("zooshModalBody");
  const modalClose = document.getElementById("zooshModalClose");
  const modalBackdrop = document.getElementById("zooshModalBackdrop");

  function openQuickView(productId) {
    const product = catalog.find(p => p.id === productId);
    if (!product || !modal || !modalBody) return;

    const formattedPrice = product.price ? "₹" + product.price.toLocaleString("en-IN") : "Price on Request";
    const primaryImage = product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.jpg";
    
    // Generate thumbnails
    let thumbsHtml = "";
    if (product.images && product.images.length > 1) {
      product.images.forEach((img, idx) => {
        thumbsHtml += `
          <button type="button" class="zoosh-modal-thumb-btn${idx === 0 ? " active" : ""}" data-idx="${idx}">
            <img src="${img}" alt="Thumbnail ${idx + 1}" />
          </button>
        `;
      });
    }

    // Build specs list
    const specs = product.specs || { material: product.material || "Solid Wood", dimensions: product.dimensions || "N/A" };
    let specsHtml = "";
    if (specs.material) {
      specsHtml += `
        <div class="zoosh-modal-spec-line">
          <span class="zoosh-modal-spec-label">Material Composition</span>
          <span class="zoosh-modal-spec-val">${specs.material}</span>
        </div>
      `;
    }
    if (specs.dimensions) {
      specsHtml += `
        <div class="zoosh-modal-spec-line">
          <span class="zoosh-modal-spec-label">Dimensions</span>
          <span class="zoosh-modal-spec-val">${specs.dimensions}</span>
        </div>
      `;
    }
    if (specs.woodType && specs.woodType !== "N/A") {
      specsHtml += `
        <div class="zoosh-modal-spec-line">
          <span class="zoosh-modal-spec-label">Wood Selection</span>
          <span class="zoosh-modal-spec-val">${specs.woodType}</span>
        </div>
      `;
    }

    // Create enquiry link
    const waLink = window.getWhatsAppLink ? window.getWhatsAppLink(product) : "#";

    modalBody.innerHTML = `
      <div class="zoosh-modal-grid">
        <div class="zoosh-modal-gallery">
          <div class="zoosh-modal-main-img-wrapper">
            <img src="${primaryImage}" alt="${product.name}" class="zoosh-modal-main-img" id="zooshModalMainImg" />
          </div>
          <div class="zoosh-modal-thumbs">
            ${thumbsHtml}
          </div>
        </div>

        <div class="zoosh-modal-details">
          <span class="zoosh-modal-category">${product.category}</span>
          <h3 class="zoosh-modal-name">${product.name}</h3>
          <span class="zoosh-modal-sku">SKU: ${product.sku}</span>
          
          <p class="zoosh-modal-desc">${product.description}</p>
          
          <div class="zoosh-modal-specs-list">
            ${specsHtml}
            <div class="zoosh-modal-spec-line">
              <span class="zoosh-modal-spec-label">Pricing</span>
              <span class="zoosh-modal-spec-val font-serif italic">${formattedPrice}</span>
            </div>
          </div>

          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="zoosh-modal-cta-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Enquire on WhatsApp</span>
          </a>

          <a href="/products/${product.slug}/" class="zoosh-modal-view-details-link">View Full Details &rarr;</a>
        </div>
      </div>
    `;

    // Bind thumbnail click triggers
    const thumbBtns = document.querySelectorAll(".zoosh-modal-thumb-btn");
    const mainImg = document.getElementById("zooshModalMainImg");
    
    thumbBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        thumbBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        const idx = parseInt(this.getAttribute("data-idx"));
        if (mainImg && product.images && product.images[idx]) {
          mainImg.src = product.images[idx];
        }
      });
    });

    modal.classList.add("active");
  }

  function closeModal() {
    if (modal) modal.classList.remove("active");
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  // Close modal on ESC key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeModal();
  });

});

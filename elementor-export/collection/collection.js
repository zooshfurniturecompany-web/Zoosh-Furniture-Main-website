document.addEventListener("DOMContentLoaded", function() {
  
  const catalog = window.ZOOSH_PRODUCTS || [];

  const tabContainer = document.getElementById("zooshCatalogTabs");
  const searchInput = document.getElementById("zooshCatalogSearch");
  const productGrid = document.getElementById("zooshCatalogGrid");
  const noResultsPanel = document.getElementById("zooshCatalogNoResults");
  const resetBtn = document.getElementById("zooshCatalogResetBtn");

  // Extract categories dynamically
  const categories = ["All"];
  catalog.forEach(p => {
    if (p.category && !categories.includes(p.category)) {
      categories.push(p.category);
    }
  });

  let activeCategory = "All";
  let searchQuery = "";

  // Check URL query parameters on load
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  const searchParam = urlParams.get("q") || urlParams.get("search");

  if (catParam) {
    const matched = categories.find(c => c.toLowerCase() === catParam.toLowerCase());
    if (matched) activeCategory = matched;
  }

  if (searchParam) {
    searchQuery = searchParam;
    if (searchInput) searchInput.value = searchQuery;
  }

  // Render category buttons list
  function renderCategoryTabs() {
    if (!tabContainer) return;
    tabContainer.innerHTML = "";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoosh-cat-btn" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function() {
        document.querySelectorAll(".zoosh-cat-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        activeCategory = cat;
        
        // Sync URL query param
        const params = new URLSearchParams(window.location.search);
        if (cat === "All") {
          params.delete("category");
        } else {
          params.set("category", cat);
        }
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

        renderProducts();
      });
      tabContainer.appendChild(btn);
    });
  }

  // Filter and Render products
  function renderProducts() {
    if (!productGrid || !noResultsPanel) return;

    // Filter list
    const filtered = catalog.filter(p => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = "";

    if (filtered.length > 0) {
      productGrid.style.display = "grid";
      noResultsPanel.classList.remove("active");

      filtered.forEach(p => {
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

        productGrid.appendChild(card);
      });
    } else {
      productGrid.style.display = "none";
      noResultsPanel.classList.add("active");
    }
  }

  // Bind search input listeners
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      searchQuery = this.value;
      
      // Sync URL query param
      const params = new URLSearchParams(window.location.search);
      if (searchQuery === "") {
        params.delete("q");
      } else {
        params.set("q", searchQuery);
      }
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

      renderProducts();
    });
  }

  // Bind reset button triggers
  if (resetBtn) {
    resetBtn.addEventListener("click", function() {
      activeCategory = "All";
      searchQuery = "";
      if (searchInput) searchInput.value = "";
      
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      
      renderCategoryTabs();
      renderProducts();
    });
  }

  // Init catalog views
  renderCategoryTabs();
  renderProducts();


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

    // Create WhatsApp prefilled links
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

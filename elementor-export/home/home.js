document.addEventListener("DOMContentLoaded", function() {
  
  // =====================================================
  // 1. HERO SLIDESHOW LOGIC
  // =====================================================
  const heroSection = document.getElementById("zooshHeroSection");
  const slides = document.querySelectorAll(".zoosh-slide");
  const prevBtn = document.getElementById("zooshHeroPrev");
  const nextBtn = document.getElementById("zooshHeroNext");
  const dotsContainer = document.getElementById("zooshHeroDots");
  
  let currentSlide = 0;
  let slideInterval = null;
  let isHovered = false;

  // Build dots indicators
  if (dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "zoosh-slider-dot" + (idx === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
      dot.addEventListener("click", function(e) {
        e.stopPropagation();
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll(".zoosh-slider-dot");

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active");
    if (dots.length > currentSlide) dots[currentSlide].classList.remove("active");
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add("active");
    if (dots.length > currentSlide) dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(function() {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      nextSlide();
    });
  }

  if (heroSection) {
    heroSection.addEventListener("mouseenter", function() {
      isHovered = true;
    });
    heroSection.addEventListener("mouseleave", function() {
      isHovered = false;
    });
  }

  startAutoplay();


  // =====================================================
  // 2. PRODUCT TAB FILTERING LOGIC
  // =====================================================
  const tabContainer = document.getElementById("zooshHomeTabs");
  const productGrid = document.getElementById("zooshHomeProductGrid");
  
  // Fallback if products database isn't loaded globally
  const catalog = window.ZOOSH_PRODUCTS || [];
  
  // Extract categories dynamically
  const categories = ["All"];
  catalog.forEach(p => {
    if (p.category && !categories.includes(p.category)) {
      categories.push(p.category);
    }
  });

  // Render tab buttons
  let activeTab = "All";
  
  if (tabContainer) {
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoosh-tab-btn" + (cat === "All" ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function() {
        document.querySelectorAll(".zoosh-tab-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        activeTab = cat;
        renderProducts();
      });
      tabContainer.appendChild(btn);
    });
  }

  // Render product cards
  function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    const filtered = catalog.filter(p => {
      return activeTab === "All" || p.category === activeTab;
    }).slice(0, 8); // Capped at 8 featured items on homepage

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
  }

  renderProducts();


  // =====================================================
  // 3. QUICK VIEW OVERLAY MODAL LOGIC
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
    
    // Generate thumbnails list
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
        <!-- Left: Image Gallery -->
        <div class="zoosh-modal-gallery">
          <div class="zoosh-modal-main-img-wrapper">
            <img src="${primaryImage}" alt="${product.name}" class="zoosh-modal-main-img" id="zooshModalMainImg" />
          </div>
          <div class="zoosh-modal-thumbs">
            ${thumbsHtml}
          </div>
        </div>

        <!-- Right: Detail Panel -->
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

    // Bind thumbnails triggers
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

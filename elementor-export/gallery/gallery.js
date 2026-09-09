document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Gallery Items Database
  const galleryItems = [
    {
      id: 1,
      title: "Arc Lounge Composition",
      category: "Chairs",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200",
      description: "An editorial display of the Arc Lounge Chair nestled in a minimal light-flooded concrete interior.",
      slug: "arc-lounge-chair"
    },
    {
      id: 2,
      title: "Sculptural Bouclé Armchair",
      category: "Chairs",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200",
      description: "Capturing the organic contours and woven loops of our signature cream bouclé upholstery.",
      slug: "sculptural-boucle-armchair"
    },
    {
      id: 3,
      title: "Linear Dining Arrangement",
      category: "Dining Table",
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1200",
      description: "The Linear Oak Dining Table paired with minimalist concrete benches under muted gallery lighting.",
      slug: "linear-oak-dining-table"
    },
    {
      id: 4,
      title: "Plinth Bedroom Aesthetics",
      category: "Bedroom",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
      description: "Low-profile ebonized bed frame and integrated floating nightstand showcase minimalist sleeping solutions.",
      slug: "plinth-oak-bed-frame"
    },
    {
      id: 5,
      title: "Travertine Raw Texture",
      category: "Details",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
      description: "Close-up detailing highlighting the porous cavities and honed surface of Italian Travertine stone.",
      slug: "travertine-bench"
    },
    {
      id: 6,
      title: "Monolith Media Concept",
      category: "Details",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
      description: "The vertical fluting of the Monolith Credenza paired with neutral travertine ceramics.",
      slug: "monolith-credenza"
    },
    {
      id: 7,
      title: "Nouveau L-Shape Setup",
      category: "Sofa",
      image: "/images/WhatsApp Image 2026-01-28 at 10.24.23 (1).jpeg",
      description: "A wide modular layout of the Nouveau Sofa in raw Italian linen, styled with organic wool throws.",
      slug: "nouveau-modular-sofa"
    },
    {
      id: 8,
      title: "Linear Wood Joints",
      category: "Details",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
      description: "Showcasing structural mortise & tenon joints, engineered for generations of heavy use.",
      slug: "linear-oak-dining-table"
    },
    {
      id: 9,
      title: "Cohesive Bedside Lighting",
      category: "Bedroom",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200",
      description: "Integrated oak shelves with warm recessed LED elements for a serene evening ambience.",
      slug: "plinth-oak-bed-frame"
    }
  ];

  const categories = ["All", "Sofa", "Dining Table", "Chairs", "Bedroom", "Details"];

  const filterContainer = document.getElementById("zooshGalleryFilters");
  const masonryGrid = document.getElementById("zooshGalleryGrid");
  
  let activeCategory = "All";
  let activeIndex = null; // Track lightbox index

  // Read URL query parameter "?category=Chairs"
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  if (catParam) {
    const matched = categories.find(c => c.toLowerCase() === catParam.toLowerCase());
    if (matched) activeCategory = matched;
  }

  // Generate category filters bar
  if (filterContainer) {
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoosh-gtab-btn" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function() {
        document.querySelectorAll(".zoosh-gtab-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        activeCategory = cat;
        renderGallery();
      });
      filterContainer.appendChild(btn);
    });
  }

  // Get active filtered items
  function getFilteredItems() {
    return galleryItems.filter(item => activeCategory === "All" || item.category === activeCategory);
  }

  // Render gallery list
  function renderGallery() {
    if (!masonryGrid) return;
    masonryGrid.innerHTML = "";

    const items = getFilteredItems();

    items.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "zoosh-gallery-item";
      
      card.innerHTML = `
        <div class="zoosh-gitem-img-wrapper">
          <img src="${item.image}" alt="${item.title}" class="zoosh-gitem-img" />
          <div class="zoosh-gitem-overlay">
            <span class="zoosh-gitem-category">${item.category}</span>
            <h3 class="zoosh-gitem-title">${item.title}</h3>
          </div>
          <div class="zoosh-gitem-zoom-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>
        </div>
      `;

      card.addEventListener("click", function(e) {
        openLightbox(idx);
      });

      masonryGrid.appendChild(card);
    });
  }

  renderGallery();


  // =====================================================
  // LIGHTBOX ACTIONS
  // =====================================================
  const lightbox = document.getElementById("zooshLightbox");
  const lboxImg = document.getElementById("zooshLightboxImg");
  const lboxCat = document.getElementById("zooshLightboxCategory");
  const lboxIdx = document.getElementById("zooshLightboxIndex");
  const lboxTitle = document.getElementById("zooshLightboxTitle");
  const lboxDesc = document.getElementById("zooshLightboxDesc");
  const lboxLink = document.getElementById("zooshLightboxLink");

  const lboxClose = document.getElementById("zooshLightboxClose");
  const lboxBackdrop = document.getElementById("zooshLightboxBackdrop");
  const lboxPrev = document.getElementById("zooshLightboxPrev");
  const lboxNext = document.getElementById("zooshLightboxNext");

  function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    if (lightbox) lightbox.classList.add("active");
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove("active");
    activeIndex = null;
  }

  function updateLightbox() {
    const items = getFilteredItems();
    if (activeIndex === null || !items[activeIndex]) return;

    const item = items[activeIndex];

    if (lboxImg) lboxImg.src = item.image;
    if (lboxCat) lboxCat.textContent = item.category;
    if (lboxIdx) lboxIdx.textContent = (activeIndex + 1) + " / " + items.length;
    if (lboxTitle) lboxTitle.textContent = item.title;
    if (lboxDesc) lboxDesc.textContent = item.description;
    if (lboxLink) lboxLink.href = "/products/" + item.slug + "/";
  }

  function navigateNext() {
    const items = getFilteredItems();
    if (activeIndex === null || items.length === 0) return;
    activeIndex = (activeIndex + 1) % items.length;
    updateLightbox();
  }

  function navigatePrev() {
    const items = getFilteredItems();
    if (activeIndex === null || items.length === 0) return;
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    updateLightbox();
  }

  if (lboxClose) lboxClose.addEventListener("click", closeLightbox);
  if (lboxBackdrop) lboxBackdrop.addEventListener("click", closeLightbox);
  if (lboxNext) lboxNext.addEventListener("click", navigateNext);
  if (lboxPrev) lboxPrev.addEventListener("click", navigatePrev);

  // Keyboard events
  document.addEventListener("keydown", function(e) {
    if (activeIndex === null) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") navigateNext();
    if (e.key === "ArrowLeft") navigatePrev();
  });

});

document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Resolve WhatsApp URL Targets dynamically from Global JS helpers
  const customLink = window.getGeneralWhatsAppLink ? window.getGeneralWhatsAppLink("custom") : "#";
  const generalLink = window.getGeneralWhatsAppLink ? window.getGeneralWhatsAppLink("general") : "#";
  
  const headerWhatsapp = document.getElementById("zooshHeaderWhatsapp");
  if (headerWhatsapp) headerWhatsapp.setAttribute("href", customLink);
  
  const drawerWhatsapp = document.getElementById("zooshDrawerWhatsapp");
  if (drawerWhatsapp) drawerWhatsapp.setAttribute("href", generalLink);

  // 2. Search Panel Toggles
  const searchBtn = document.getElementById("zooshSearchBtn");
  const searchClose = document.getElementById("zooshSearchClose");
  const searchPanel = document.getElementById("zooshSearchPanel");
  const searchInput = document.getElementById("zooshSearchInput");

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      searchPanel.classList.toggle("active");
      if (searchPanel.classList.contains("active") && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchClose && searchPanel) {
    searchClose.addEventListener("click", function() {
      searchPanel.classList.remove("active");
    });
  }

  // Close search panel on clicking outside
  document.addEventListener("click", function(e) {
    if (searchPanel && !searchPanel.contains(e.target) && e.target !== searchBtn) {
      searchPanel.classList.remove("active");
    }
  });

  // 3. Mobile Menu Drawer Toggles
  const mobileToggle = document.getElementById("zooshMobileToggle");
  const mobileDrawer = document.getElementById("zooshMobileDrawer");
  const drawerClose = document.getElementById("zooshDrawerClose");
  const drawerBackdrop = document.getElementById("zooshDrawerBackdrop");

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("active");
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("active");
  }

  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  // 4. Desktop Mega-Menu Hover Mechanism
  const rooms = [
    {
      name: "Living Room Furniture",
      slug: "living",
      image: "/images/catalog/page_14_img_00.webp",
      subcategories: [
        { name: "Sofas", slug: "sofas" },
        { name: "Lounge Chairs", slug: "lounge-chairs" },
        { name: "Arm Chairs", slug: "arm-chairs" },
        { name: "Centre Tables", slug: "centre-tables" },
        { name: "Side Tables", slug: "side-tables" },
        { name: "Console Tables", slug: "console-tables" }
      ]
    },
    {
      name: "Dining Space Furniture",
      slug: "dining",
      image: "/images/catalog/page_21_img_00.webp",
      subcategories: [
        { name: "Dining Tables", slug: "dining-tables" },
        { name: "Dining Chairs", slug: "dining-chairs" },
        { name: "Dining Benches", slug: "dining-benches" },
        { name: "Bar Stools", slug: "bar-stools" }
      ]
    },
    {
      name: "Bedroom Retreat Furniture",
      slug: "bedroom",
      image: "/images/catalog/page_22_img_00.webp",
      subcategories: [
        { name: "Bed Cots", slug: "bed-cots" },
        { name: "Bedside Tables", slug: "bedside-tables" },
        { name: "Bedroom Chairs", slug: "bedroom-chairs" },
        { name: "Benches", slug: "benches" }
      ]
    },
    {
      name: "Entryway & Mirror Units",
      slug: "entryway",
      image: "/images/catalog/page_27_img_00.webp",
      subcategories: [
        { name: "Console Tables", slug: "console-tables" },
        { name: "Mirror Units", slug: "mirror-units" },
        { name: "Benches", slug: "benches" }
      ]
    }
  ];

  const categoryItems = document.querySelectorAll(".zoosh-category-item");
  const megaMenu = document.getElementById("zooshMegaMenu");
  const megaMenuCols = document.getElementById("zooshMegaMenuCols");
  const megaCardImg = document.getElementById("zooshMegaCardImg");
  const megaCardTitle = document.getElementById("zooshMegaCardTitle");
  const megaCardLink = document.getElementById("zooshMegaCardLink");
  
  let hoverTimeout = null;

  function showMegaMenu(roomSlug) {
    const room = rooms.find(r => r.slug === roomSlug);
    if (!room || !megaMenu || !megaMenuCols) return;

    // Clear previous columns
    megaMenuCols.innerHTML = "";

    // Build subcategory column links
    const groupCol = document.createElement("div");
    groupCol.innerHTML = `<span class="zoosh-mega-menu-col-title">Shop by Category</span>`;
    
    const list = document.createElement("ul");
    list.className = "zoosh-mega-submenu-list";

    room.subcategories.forEach(sub => {
      const item = document.createElement("li");
      item.innerHTML = `<a href="/${room.slug}/${sub.slug}/" class="zoosh-mega-submenu-link">${sub.name}</a>`;
      list.appendChild(item);
    });

    groupCol.appendChild(list);
    megaMenuCols.appendChild(groupCol);

    // Update cover card details
    if (megaCardImg) megaCardImg.src = room.image;
    if (megaCardTitle) megaCardTitle.textContent = room.name;
    if (megaCardLink) megaCardLink.href = `/${room.slug}/`;

    megaMenu.classList.add("active");
  }

  function hideMegaMenu() {
    if (megaMenu) megaMenu.classList.remove("active");
  }

  categoryItems.forEach(item => {
    item.addEventListener("mouseenter", function() {
      clearTimeout(hoverTimeout);
      const roomSlug = this.getAttribute("data-room");
      showMegaMenu(roomSlug);
    });
  });

  // Keep menu open when hovering inside the mega menu panel itself
  if (megaMenu) {
    megaMenu.addEventListener("mouseenter", function() {
      clearTimeout(hoverTimeout);
    });
    
    megaMenu.addEventListener("mouseleave", function() {
      hoverTimeout = setTimeout(hideMegaMenu, 300);
    });
  }

  // Hide menu when leaving individual category header elements
  const categoryNav = document.querySelector(".zoosh-header-row-2");
  if (categoryNav) {
    categoryNav.addEventListener("mouseleave", function() {
      hoverTimeout = setTimeout(hideMegaMenu, 300);
    });
  }

});

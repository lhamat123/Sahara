// ===== SAHARA — MAIN APP =====

(function () {
  let currentCat = 'all';
  let currentSort = 'default';
  let searchQuery = '';

  // DOM refs
  const catList    = document.getElementById('catList');
  const sidebarCats= document.getElementById('sidebarCats');
  const footerCats = document.getElementById('footerCats');
  const deptsGrid  = document.getElementById('deptsGrid');
  const productsGrid = document.getElementById('productsGrid');
  const productsTitle = document.getElementById('productsTitle');
  const emptyState = document.getElementById('emptyState');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('searchInput');

  // Modal
  const modal      = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg   = document.getElementById('modalImg');
  const modalCat   = document.getElementById('modalCat');
  const modalName  = document.getElementById('modalName');
  const modalDesc  = document.getElementById('modalDesc');
  const modalTags  = document.getElementById('modalTags');

  // Sidebar
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const sidebar       = document.getElementById('sidebar');
  const sidebarClose  = document.getElementById('sidebarClose');
  const overlay       = document.getElementById('overlay');

  // ===== INIT =====
  function init() {
    renderCatNav();
    renderDepts();
    renderProducts();
    bindEvents();
  }

  // ===== RENDER CATEGORY NAV =====
  function renderCatNav() {
    const cats = SaharaDB.getCategories();

    // Desktop nav
    catList.innerHTML = `<li><a href="#" class="cat-all ${currentCat==='all'?'active':''}" data-cat="all"><i class="fas fa-th-large"></i>Todo</a></li>`;
    cats.forEach(cat => {
      catList.innerHTML += `<li><a href="#" data-cat="${cat.id}" class="${currentCat===cat.id?'active':''}"><i class="${cat.icon}"></i>${cat.name}</a></li>`;
    });

    // Sidebar
    sidebarCats.innerHTML = `<li><a href="#" data-cat="all"><i class="fas fa-th-large"></i>Todos los Productos</a></li>`;
    cats.forEach(cat => {
      sidebarCats.innerHTML += `<li><a href="#" data-cat="${cat.id}"><i class="${cat.icon}"></i>${cat.name}</a></li>`;
    });

    // Footer
    footerCats.innerHTML = '';
    cats.forEach(cat => {
      footerCats.innerHTML += `<li><a href="#" data-cat="${cat.id}">${cat.name}</a></li>`;
    });

    // Add click handlers for category links
    document.querySelectorAll('[data-cat]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const cat = e.currentTarget.dataset.cat;
        filterByCat(cat);
        closeSidebar();
        document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ===== RENDER DEPARTMENTS GRID =====
  function renderDepts() {
    const cats = SaharaDB.getCategories();
    const products = SaharaDB.getProducts();
    deptsGrid.innerHTML = '';
    cats.forEach(cat => {
      const count = products.filter(p => p.catId === cat.id).length;
      deptsGrid.innerHTML += `
        <div class="dept-card" data-cat="${cat.id}">
          <div class="dept-icon"><i class="${cat.icon}"></i></div>
          <div class="dept-name">${cat.name}</div>
          <div class="dept-count">${count} producto${count !== 1 ? 's' : ''}</div>
        </div>`;
    });
    deptsGrid.querySelectorAll('.dept-card').forEach(card => {
      card.addEventListener('click', () => {
        filterByCat(card.dataset.cat);
        document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ===== FILTER BY CATEGORY =====
  function filterByCat(catId) {
    currentCat = catId;
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    updateCatActive();
    renderProducts();
    updateTitle();
  }

  function updateCatActive() {
    document.querySelectorAll('[data-cat]').forEach(link => {
      link.classList.toggle('active', link.dataset.cat === currentCat);
    });
  }

  function updateTitle() {
    if (currentCat === 'all') {
      productsTitle.textContent = 'Todos los Productos';
    } else {
      const cat = SaharaDB.getCategories().find(c => c.id === currentCat);
      productsTitle.textContent = cat ? cat.name : 'Productos';
    }
  }

  // ===== RENDER PRODUCTS =====
  function renderProducts() {
    const cats = SaharaDB.getCategories();
    let products = SaharaDB.getProducts();

    // Filter by category
    if (currentCat !== 'all') {
      products = products.filter(p => p.catId === currentCat);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (currentSort === 'name-asc') products.sort((a, b) => a.name.localeCompare(b.name));
    else if (currentSort === 'name-desc') products.sort((a, b) => b.name.localeCompare(a.name));
    else if (currentSort === 'newest') products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    productsGrid.innerHTML = '';
    if (products.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    products.forEach((product, idx) => {
      const cat = cats.find(c => c.id === product.catId);
      const catName = cat ? cat.name : '';
      const tagsHtml = (product.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
      const badgeHtml = product.badge === 'new' ? `<span class="card-badge new">Nuevo</span>` : '';

      const imgHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" loading="lazy"/>`
        : `<div class="card-placeholder"><i class="fas fa-image"></i><span>Sin imagen</span></div>`;

      productsGrid.innerHTML += `
        <div class="product-card" data-id="${product.id}" style="animation-delay:${idx * 0.05}s">
          <div class="card-img-wrap">
            ${imgHtml}
            ${badgeHtml}
          </div>
          <div class="card-body">
            <div class="card-cat">${catName}</div>
            <div class="card-name">${product.name}</div>
            <div class="card-desc">${product.desc}</div>
          </div>
          <div class="card-footer">
            <div class="card-tags">${tagsHtml}</div>
            <i class="fas fa-arrow-right card-arrow"></i>
          </div>
        </div>`;
    });

    // Bind card click → modal
    productsGrid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }

  // ===== MODAL =====
  function openModal(productId) {
    const product = SaharaDB.getProducts().find(p => p.id === productId);
    if (!product) return;
    const cat = SaharaDB.getCategories().find(c => c.id === product.catId);

    modalCat.textContent = cat ? cat.name : '';
    modalName.textContent = product.name;
    modalDesc.textContent = product.desc;
    modalTags.innerHTML = (product.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    if (product.image) {
      modalImg.src = product.image;
      modalImg.style.display = 'block';
    } else {
      modalImg.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== SIDEBAR =====
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ===== EVENTS =====
  function bindEvents() {
    hamburgerBtn.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', () => { closeSidebar(); closeModal(); });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    sortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      renderProducts();
    });

    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      currentCat = 'all';
      updateCatActive();
      updateTitle();
      renderProducts();
    });

    // Keyboard ESC to close modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeModal(); closeSidebar(); }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      header.style.boxShadow = window.scrollY > 10 ? '0 4px 32px rgba(0,0,0,0.4)' : '';
    });
  }

  // ===== Listen for updates from admin panel =====
  window.addEventListener('storage', () => {
    renderCatNav();
    renderDepts();
    renderProducts();
  });

  init();
})();

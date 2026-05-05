// ===== SAHARA — ADMIN PANEL JS =====
(function () {

  // ===== NAVIGATION =====
  const navItems = document.querySelectorAll('.admin-nav-item');
  const sections = document.querySelectorAll('.admin-section');
  const topbarTitle = document.getElementById('topbarTitle');

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const sec = item.dataset.section;
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + sec).classList.add('active');
      topbarTitle.textContent = item.querySelector('span').textContent;
      if (sec === 'dashboard') renderDashboard();
      if (sec === 'categories') renderCatsTable();
      if (sec === 'products') renderProductsTable();
    });
  });

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const adminSidebar = document.getElementById('adminSidebar');
  sidebarToggle.addEventListener('click', () => adminSidebar.classList.toggle('open'));

  // ===== TOAST =====
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ===== CONFIRM DIALOG =====
  const confirmModal = document.getElementById('confirmModal');
  let confirmCallback = null;
  function showConfirm(title, msg, cb) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    confirmCallback = cb;
    confirmModal.classList.add('open');
  }
  document.getElementById('confirmCancel').addEventListener('click', () => confirmModal.classList.remove('open'));
  document.getElementById('confirmOk').addEventListener('click', () => {
    confirmModal.classList.remove('open');
    if (confirmCallback) confirmCallback();
  });

  // ===== DASHBOARD =====
  function renderDashboard() {
    const cats = SaharaDB.getCategories();
    const products = SaharaDB.getProducts();
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-box"></i></div>
        <div><div class="stat-label">Total Productos</div><div class="stat-value">${products.length}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-layer-group"></i></div>
        <div><div class="stat-label">Categorías</div><div class="stat-value">${cats.length}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div><div class="stat-label">Productos Nuevos</div><div class="stat-value">${products.filter(p=>p.badge==='new').length}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-image"></i></div>
        <div><div class="stat-label">Con Imagen</div><div class="stat-value">${products.filter(p=>p.image).length}</div></div>
      </div>`;

    // Recent products
    const recProds = document.getElementById('recentProducts');
    const sorted = [...products].sort((a, b) => (b.createdAt||0) - (a.createdAt||0)).slice(0, 5);
    recProds.innerHTML = sorted.map(p => {
      const cat = cats.find(c => c.id === p.catId);
      return `<div class="recent-item">
        <div class="recent-item-icon"><i class="${cat ? cat.icon : 'fas fa-box'}"></i></div>
        <div><div class="recent-item-name">${p.name}</div><div class="recent-item-sub">${cat ? cat.name : '—'}</div></div>
      </div>`;
    }).join('');

    // Recent categories
    const recCats = document.getElementById('recentCats');
    recCats.innerHTML = cats.map(c => {
      const count = products.filter(p => p.catId === c.id).length;
      return `<div class="recent-item">
        <div class="recent-item-icon"><i class="${c.icon}"></i></div>
        <div><div class="recent-item-name">${c.name}</div><div class="recent-item-sub">${count} producto${count!==1?'s':''}</div></div>
      </div>`;
    }).join('');
  }

  // ===== CATEGORIES =====
  function renderCatsTable() {
    const cats = SaharaDB.getCategories();
    const products = SaharaDB.getProducts();
    const tbody = document.getElementById('catsBody');
    tbody.innerHTML = '';
    cats.forEach(cat => {
      const count = products.filter(p => p.catId === cat.id).length;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div class="tbl-icon"><i class="${cat.icon}"></i></div></td>
        <td><div class="tbl-name">${cat.name}</div></td>
        <td><span class="tag-mini">${cat.id}</span></td>
        <td><span class="tbl-badge">${count} producto${count!==1?'s':''}</span></td>
        <td><div class="action-btns">
          <button class="btn-edit" data-edit-cat="${cat.id}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-delete" data-del-cat="${cat.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-edit-cat]').forEach(btn => {
      btn.addEventListener('click', () => openCatModal(btn.dataset.editCat));
    });
    tbody.querySelectorAll('[data-del-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = SaharaDB.getCategories().find(c => c.id === btn.dataset.delCat);
        showConfirm('Eliminar categoría', `¿Eliminar "${cat.name}" y todos sus productos?`, () => {
          SaharaDB.deleteCategory(btn.dataset.delCat);
          renderCatsTable();
          showToast('Categoría eliminada', 'error');
        });
      });
    });
  }

  // ===== CATEGORY MODAL =====
  const catModal = document.getElementById('catModal');
  let editCatId = null;

  document.getElementById('btnAddCat').addEventListener('click', () => openCatModal(null));
  document.getElementById('catModalClose').addEventListener('click', closeCatModal);
  document.getElementById('catModalCancel').addEventListener('click', closeCatModal);

  function openCatModal(id) {
    editCatId = id;
    const isEdit = !!id;
    document.getElementById('catModalTitle').textContent = isEdit ? 'Editar Categoría' : 'Nueva Categoría';

    if (isEdit) {
      const cat = SaharaDB.getCategories().find(c => c.id === id);
      document.getElementById('catName').value = cat.name;
      document.getElementById('catId').value = cat.id;
      document.getElementById('catId').readOnly = true;
      document.getElementById('catIcon').value = cat.icon;
      updateIconPreview(cat.icon);
    } else {
      document.getElementById('catName').value = '';
      document.getElementById('catId').value = '';
      document.getElementById('catId').readOnly = false;
      document.getElementById('catIcon').value = '';
      updateIconPreview('fas fa-star');
    }
    catModal.classList.add('open');
  }

  function closeCatModal() { catModal.classList.remove('open'); }

  // Auto-generate slug from name
  document.getElementById('catName').addEventListener('input', e => {
    if (!editCatId) {
      const slug = e.target.value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      document.getElementById('catId').value = slug;
    }
  });

  // Icon preview
  document.getElementById('catIcon').addEventListener('input', e => updateIconPreview(e.target.value));
  document.querySelectorAll('.icon-suggestions span').forEach(span => {
    span.addEventListener('click', () => {
      const ic = span.dataset.icon;
      document.getElementById('catIcon').value = ic;
      updateIconPreview(ic);
    });
  });

  function updateIconPreview(iconClass) {
    const prev = document.getElementById('iconPreview');
    prev.className = iconClass || 'fas fa-star';
  }

  document.getElementById('catModalSave').addEventListener('click', () => {
    const name = document.getElementById('catName').value.trim();
    const id   = document.getElementById('catId').value.trim();
    const icon = document.getElementById('catIcon').value.trim();
    if (!name || !id || !icon) { showToast('Completa todos los campos', 'error'); return; }

    if (editCatId) {
      SaharaDB.updateCategory(editCatId, { name, icon });
      showToast('Categoría actualizada ✓');
    } else {
      const existing = SaharaDB.getCategories().find(c => c.id === id);
      if (existing) { showToast('El ID ya existe', 'error'); return; }
      SaharaDB.addCategory({ id, name, icon, color: '#C9A96E' });
      showToast('Categoría creada ✓');
    }
    closeCatModal();
    renderCatsTable();
    renderDashboard();
  });

  // ===== PRODUCTS TABLE =====
  let prodSearch = '';
  let prodCatFilter = 'all';

  function renderProductsTable() {
    const cats = SaharaDB.getCategories();
    let products = SaharaDB.getProducts();

    // Populate cat filter
    const catFilter = document.getElementById('adminCatFilter');
    catFilter.innerHTML = '<option value="all">Todas las categorías</option>';
    cats.forEach(c => {
      catFilter.innerHTML += `<option value="${c.id}" ${prodCatFilter===c.id?'selected':''}>${c.name}</option>`;
    });

    if (prodCatFilter !== 'all') products = products.filter(p => p.catId === prodCatFilter);
    if (prodSearch) {
      const q = prodSearch.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }

    const tbody = document.getElementById('productsBody');
    tbody.innerHTML = '';
    products.forEach(product => {
      const cat = cats.find(c => c.id === product.catId);
      const tagsHtml = (product.tags||[]).map(t => `<span class="tag-mini">${t}</span>`).join('');
      const imgHtml = product.image
        ? `<div class="tbl-img"><img src="${product.image}" alt=""/></div>`
        : `<div class="tbl-img-placeholder"><i class="fas fa-image"></i></div>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${imgHtml}</td>
        <td>
          <div class="tbl-name">${product.name}</div>
          <div class="tbl-sub">${product.desc.substring(0, 60)}…</div>
        </td>
        <td><span class="tbl-badge">${cat ? cat.name : '—'}</span></td>
        <td>${tagsHtml}</td>
        <td><div class="action-btns">
          <button class="btn-edit" data-edit-prod="${product.id}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-delete" data-del-prod="${product.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-edit-prod]').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.editProd));
    });
    tbody.querySelectorAll('[data-del-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = SaharaDB.getProducts().find(x => x.id === btn.dataset.delProd);
        showConfirm('Eliminar producto', `¿Eliminar "${p.name}"?`, () => {
          SaharaDB.deleteProduct(btn.dataset.delProd);
          renderProductsTable();
          renderDashboard();
          showToast('Producto eliminado', 'error');
        });
      });
    });
  }

  document.getElementById('adminSearch').addEventListener('input', e => {
    prodSearch = e.target.value;
    renderProductsTable();
  });
  document.getElementById('adminCatFilter').addEventListener('change', e => {
    prodCatFilter = e.target.value;
    renderProductsTable();
  });

  // ===== PRODUCT MODAL =====
  const productModal = document.getElementById('productModal');
  let editProdId = null;
  let currentImageData = '';

  document.getElementById('btnAddProduct').addEventListener('click', () => openProductModal(null));
  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModalCancel').addEventListener('click', closeProductModal);

  function openProductModal(id) {
    editProdId = id;
    const isEdit = !!id;
    document.getElementById('productModalTitle').textContent = isEdit ? 'Editar Producto' : 'Nuevo Producto';
    currentImageData = '';

    // Populate categories
    const catSel = document.getElementById('prodCat');
    catSel.innerHTML = '<option value="">Seleccionar categoría...</option>';
    SaharaDB.getCategories().forEach(c => {
      catSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    if (isEdit) {
      const p = SaharaDB.getProducts().find(x => x.id === id);
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodDesc').value = p.desc;
      document.getElementById('prodTags').value = (p.tags||[]).join(', ');
      document.getElementById('prodBadge').value = p.badge || '';
      document.getElementById('prodCat').value = p.catId;
      document.getElementById('prodImageUrl').value = p.image || '';
      currentImageData = p.image || '';
      setImagePreview(p.image || '');
    } else {
      document.getElementById('prodName').value = '';
      document.getElementById('prodDesc').value = '';
      document.getElementById('prodTags').value = '';
      document.getElementById('prodBadge').value = '';
      document.getElementById('prodCat').value = '';
      document.getElementById('prodImageUrl').value = '';
      setImagePreview('');
    }
    productModal.classList.add('open');
  }

  function closeProductModal() { productModal.classList.remove('open'); }

  function setImagePreview(src) {
    const preview = document.getElementById('imgPreview');
    const placeholder = document.getElementById('imgPlaceholder');
    const removeBtn = document.getElementById('imgRemoveBtn');
    if (src) {
      preview.src = src;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      removeBtn.style.display = 'flex';
    } else {
      preview.style.display = 'none';
      preview.src = '';
      placeholder.style.display = 'flex';
      removeBtn.style.display = 'none';
    }
  }

  // Drag & drop / click upload
  const imgUploadArea = document.getElementById('imgUploadArea');
  const imgFileInput  = document.getElementById('imgFileInput');

  imgUploadArea.addEventListener('click', () => imgFileInput.click());
  imgUploadArea.addEventListener('dragover', e => { e.preventDefault(); imgUploadArea.style.borderColor = 'var(--adm-accent)'; });
  imgUploadArea.addEventListener('dragleave', () => { imgUploadArea.style.borderColor = ''; });
  imgUploadArea.addEventListener('drop', e => {
    e.preventDefault();
    imgUploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  });
  imgFileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleImageFile(e.target.files[0]);
  });

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) { showToast('Solo imágenes permitidas', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('Imagen demasiado grande (máx 2MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      currentImageData = e.target.result;
      document.getElementById('prodImageUrl').value = '';
      setImagePreview(currentImageData);
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('imgRemoveBtn').addEventListener('click', e => {
    e.stopPropagation();
    currentImageData = '';
    document.getElementById('prodImageUrl').value = '';
    setImagePreview('');
    imgFileInput.value = '';
  });

  document.getElementById('prodImageUrl').addEventListener('input', e => {
    const url = e.target.value.trim();
    if (url) { currentImageData = url; setImagePreview(url); }
    else { currentImageData = ''; setImagePreview(''); }
  });

  document.getElementById('productModalSave').addEventListener('click', () => {
    const name  = document.getElementById('prodName').value.trim();
    const catId = document.getElementById('prodCat').value;
    const desc  = document.getElementById('prodDesc').value.trim();
    const tagsRaw = document.getElementById('prodTags').value;
    const badge = document.getElementById('prodBadge').value;
    const imageUrl = document.getElementById('prodImageUrl').value.trim();
    const image = currentImageData || imageUrl || '';

    if (!name || !catId || !desc) { showToast('Nombre, categoría y descripción son obligatorios', 'error'); return; }

    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const productData = { name, catId, desc, tags, badge, image, createdAt: Date.now() };

    if (editProdId) {
      SaharaDB.updateProduct(editProdId, productData);
      showToast('Producto actualizado ✓');
    } else {
      SaharaDB.addProduct({ id: SaharaDB.generateId(), ...productData });
      showToast('Producto creado ✓');
    }
    closeProductModal();
    renderProductsTable();
    renderDashboard();
  });

  // ===== INIT =====
  renderDashboard();

})();

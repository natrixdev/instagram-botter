// Core state and utilities
const STORAGE_KEYS = {
  products: "mp_products",
  favorites: "mp_favorites",
  users: "mp_users"
};

function getFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function setInStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(amount) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
}

function q(sel, root = document) { return root.querySelector(sel); }
function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Dummy data
function seedDummyData() {
  const existing = getFromStorage(STORAGE_KEYS.products, null);
  if (existing) return; // Seed once
  const now = Date.now();
  const users = [
    { id: 1, name: "Zeynep Kaya", city: "İstanbul", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" },
    { id: 2, name: "Mert Demir", city: "Ankara", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=crop" }
  ];
  const images = {
    clothing: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
    ],
    electronics: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
    ],
    accessories: [
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=800&auto=format&fit=crop"
    ],
    books: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop"
    ]
  };
  const categories = ["Giyim", "Elektronik", "Aksesuar", "Kitap"];
  const locations = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];

  const products = [];
  let idCounter = 1000;
  for (let i = 0; i < 12; i++) {
    const category = categories[i % categories.length];
    const imgSet = category === "Giyim" ? images.clothing : category === "Elektronik" ? images.electronics : category === "Aksesuar" ? images.accessories : images.books;
    const basePrice = category === "Elektronik" ? 2500 : category === "Giyim" ? 250 : category === "Aksesuar" ? 180 : 75;
    const price = Math.round(basePrice * (0.7 + Math.random() * 1.6));
    const sellerId = i % 2 === 0 ? 1 : 2;
    const createdAt = now - i * 86400000;
    products.push({
      id: idCounter++,
      title: `${category} Ürün ${i + 1}`,
      price,
      category,
      condition: ["Yeni", "Çok iyi", "İyi"][i % 3],
      location: locations[i % locations.length],
      description: `${category} kategorisinden temiz ikinci el ürün. Hızlı teslimat, sorunsuz.`,
      images: imgSet,
      sellerId,
      createdAt,
      popularity: Math.floor(Math.random() * 1000),
      stock: 1 + (i % 3),
      soldCount: Math.floor(Math.random() * 5)
    });
  }

  setInStorage(STORAGE_KEYS.products, products);
  setInStorage(STORAGE_KEYS.users, users);
  setInStorage(STORAGE_KEYS.favorites, []);
}

function getAllProducts() {
  return getFromStorage(STORAGE_KEYS.products, []);
}

function saveAllProducts(products) {
  setInStorage(STORAGE_KEYS.products, products);
}

function getAllUsers() {
  return getFromStorage(STORAGE_KEYS.users, []);
}

function getCurrentUser() {
  const users = getAllUsers();
  return users[0] || { id: 1, name: "Kullanıcı", city: "İstanbul", avatar: "https://via.placeholder.com/64" };
}

function getFavorites() {
  return getFromStorage(STORAGE_KEYS.favorites, []);
}

function toggleFavorite(productId) {
  const favs = new Set(getFavorites());
  if (favs.has(productId)) favs.delete(productId); else favs.add(productId);
  setInStorage(STORAGE_KEYS.favorites, Array.from(favs));
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

// Rendering helpers
function productCardTemplate(product) {
  const favActive = isFavorite(product.id) ? " active" : "";
  return `
    <div class="product-card" data-id="${product.id}">
      <button class="btn favorite-btn${favActive}" aria-label="Favori">
        ❤
      </button>
      <a href="product.html?id=${product.id}">
        <img class="product-thumb" src="${product.images[0]}" alt="${product.title}">
      </a>
      <div class="product-body">
        <a href="product.html?id=${product.id}"><div class="product-title">${product.title}</div></a>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-desc">${product.location} · ${product.condition}</div>
      </div>
    </div>
  `;
}

function mountFavoritesHandlers(root) {
  qa('.favorite-btn', root).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = e.currentTarget.closest('.product-card');
      const id = Number(card?.dataset.id);
      if (!id) return;
      toggleFavorite(id);
      e.currentTarget.classList.toggle('active');
    });
  });
}

// Navbar search (simple redirect with query)
function initSearch() {
  const form = q('#nav-search-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const qv = q('#nav-search-input')?.value?.trim();
    const url = new URL(window.location.origin + '/category.html');
    if (qv) url.searchParams.set('q', qv);
    window.location.href = url.toString();
  });
}

// Home page
function initHome() {
  const products = getAllProducts();
  const popular = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  const newest = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

  const popularGrid = q('#popular-products');
  const newGrid = q('#new-products');
  if (popularGrid) {
    popularGrid.innerHTML = popular.map(productCardTemplate).join('');
    mountFavoritesHandlers(popularGrid);
  }
  if (newGrid) {
    newGrid.innerHTML = newest.map(productCardTemplate).join('');
    mountFavoritesHandlers(newGrid);
  }
}

// Category page
function applyFilters(baseProducts) {
  const min = Number(q('#filter-min')?.value || 0) || 0;
  const max = Number(q('#filter-max')?.value || Infinity) || Infinity;
  const condition = q('#filter-condition')?.value || '';
  const location = q('#filter-location')?.value || '';
  const text = (q('#filter-text')?.value || '').toLowerCase();

  return baseProducts.filter(p => {
    if (p.price < min || p.price > max) return false;
    if (condition && p.condition !== condition) return false;
    if (location && p.location !== location) return false;
    if (text && !(`${p.title} ${p.description}`.toLowerCase().includes(text))) return false;
    return true;
  });
}

function initCategory() {
  const all = getAllProducts();
  const url = new URL(window.location.href);
  const category = url.searchParams.get('category');
  const qtext = url.searchParams.get('q') || '';
  if (q('#filter-text')) q('#filter-text').value = qtext;

  let base = category ? all.filter(p => p.category === category) : all;
  const grid = q('#category-products');
  const render = () => {
    const data = applyFilters(base);
    grid.innerHTML = data.map(productCardTemplate).join('');
    mountFavoritesHandlers(grid);
  };

  // Category pills
  qa('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      qa('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const c = pill.dataset.category;
      base = c ? all.filter(p => p.category === c) : all;
      render();
      const u = new URL(window.location.href);
      if (c) u.searchParams.set('category', c); else u.searchParams.delete('category');
      history.replaceState(null, '', u.toString());
    });
  });

  // Filters events
  ['filter-min','filter-max','filter-condition','filter-location','filter-text'].forEach(id => {
    const el = q('#' + id);
    if (el) el.addEventListener('input', render);
    if (el && (id === 'filter-condition' || id === 'filter-location')) el.addEventListener('change', render);
  });

  // Initial pill active
  if (category) {
    const active = q(`.pill[data-category="${category}"]`);
    if (active) active.classList.add('active');
  }

  render();
}

// Product page
function initProduct() {
  const id = Number(getQueryParam('id')) || getAllProducts()[0]?.id;
  const product = getAllProducts().find(p => p.id === id);
  if (!product) return;

  q('#p-title').textContent = product.title;
  q('#p-price').textContent = formatPrice(product.price);
  q('#p-desc').textContent = product.description;
  q('#p-meta').textContent = `${product.location} · ${product.condition}`;
  const seller = getAllUsers().find(u => u.id === product.sellerId);
  if (seller) {
    q('#seller-name').textContent = seller.name;
    q('#seller-city').textContent = seller.city;
    const av = q('#seller-avatar'); if (av) av.src = seller.avatar;
  }

  const main = q('#gallery-main');
  const thumbs = q('#gallery-thumbs');
  if (main && thumbs) {
    main.src = product.images[0];
    thumbs.innerHTML = product.images.map((src, i) => `<img src="${src}" alt="${product.title} görsel ${i+1}" class="${i===0?'active':''}">`).join('');
    qa('img', thumbs).forEach((img, i) => {
      img.addEventListener('click', () => {
        qa('img', thumbs).forEach(t => t.classList.remove('active'));
        img.classList.add('active');
        main.src = product.images[i];
      });
    });
  }

  const favBtn = q('#fav-btn');
  if (favBtn) {
    if (isFavorite(product.id)) favBtn.classList.add('active');
    favBtn.addEventListener('click', () => {
      toggleFavorite(product.id);
      favBtn.classList.toggle('active');
    });
  }

  const msgBtn = q('#msg-btn');
  if (msgBtn) {
    msgBtn.addEventListener('click', () => {
      alert('Satıcıya mesaj gönderildi! (Demo)');
    });
  }
}

// Profile page
function initProfile() {
  const user = getCurrentUser();
  q('#profile-name').textContent = user.name;
  q('#profile-city').textContent = user.city;
  const av = q('#profile-avatar'); if (av) av.src = user.avatar;

  const products = getAllProducts();
  const favorites = getFavorites();
  const myPurchases = products.filter((_, i) => i % 5 === 0).slice(0, 6);
  const mySales = products.filter(p => p.sellerId === user.id).slice(0, 6);
  const favProducts = products.filter(p => favorites.includes(p.id));

  const sections = [
    ['#purchases', myPurchases],
    ['#sales', mySales],
    ['#favorites', favProducts]
  ];
  sections.forEach(([sel, list]) => {
    const root = q(sel);
    if (root) {
      root.innerHTML = list.map(productCardTemplate).join('');
      mountFavoritesHandlers(root);
    }
  });

  // Tabs
  qa('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      qa('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      qa('.tab-panel').forEach(p => p.classList.add('hidden'));
      q(target)?.classList.remove('hidden');
    });
  });
}

// Seller dashboard
function initSellerDashboard() {
  const user = getCurrentUser();
  let products = getAllProducts();
  const mine = () => products.filter(p => p.sellerId === user.id);

  function renderList() {
    const grid = q('#seller-products');
    grid.innerHTML = mine().map(p => `
      <div class="product-card" data-id="${p.id}">
        <img class="product-thumb" src="${p.images[0]}" alt="${p.title}">
        <div class="product-body">
          <div class="product-title">${p.title}</div>
          <div class="product-price">${formatPrice(p.price)}</div>
          <div class="product-desc">Stok: ${p.stock} · Satış: ${p.soldCount}</div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="btn btn-outline edit-btn">Düzenle</button>
            <button class="btn btn" data-action="stock-\u2212">Stok -</button>
            <button class="btn btn" data-action="stock+">Stok +</button>
            <button class="btn" style="color: var(--danger); border-color: var(--danger);" data-action="delete">Sil</button>
          </div>
        </div>
      </div>
    `).join('');

    // Handlers
    qa('.edit-btn', grid).forEach(btn => btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.closest('.product-card').dataset.id);
      loadToForm(products.find(p => p.id === id));
    }));
    qa('[data-action]', grid).forEach(btn => btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      const id = Number(card.dataset.id);
      const action = e.currentTarget.getAttribute('data-action');
      if (action === 'delete') {
        if (!confirm('Silinsin mi?')) return;
        products = products.filter(p => p.id !== id);
      } else if (action === 'stock+') {
        products = products.map(p => p.id === id ? { ...p, stock: p.stock + 1 } : p);
      } else if (action === 'stock-−' || action === 'stock-–' || action === 'stock-—' || action === 'stock-−') {
        // visually similar hyphens safety
        products = products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - 1) } : p);
      } else if (action === 'stock-') {
        products = products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - 1) } : p);
      }
      saveAllProducts(products);
      renderList();
    }));
  }

  function clearForm() {
    ['title','price','category','condition','location','images','description','id'].forEach(name => {
      const el = q(`#f-${name}`);
      if (el) el.value = '';
    });
  }

  function loadToForm(p) {
    if (!p) return;
    q('#f-id').value = p.id;
    q('#f-title').value = p.title;
    q('#f-price').value = p.price;
    q('#f-category').value = p.category;
    q('#f-condition').value = p.condition;
    q('#f-location').value = p.location;
    q('#f-images').value = p.images.join(',');
    q('#f-description').value = p.description;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  q('#product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = q('#f-id').value.trim();
    const data = {
      id: idVal ? Number(idVal) : Math.floor(Math.random()*1e9),
      title: q('#f-title').value.trim(),
      price: Number(q('#f-price').value || 0),
      category: q('#f-category').value,
      condition: q('#f-condition').value,
      location: q('#f-location').value,
      images: q('#f-images').value.split(',').map(s => s.trim()).filter(Boolean),
      description: q('#f-description').value.trim(),
      sellerId: user.id,
      createdAt: Date.now(),
      popularity: 0,
      stock: 1,
      soldCount: 0
    };
    if (idVal) {
      products = products.map(p => p.id === data.id ? { ...p, ...data } : p);
    } else {
      products = [data, ...products];
    }
    saveAllProducts(products);
    renderList();
    clearForm();
    alert('Ürün kaydedildi!');
  });

  q('#btn-clear').addEventListener('click', () => clearForm());

  // Stats
  function renderStats() {
    const list = mine();
    const totalProducts = list.length;
    const totalSales = list.reduce((a, p) => a + p.soldCount, 0);
    const totalIncome = list.reduce((a, p) => a + p.soldCount * p.price, 0);
    q('#stat-products').textContent = String(totalProducts);
    q('#stat-sales').textContent = String(totalSales);
    q('#stat-income').textContent = formatPrice(totalIncome);
  }

  const observer = new MutationObserver(() => renderStats());
  observer.observe(q('#seller-products'), { childList: true, subtree: true });

  renderList();
  renderStats();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  seedDummyData();
  initSearch();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'category') initCategory();
  if (page === 'product') initProduct();
  if (page === 'profile') initProfile();
  if (page === 'seller-dashboard') initSellerDashboard();
});


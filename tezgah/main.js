const FAVORITES_KEY = "tezgah:favorites";
const PRODUCTS_KEY = "tezgah:products";
const CART_KEY = "tezgah:cart";
const USER_KEY = "tezgah:user";

const state = { category: "all", query: "", favorites: new Set(), user: null, cart: {} };
const trCurrency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

let products = [
  {id:1,title:"Apple iPhone 12 128GB",price:18999,desc:"Çiziksiz, kutulu, faturalı",img:"https://images.unsplash.com/photo-1605648916361-9f343605f61e?q=80&w=1932&auto=format&fit=crop",category:"Elektronik",isPopular:true,createdAt:"2025-08-12"},
  {id:2,title:"Xiaomi Redmi Note 11",price:6499,desc:"Az kullanılmış, batarya sağlığı iyi",img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1974&auto=format&fit=crop",category:"Elektronik",isPopular:false,createdAt:"2025-09-01"},
  {id:3,title:"Dell XPS 13",price:25999,desc:"13 inç, i7, 16GB RAM",img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070&auto=format&fit=crop",category:"Elektronik",isPopular:true,createdAt:"2025-08-28"},
  {id:4,title:"Ahşap Çalışma Masası",price:3499,desc:"120x60 cm, doğal meşe",img:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",category:"Mobilya",isPopular:true,createdAt:"2025-09-07"},
  {id:5,title:"Ergonomik Ofis Koltuğu",price:2299,desc:"Bel destekli, file kumaş",img:"https://images.unsplash.com/photo-1582582621959-48d0b1f72f83?q=80&w=1974&auto=format&fit=crop",category:"Mobilya",isPopular:false,createdAt:"2025-08-31"},
  {id:6,title:"Nike Koşu Ayakkabısı",price:1399,desc:"42 numara, temiz",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1974&auto=format&fit=crop",category:"Spor",isPopular:true,createdAt:"2025-09-03"},
  {id:7,title:"Klasik Romanlar Seti",price:499,desc:"10 kitap, iyi durumda",img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2067&auto=format&fit=crop",category:"Kitap",isPopular:false,createdAt:"2025-08-26"},
  {id:8,title:"Sony WH-1000XM4 Kulaklık",price:7999,desc:"Gürültü engelleme, sorunsuz",img:"https://images.unsplash.com/photo-1518442072030-744dff31cfc3?q=80&w=2070&auto=format&fit=crop",category:"Elektronik",isPopular:true,createdAt:"2025-09-05"},
  {id:9,title:"IKEA Raf Sistemi",price:899,desc:"Modüler, beyaz",img:"https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1974&auto=format&fit=crop",category:"Mobilya",isPopular:false,createdAt:"2025-08-21"},
  {id:10,title:"Vintage Deri Ceket",price:1799,desc:"M beden, kahverengi",img:"https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2059&auto=format&fit=crop",category:"Moda",isPopular:true,createdAt:"2025-09-06"},
  {id:11,title:"Nintendo Switch",price:10999,desc:"2 kol, 3 oyun hediye",img:"https://images.unsplash.com/photo-1585079542156-2755d9c8affd?q=80&w=1974&auto=format&fit=crop",category:"Oyun",isPopular:true,createdAt:"2025-09-02"},
  {id:12,title:"Philips Airfryer",price:2799,desc:"Kutulu, az kullanılmış",img:"https://images.unsplash.com/photo-1598514982597-139a3d67f9af?q=80&w=1974&auto=format&fit=crop",category:"Ev Aletleri",isPopular:false,createdAt:"2025-08-25"},
  {id:13,title:"Canon EOS M50",price:14999,desc:"18-55mm lens ile",img:"https://images.unsplash.com/photo-1526178611450-1a1b3c79c2d0?q=80&w=1974&auto=format&fit=crop",category:"Elektronik",isPopular:true,createdAt:"2025-08-30"},
  {id:14,title:"Xiaomi Robot Süpürge",price:5899,desc:"Haritalama özellikli",img:"https://images.unsplash.com/photo-1588742848067-dc86c9f1ae1d?q=80&w=1974&auto=format&fit=crop",category:"Ev Aletleri",isPopular:false,createdAt:"2025-09-04"},
  {id:15,title:"Adidas Sweatshirt",price:699,desc:"L beden, siyah",img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1974&auto=format&fit=crop",category:"Moda",isPopular:false,createdAt:"2025-08-29"},
  {id:16,title:"Logitech MX Master 3S",price:2499,desc:"Kablosuz mouse",img:"https://images.unsplash.com/photo-1595044426077-c972f08f90ef?q=80&w=1974&auto=format&fit=crop",category:"Elektronik",isPopular:true,createdAt:"2025-09-08"}
];

function lsGet(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; } }
function lsSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

function loadFavorites(){
  try{
    const raw=localStorage.getItem(FAVORITES_KEY);
    if(!raw){state.favorites=new Set();return}
    const arr=JSON.parse(raw);
    state.favorites=new Set(Array.isArray(arr)?arr:[])
  }catch(e){state.favorites=new Set()}
}
function saveFavorites(){ try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...state.favorites]))}catch(e){} }

function loadProducts() { const stored = lsGet(PRODUCTS_KEY, null); if (stored && Array.isArray(stored) && stored.length) { products = stored; } else { lsSet(PRODUCTS_KEY, products); } }
function saveProducts() { lsSet(PRODUCTS_KEY, products); }

function loadUser() { state.user = lsGet(USER_KEY, null); }
function saveUser() { lsSet(USER_KEY, state.user); }

function loadCart() { state.cart = lsGet(CART_KEY, {}); }
function saveCart() { lsSet(CART_KEY, state.cart); }

function formatPrice(v){return trCurrency.format(v)}

function populateCategories(){
  const select=document.getElementById("categorySelect");
  select.innerHTML = `<option value="all">Tümü</option>`;
  const cats=[...new Set(products.map(p=>p.category))].sort((a,b)=>a.localeCompare(b,"tr"));
  for(const c of cats){ const opt=document.createElement("option"); opt.value=c; opt.textContent=c; select.appendChild(opt) }
  select.value = state.category || "all";
}

function getFiltered(){
  const q=state.query.trim().toLowerCase();
  return products.filter(p=>{
    const categoryOk=state.category==="all"||p.category===state.category;
    if(!categoryOk) return false;
    if(!q) return true;
    const hay=(p.title+" "+p.desc).toLowerCase();
    return hay.includes(q)
  })
}

function renderAll(){
  const filtered=getFiltered();
  const popular=filtered.filter(p=>p.isPopular);
  const newest=[...filtered].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8);
  renderGrid("popularGrid",popular);
  renderGrid("newGrid",newest)
}

function renderGrid(containerId,items){
  const el=document.getElementById(containerId);
  if (!items.length) { el.innerHTML = `<div class="empty">Sonuç bulunamadı.</div>`; return; }
  el.innerHTML=items.map(p=>cardTemplate(p)).join("")
}
function cardTemplate(p){
  const fav=state.favorites.has(p.id);
  return `
    <article class="card" data-id="${p.id}" data-view="${p.id}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.title}">
        <button class="favorite-btn ${fav?"active":""}" data-fav="${p.id}" aria-label="Favori">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12.1 21.35c-.13.09-.3.09-.43 0C7.14 17.9 4.2 15.3 2.74 12.8 1.9 11.37 1.6 9.86 1.86 8.4c.25-1.43.99-2.76 2.12-3.65 2.15-1.7 5.13-1.17 6.88.92l.64.77.64-.77c1.75-2.09 4.73-2.62 6.88-.92 1.13.89 1.87 2.22 2.12 3.65.26 1.46-.04 2.97-.88 4.4-1.46 2.5-4.4 5.1-8.93 8.55Z"/></svg>
        </button>
      </div>
      <div class="card-body">
        <h4 class="card-title">${p.title}</h4>
        <p class="card-desc">${p.desc}</p>
        <div class="card-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <span style="color:rgba(230,237,243,.6);font-size:12px">${p.category}</span>
        </div>
      </div>
    </article>
  `
}

function onFavoriteToggle(id){
  if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
  saveFavorites();
  renderAll();
  const btn=document.getElementById("detailFavBtn");
  if (btn && Number(btn.dataset.id)===id) { btn.classList.toggle("active", state.favorites.has(id)); }
}

function openModal(el){ el.classList.add("open"); el.setAttribute("aria-hidden","false"); }
function closeModalById(id){ const el = document.getElementById(id); if (el){ el.classList.remove("open"); el.setAttribute("aria-hidden","true"); } }
function openProductModal(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  document.getElementById("detailImg").src = p.img;
  document.getElementById("detailImg").alt = p.title;
  document.getElementById("detailTitle").textContent = p.title;
  document.getElementById("detailDesc").textContent = p.desc;
  document.getElementById("detailCategory").textContent = p.category;
  document.getElementById("detailPrice").textContent = formatPrice(p.price);
  const favBtn = document.getElementById("detailFavBtn");
  favBtn.dataset.id = String(p.id);
  favBtn.classList.toggle("active", state.favorites.has(p.id));
  document.getElementById("detailQty").value = 1;
  openModal(document.getElementById("productModal"));
}

function updateCartCountBadge(){ const count = Object.values(state.cart).reduce((a,b)=>a+b,0); const badge = document.getElementById("cartCount"); if (badge) badge.textContent = String(count); }
function addToCart(productId, quantity=1){ const id = String(productId); const q = Math.max(1, Number(quantity) || 1); state.cart[id] = (state.cart[id] || 0) + q; saveCart(); updateCartCountBadge(); renderCart(); }
function updateCartQty(productId, qty){ const id = String(productId); const q = Math.max(1, Number(qty) || 1); state.cart[id] = q; saveCart(); updateCartCountBadge(); renderCart(); }
function removeFromCart(productId){ const id = String(productId); delete state.cart[id]; saveCart(); updateCartCountBadge(); renderCart(); }
function clearCart(){ state.cart = {}; saveCart(); updateCartCountBadge(); renderCart(); }
function cartTotals(){ let subtotal = 0; for (const [id, qty] of Object.entries(state.cart)){ const p = products.find(x=>x.id===Number(id)); if (p) subtotal += p.price * qty; } const shipping = subtotal > 0 ? 0 : 0; const total = subtotal + shipping; return {subtotal, shipping, total}; }
function renderCart(){
  const list = document.getElementById("cartItems");
  const {subtotal, shipping, total} = cartTotals();
  const subtotalEl = document.getElementById("cartSubtotal");
  const shipEl = document.getElementById("cartShipping");
  const totalEl = document.getElementById("cartTotal");
  if (!list) return;
  const entries = Object.entries(state.cart);
  if (!entries.length){ list.innerHTML = `<div class=\"empty\">Sepetiniz boş.</div>`; }
  else {
    list.innerHTML = entries.map(([id, qty])=>{ const p = products.find(x=>x.id===Number(id)); if (!p) return ""; return `
        <div class=\"cart-item\" data-cart-id=\"${p.id}\">
          <img src=\"${p.img}\" alt=\"${p.title}\">
          <div>
            <h4>${p.title}</h4>
            <div class=\"muted\">${p.category}</div>
            <div class=\"price\">${formatPrice(p.price)}</div>
          </div>
          <div style=\"display:flex;flex-direction:column;align-items:end;gap:6px\">
            <div class=\"cart-qty\">
              <button data-cart-dec=\"${p.id}\">−</button>
              <input type=\"number\" min=\"1\" value=\"${qty}\" data-cart-qty=\"${p.id}\">
              <button data-cart-inc=\"${p.id}\">+</button>
            </div>
            <button class=\"icon-btn\" title=\"Kaldır\" data-cart-remove=\"${p.id}\">🗑</button>
          </div>
        </div>` }).join("");
  }
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shipEl) shipEl.textContent = formatPrice(shipping);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function openDrawer(el){ el.classList.add("open"); el.setAttribute("aria-hidden","false"); }
function closeDrawerById(id){ const el = document.getElementById(id); if (el){ el.classList.remove("open"); el.setAttribute("aria-hidden","true"); } }

function updateAuthUI(){ const profileBtn = document.getElementById("profileBtn"); if (state.user){ profileBtn.textContent = "Profil"; document.getElementById("authView").classList.add("hidden"); document.getElementById("profileView").classList.remove("hidden"); document.getElementById("profileName").textContent = state.user.name; document.getElementById("profileEmail").textContent = state.user.email; } else { profileBtn.textContent = "Giriş"; document.getElementById("authView").classList.remove("hidden"); document.getElementById("profileView").classList.add("hidden"); } }

function renderSellerTable(){ const tbody = document.getElementById("sellerTableBody"); if (!tbody) return; const rows = products.slice().sort((a,b)=>b.id-a.id).map(p=>`<tr><td>${p.id}</td><td>${p.title}</td><td>${p.category}</td><td>${formatPrice(p.price)}</td><td>${p.isPopular ? "Evet":"Hayır"}</td><td>${p.createdAt}</td><td style=\"display:flex;gap:8px\"><button class=\"btn light\" data-edit=\"${p.id}\">Düzenle</button><button class=\"btn ghost\" data-delete=\"${p.id}\">Sil</button></td></tr>`).join(""); tbody.innerHTML = rows || `<tr><td colspan=\"7\" class=\"muted\">Henüz ürün yok.</td></tr>`; }
function fillProductForm(p){ document.getElementById("productId").value = p?.id || ""; document.getElementById("productTitle").value = p?.title || ""; document.getElementById("productDesc").value = p?.desc || ""; document.getElementById("productPrice").value = p?.price != null ? p.price : ""; document.getElementById("productCategory").value = p?.category || ""; document.getElementById("productPopular").checked = !!p?.isPopular; document.getElementById("productImg").value = p?.img || ""; }

function attachEvents(){
  const categorySelect=document.getElementById("categorySelect");
  const searchInput=document.getElementById("searchInput");
  categorySelect.addEventListener("change",e=>{state.category=e.target.value;renderAll()});
  searchInput.addEventListener("input",e=>{state.query=e.target.value;renderAll()});

  document.addEventListener("click",e=>{
    const favBtn=e.target.closest("[data-fav]");
    if(favBtn){ const id=Number(favBtn.getAttribute("data-fav")); onFavoriteToggle(id); e.stopPropagation(); return; }
    const viewTarget = e.target.closest("[data-view]"); if (viewTarget){ const id = Number(viewTarget.getAttribute("data-view")); openProductModal(id); return; }
    const closer = e.target.closest("[data-close]"); if (closer){ const id = closer.getAttribute("data-close"); closeModalById(id); closeDrawerById(id); return; }
  });

  const detail = document.getElementById("productModal");
  detail.addEventListener("click", (e)=>{
    const incBtn = e.target.closest("[data-qty='1']");
    const decBtn = e.target.closest("[data-qty='-1']");
    const qtyInput = document.getElementById("detailQty");
    if (incBtn){ qtyInput.value = String(Math.max(1, Number(qtyInput.value||1)+1)); }
    if (decBtn){ qtyInput.value = String(Math.max(1, Number(qtyInput.value||1)-1)); }
  });
  document.getElementById("detailFavBtn").addEventListener("click",()=>{ const id = Number(document.getElementById("detailFavBtn").dataset.id); onFavoriteToggle(id); });
  document.getElementById("detailAddCart").addEventListener("click",()=>{ const id = Number(document.getElementById("detailFavBtn").dataset.id); const qty = Number(document.getElementById("detailQty").value||1); addToCart(id, qty); closeModalById("productModal"); openDrawer(document.getElementById("cartDrawer")); });

  document.getElementById("cartBtn").addEventListener("click",()=>{ renderCart(); openDrawer(document.getElementById("cartDrawer")); });

  const cartPanel = document.getElementById("cartDrawer");
  cartPanel.addEventListener("click",(e)=>{
    const inc = e.target.closest("[data-cart-inc]");
    const dec = e.target.closest("[data-cart-dec]");
    const rem = e.target.closest("[data-cart-remove]");
    if (inc){ const id = Number(inc.getAttribute("data-cart-inc")); updateCartQty(id, (state.cart[id]+1)); }
    if (dec){ const id = Number(dec.getAttribute("data-cart-dec")); updateCartQty(id, Math.max(1, state.cart[id]-1)); }
    if (rem){ const id = Number(rem.getAttribute("data-cart-remove")); removeFromCart(id); }
  });
  cartPanel.addEventListener("input",(e)=>{
    const qtyInput = e.target.closest("[data-cart-qty]");
    if (qtyInput){ const id = Number(qtyInput.getAttribute("data-cart-qty")); const val = Number(qtyInput.value||1); updateCartQty(id, Math.max(1, val)); }
  });
  document.getElementById("clearCartBtn").addEventListener("click",clearCart);
  document.getElementById("checkoutBtn").addEventListener("click",()=>{
    const entries = Object.entries(state.cart);
    if (!entries.length) { alert("Sepetiniz boş."); return; }
    const total = cartTotals().total;
    alert(`Ödeme başarılı! Toplam: ${formatPrice(total)}\nSiparişiniz alınmıştır.`);
    clearCart();
    closeDrawerById("cartDrawer");
  });

  document.getElementById("profileBtn").addEventListener("click",()=>{ updateAuthUI(); openModal(document.getElementById("authModal")); });

  document.getElementById("loginForm").addEventListener("submit",(e)=>{ e.preventDefault(); const name = document.getElementById("loginName").value.trim(); const email = document.getElementById("loginEmail").value.trim(); if (!name || !email) return; state.user = {name, email}; saveUser(); updateAuthUI(); });

  document.getElementById("logoutBtn").addEventListener("click",()=>{ state.user = null; saveUser(); updateAuthUI(); });

  document.getElementById("sellerBtn").addEventListener("click",()=>{ if (!state.user){ updateAuthUI(); openModal(document.getElementById("authModal")); return; } renderSellerTable(); fillProductForm(null); openModal(document.getElementById("sellerModal")); });

  document.getElementById("newProductBtn").addEventListener("click",()=>{ fillProductForm(null); });

  document.getElementById("productForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const idVal = document.getElementById("productId").value;
    const title = document.getElementById("productTitle").value.trim();
    const desc = document.getElementById("productDesc").value.trim();
    const price = Number(document.getElementById("productPrice").value||0);
    const category = document.getElementById("productCategory").value.trim();
    const isPopular = document.getElementById("productPopular").checked;
    const img = document.getElementById("productImg").value.trim();
    if (!title || !desc || !category || !img || price<=0) return;
    if (idVal){ const id = Number(idVal); const idx = products.findIndex(p=>p.id===id); if (idx>-1){ products[idx] = {...products[idx], title, desc, price, category, isPopular, img}; } }
    else { const newId = (products.reduce((m,p)=>Math.max(m,p.id), 0) || 0) + 1; products.push({ id:newId, title, desc, price, category, isPopular, img, createdAt: new Date().toISOString().slice(0,10) }); }
    saveProducts(); populateCategories(); renderAll(); renderSellerTable(); fillProductForm(null);
  });

  document.getElementById("resetFormBtn").addEventListener("click",()=>{ fillProductForm(null); });

  document.getElementById("sellerTable").addEventListener("click",(e)=>{
    const editBtn = e.target.closest("[data-edit]");
    const delBtn = e.target.closest("[data-delete]");
    if (editBtn){ const id = Number(editBtn.getAttribute("data-edit")); const p = products.find(x=>x.id===id); if (p) fillProductForm(p); }
    if (delBtn){ const id = Number(delBtn.getAttribute("data-delete")); if (confirm(`#${id} ürün silinsin mi?`)){ products = products.filter(x=>x.id!==id); saveProducts(); populateCategories(); renderAll(); renderSellerTable(); } }
  });
}

function init(){ loadFavorites(); loadProducts(); loadUser(); loadCart(); populateCategories(); attachEvents(); renderAll(); updateAuthUI(); updateCartCountBadge(); renderCart(); }

document.addEventListener("DOMContentLoaded",init);

/* Club del Picante — App (scroll version) */

// ---- UTILS ---- //
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg, type) {
  type = type || '';
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('active', show);
}

// ---- NAVBAR ---- //
function initNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- MOBILE MENU ---- //
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// ---- PARTICLES ---- //
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (Math.random()*100) + '%;background:' + (Math.random()>0.5?'var(--orange)':'var(--red)') + ';opacity:' + (Math.random()*0.4+0.1) + ';animation-duration:' + (Math.random()*10+8) + 's;animation-delay:' + (Math.random()*5) + 's;';
    container.appendChild(p);
  }
}

// ---- PRODUCTOS (render en grid de scroll) ---- //
async function loadProductsScroll() {
  const grid = document.getElementById('productsScrollGrid');
  if (!grid) return;
  let products = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);
    const res = await fetch('/api/products', { signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      products = data;
    } else {
      throw new Error('fallback');
    }
  } catch {
    products = [
      { id: 'miel-picante-chica', name: 'Fuego Lento', size: 'Frasco Chico', weight: '150g', price: 2800, stock: 25, spiceLevel: 2, image: '/images/miel-chica.jpg', badge: 'Para principiantes', active: true },
      { id: 'miel-picante-mediana', name: 'Brasas', size: 'Frasco Mediano', weight: '300g', price: 4900, stock: 18, spiceLevel: 3, image: '/images/miel-mediana.jpg', badge: 'Mas vendido', active: true },
      { id: 'miel-picante-grande', name: 'Infierno', size: 'Frasco Grande', weight: '500g', price: 7500, stock: 12, spiceLevel: 5, image: '/images/miel-grande.jpg', badge: 'Nivel extremo', active: true },
      { id: 'miel-picante-regalo', name: 'Kit Degustacion', size: 'Set x3', weight: '3 x 150g', price: 9200, stock: 8, spiceLevel: null, image: '/images/miel-kit.jpg', badge: 'Ideal para regalo', active: true }
    ];
  }
  grid.innerHTML = products.map(p => {
    const spice = p.spiceLevel ? '🌶️'.repeat(p.spiceLevel) : '';
    return '<div class="product-card" style="cursor:pointer;display:flex;flex-direction:column;" onclick="openProductModal(\'' + p.id + '\')">' +
      '<div class="product-card-img">' +
      (p.badge ? '<span class="product-card-badge">' + p.badge + '</span>' : '') +
      (p.stock === 0 ? '<span class="product-card-badge" style="background:#333">Agotado</span>' : '') +
      '<img src="' + p.image + '" alt="' + p.name + '" onerror="this.style.display=\'none\'"/>' +
      '<span class="outnow-badge">OUT NOW</span>' +
      '</div>' +
      '<div class="product-card-body" style="display:flex;flex-direction:column;flex:1;">' +
      '<div class="product-card-name">HOT HONEY ' + p.name.toUpperCase() + '</div>' +
      '<div class="product-card-size">' + p.size + ' · ' + p.weight + '</div>' +
      (spice ? '<div class="product-card-spice">' + spice + '</div>' : '') +
      '<div class="product-card-price" style="margin-top:auto;padding-top:8px;">$' + p.price.toLocaleString('es-AR') + '</div>' +
      '<button class="product-card-btn" style="margin-top:10px;" ' + (p.stock===0?'disabled':'') + ' onclick="event.stopPropagation();addToCartById(\'' + p.id + '\')">' +
      (p.stock===0?'Sin stock':'Agregar al carrito') +
      '</button></div></div>';
  }).join('');
  window._allProducts = products;

  // Agregar boton mayorista debajo del grid
  const section = document.getElementById('productos');
  if (section && !document.getElementById('btnMayorista')) {
    const btn = document.createElement('div');
    btn.id = 'btnMayorista';
    btn.style.cssText = 'text-align:center;margin-top:32px;padding:0 24px';
    btn.innerHTML = '<a href="https://wa.me/5491100000000?text=Hola!%20Quiero%20consultar%20sobre%20venta%20mayorista%20de%20Hot%20Honey%20Club%20del%20Picante" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:12px;background:var(--black-card);border:2px solid var(--orange);color:var(--white);font-family:var(--font-body);font-weight:700;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.08em;padding:16px 32px;border-radius:var(--radius);text-decoration:none">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;color:#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '<div style="text-align:left"><div style="font-size:0.7rem;color:var(--orange);margin-bottom:2px">Para restaurantes y locales</div><div>CONSULTA VENTA MAYORISTA</div></div>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;opacity:0.6"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</a>';
    const inner = section.querySelector('.inner');
    if (inner) inner.appendChild(btn);
  }
}

// ---- PRODUCT MODAL ---- //
function openProductModal(id) {
  const products = window._allProducts || [];
  const p = products.find(x => x.id === id);
  if (!p) return;
  window._detailQty = 1;
  const overlay = document.getElementById('checkoutOverlay');
  const inner = document.getElementById('checkoutInner');
  inner.innerHTML = '<button class="checkout-close-btn" onclick="closeCheckoutOverlay()">✕</button>' +
    '<div style="display:flex;flex-direction:column;gap:20px">' +
    '<div style="background:linear-gradient(135deg,#1a0500,#0d0d0d);border-radius:12px;aspect-ratio:1;max-height:280px;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
    '<img src="' + p.image + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'"/>' +
    '</div>' +
    '<div>' +
    '<h2 style="font-size:2rem;margin-bottom:6px">HOT HONEY ' + p.name.toUpperCase() + '</h2>' +
    '<div style="font-size:0.8rem;color:var(--grey);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px">' + p.size + ' · ' + p.weight + '</div>' +
    (p.spiceLevel ? '<div style="margin-bottom:10px;font-size:1rem">' + '🌶️'.repeat(p.spiceLevel) + '</div>' : '') +
    '<div style="font-family:var(--font-display);font-size:2.5rem;color:var(--orange);margin-bottom:16px">$' + p.price.toLocaleString('es-AR') + '</div>' +
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">' +
    '<div style="display:flex;align-items:center;gap:10px;background:var(--black);border:1px solid var(--black-border);border-radius:10px;padding:8px 14px">' +
    '<button class="qty-btn" onclick="changeModalQty(-1)" style="width:30px;height:30px">-</button>' +
    '<span id="modalQty" style="font-weight:700;min-width:28px;text-align:center">1</span>' +
    '<button class="qty-btn" onclick="changeModalQty(1)" style="width:30px;height:30px">+</button>' +
    '</div>' +
    '<button class="btn-primary" style="flex:1" onclick="addToCartFromModal(\'' + p.id + '\')" ' + (p.stock===0?'disabled':'') + '>' +
    '<span>' + (p.stock===0?'Sin stock':'Agregar al carrito') + '</span></button>' +
    '</div>' +
    (p.stock>0&&p.stock<=5?'<p style="color:var(--red);font-size:0.8rem;font-weight:700">Solo quedan ' + p.stock + ' unidades!</p>':'') +
    '</div></div>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function changeModalQty(delta) {
  window._detailQty = Math.max(1, Math.min(10, (window._detailQty||1) + delta));
  const el = document.getElementById('modalQty');
  if (el) el.textContent = window._detailQty;
}

function addToCartFromModal(id) {
  const p = (window._allProducts||[]).find(x => x.id === id);
  if (p) { Cart.add(p, window._detailQty||1); closeCheckoutOverlay(); openCart(); }
}

function addToCartById(id) {
  const p = (window._allProducts||[]).find(x => x.id === id);
  if (p) { Cart.add(p, 1); openCart(); }
}

// ---- CART OVERLAY ---- //
function openCart() {
  renderCartPanel();
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeCartIfOutside(e) {
  if (e.target === document.getElementById('cartOverlay')) closeCart();
}

function renderCartPanel() {
  const items = Cart.getItems();
  const body = document.getElementById('cartPanelBody');
  const footer = document.getElementById('cartPanelFooter');
  if (!items.length) {
    body.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--grey)"><div style="font-size:3rem;margin-bottom:12px">🛒</div><p>Tu carrito esta vacio</p></div>';
    footer.innerHTML = '<button class="btn-primary" style="width:100%;justify-content:center;display:flex" onclick="closeCart();scrollToSection(\'productos\')">Ver productos</button>';
    return;
  }
  const subtotal = Cart.getTotal();
  const shipping = subtotal >= 10000 ? 0 : 1500;
  const total = subtotal + shipping;
  body.innerHTML = items.map(item =>
    '<div class="cart-item">' +
    '<div class="cart-item-info"><div class="cart-item-name">' + item.name + '</div>' +
    '<div class="cart-item-size">' + item.size + ' · ' + item.weight + '</div>' +
    '<div class="cart-item-price">$' + item.price.toLocaleString('es-AR') + '</div>' +
    '<div class="cart-item-controls">' +
    '<button class="qty-btn" onclick="Cart.updateQty(\'' + item.id + '\',' + (item.quantity-1) + ');renderCartPanel()">-</button>' +
    '<span class="qty-value">' + item.quantity + '</span>' +
    '<button class="qty-btn" onclick="Cart.updateQty(\'' + item.id + '\',' + (item.quantity+1) + ');renderCartPanel()">+</button>' +
    '</div></div>' +
    '<button class="cart-item-remove" onclick="Cart.remove(\'' + item.id + '\');renderCartPanel()" title="Eliminar">x</button>' +
    '</div>'
  ).join('');
  footer.innerHTML =
    '<div class="cart-summary-row" style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;color:var(--grey)"><span>Subtotal</span><span>$' + subtotal.toLocaleString('es-AR') + '</span></div>' +
    '<div class="cart-summary-row" style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.85rem;color:var(--grey)"><span>Envio</span><span>' + (shipping===0?'<span style="color:#22c55e">GRATIS</span>':'$' + shipping.toLocaleString('es-AR')) + '</span></div>' +
    '<div style="display:flex;justify-content:space-between;font-family:var(--font-display);font-size:1.5rem;margin-bottom:16px"><span>Total</span><span style="color:var(--orange)">$' + total.toLocaleString('es-AR') + '</span></div>' +
    '<button class="btn-primary" style="width:100%;justify-content:center;display:flex" onclick="closeCart();openCheckoutOverlay()"><span>Finalizar compra</span></button>';
}

// ---- CHECKOUT OVERLAY ---- //
function openCheckoutOverlay() {
  const inner = document.getElementById('checkoutInner');
  inner.innerHTML = '<button class="checkout-close-btn" onclick="closeCheckoutOverlay()">✕</button>';
  const temp = document.createElement('div');
  temp.id = 'checkoutContainer';
  inner.appendChild(temp);
  Checkout.render();
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutOverlay() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Override navigate for checkout
function navigate(page) {
  if (page === 'cart') { openCart(); return; }
  if (page === 'checkout') { closeCart(); openCheckoutOverlay(); return; }
  if (page === 'home') { scrollToSection('hero'); return; }
  if (page === 'shop') { scrollToSection('productos'); return; }
  if (page === 'about') { scrollToSection('hero'); return; }
  if (page === 'stores') { scrollToSection('puntos-venta'); return; }
  if (page === 'contact') { scrollToSection('contacto'); return; }
  if (page === 'pago-exitoso') { closeCheckoutOverlay(); showToast('Pago confirmado! Gracias por tu compra.', 'success'); return; }
  if (page === 'pago-fallido') { showToast('El pago no fue procesado. Intenta de nuevo.', 'error'); return; }
}

// ---- VIDEO ---- //
function loadVideo() {
  const url = document.getElementById('videoUrl').value.trim();
  const wrapper = document.getElementById('videoWrapper');
  const placeholder = document.getElementById('videoPlaceholder');
  if (!url) { showToast('Ingresa una URL'); return; }
  let embedUrl = '';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) embedUrl = 'https://www.youtube.com/embed/' + yt[1] + '?autoplay=1&rel=0';
  const ytS = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytS) embedUrl = 'https://www.youtube.com/embed/' + ytS[1] + '?autoplay=1';
  const ig = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  if (ig) embedUrl = 'https://www.instagram.com/p/' + ig[1] + '/embed/';
  if (!embedUrl) { showToast('URL no reconocida. Usa YouTube o Instagram.', 'error'); return; }
  if (placeholder) placeholder.remove();
  const existing = wrapper.querySelector('iframe');
  if (existing) existing.remove();
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  wrapper.appendChild(iframe);
  showToast('Video cargado!');
}

document.getElementById('videoUrl') && document.getElementById('videoUrl').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') loadVideo();
});

// ---- MAPA ---- //
const mapUrls = {
  coqueta: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.5!2d-58.4681!3d-34.5534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5a0a16e8e8b%3A0x0!2s3+de+Febrero+3089%2C+Nu%C3%B1ez!5e0!3m2!1ses!2sar!4v1',
  eneldo: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.0!2d-58.5786!3d-34.3461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMercado+Puertos+de+Lagos%2C+Escobar!5e0!3m2!1ses!2sar!4v1',
  online: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d193200!2d-58.4370!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1'
};

const mapAddresses = {
  coqueta: '3 de Febrero 3089, Nuñez, CABA',
  eneldo: 'Mercado Puertos de Lagos, Escobar',
  online: 'CABA y GBA · Envío a domicilio'
};

function switchMap(key, el) {
  document.querySelectorAll('.map-point-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const frame = document.getElementById('mapFrame');
  if (frame && mapUrls[key]) frame.src = mapUrls[key];
  const addr = document.getElementById('mapBadgeAddr');
  if (addr && mapAddresses[key]) addr.textContent = mapAddresses[key];
}

// ---- LIGHTBOX ---- //
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- CONTACT ---- //
async function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Enviando...';
  await new Promise(r => setTimeout(r, 1500));
  showToast('Mensaje enviado! Te contactamos pronto.', 'success');
  e.target.reset();
  btn.disabled = false;
  btn.querySelector('span').textContent = 'Enviar mensaje';
}

// =====================================================
// ---- AUTH ---- //
// =====================================================
const Auth = (() => {
  const SK = 'cdp_user', AK = 'cdp_admin_token', UK = 'cdp_users';
  const getUsers = () => { try { return JSON.parse(localStorage.getItem(UK)||'[]'); } catch { return []; } };
  const saveUsers = u => localStorage.setItem(UK, JSON.stringify(u));
  const getSession = () => { try { return JSON.parse(localStorage.getItem(SK)); } catch { return null; } };
  const saveSession = u => localStorage.setItem(SK, JSON.stringify(u));
  const clearSession = () => { localStorage.removeItem(SK); localStorage.removeItem(AK); };
  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return { ok: false, error: 'Ya existe una cuenta con ese email' };
    users.push({ name, email, password, role: 'user', createdAt: new Date().toISOString() });
    saveUsers(users); saveSession({ name, email, role: 'user' }); return { ok: true };
  };
  const loginUser = (email, password) => {
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, error: 'Email o contrasena incorrectos' };
    saveSession({ name: user.name, email: user.email, role: 'user' }); return { ok: true };
  };
  const loginAdmin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.token) { localStorage.setItem(AK, data.token); saveSession({ name: 'Admin', email, role: 'admin' }); return { ok: true }; }
      return { ok: false, error: data.error || 'Credenciales incorrectas' };
    } catch {
      if (email === 'admin@clubdelpicante.com.ar' && password === 'ClubPicante2024!') {
        localStorage.setItem(AK, 'demo-admin-token'); saveSession({ name: 'Admin', email, role: 'admin' }); return { ok: true };
      }
      return { ok: false, error: 'Credenciales incorrectas' };
    }
  };
  const logout = () => { clearSession(); updateNavAuth(); showToast('Sesion cerrada'); };
  return { getSession, register, loginUser, loginAdmin, logout };
})();

function openLoginModal() {
  const s = Auth.getSession();
  if (s) showLoggedState(s); else showLoginForm();
  document.getElementById('loginModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal(e) {
  if (e && e.target !== document.getElementById('loginModalOverlay')) return;
  document.getElementById('loginModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabRegister').classList.toggle('active', tab==='register');
  document.getElementById('authLogin').style.display = tab==='login' ? '' : 'none';
  document.getElementById('authRegister').style.display = tab==='register' ? '' : 'none';
  document.getElementById('authLogged').style.display = 'none';
}

function showLoginForm() {
  document.getElementById('authLogin').style.display = '';
  document.getElementById('authRegister').style.display = 'none';
  document.getElementById('authLogged').style.display = 'none';
  document.querySelector('.login-tabs').style.display = '';
  document.getElementById('tabLogin').classList.add('active');
  document.getElementById('tabRegister').classList.remove('active');
}

function showLoggedState(s) {
  document.getElementById('authLogin').style.display = 'none';
  document.getElementById('authRegister').style.display = 'none';
  document.getElementById('authLogged').style.display = '';
  document.querySelector('.login-tabs').style.display = 'none';
  document.getElementById('loggedName').textContent = 'Hola, ' + s.name + '!';
  document.getElementById('loggedEmail').textContent = s.email;
  const ab = document.getElementById('btnAdminPanel');
  if (ab) ab.style.display = s.role==='admin' ? '' : 'none';
}

async function submitLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const result = email === 'admin@clubdelpicante.com.ar' ? await Auth.loginAdmin(email, password) : Auth.loginUser(email, password);
  if (result.ok) {
    const s = Auth.getSession(); showLoggedState(s); updateNavAuth();
    showToast('Bienvenido, ' + s.name + '!', 'success');
    if (s.role === 'admin') { setTimeout(() => { closeLoginModal(); loadAdminPanel(); }, 800); }
  } else { showToast(result.error, 'error'); }
}

async function submitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const result = Auth.register(name, email, password);
  if (result.ok) { showLoggedState(Auth.getSession()); updateNavAuth(); showToast('Bienvenido al Club, ' + name + '!', 'success'); }
  else showToast(result.error, 'error');
}

function logoutUser() {
  Auth.logout(); closeLoginModal();
  const panel = document.getElementById('admin-panel');
  if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
}

function updateNavAuth() {
  const s = Auth.getSession();
  const btn = document.getElementById('navLoginBtn');
  const text = document.getElementById('navLoginText');
  if (!btn || !text) return;
  if (s) { text.textContent = s.name.split(' ')[0]; btn.classList.add('logged'); }
  else { text.textContent = 'Ingresar'; btn.classList.remove('logged'); }
}

// ---- ADMIN ---- //
async function adminLogin(e) {
  e.preventDefault();
  showLoading(true);
  const result = await Auth.loginAdmin(document.getElementById('adminEmail').value, document.getElementById('adminPassword').value);
  showLoading(false);
  if (result.ok) loadAdminPanel(); else showToast('Credenciales incorrectas', 'error');
}

async function loadAdminPanel() {
  const token = localStorage.getItem('cdp_admin_token');
  if (!token) { openLoginModal(); return; }
  document.getElementById('mainFooter').style.display = 'none';
  let panel = document.getElementById('admin-panel');
  if (!panel) { panel = document.createElement('div'); panel.id = 'admin-panel'; panel.style.cssText = 'position:fixed;inset:0;z-index:600;background:var(--black);overflow-y:auto'; document.body.appendChild(panel); }
  panel.style.display = 'block';
  panel.innerHTML = '<div style="display:flex;min-height:100vh"><aside class="admin-sidebar open" id="adminSidebar" style="position:fixed;top:0;left:0;bottom:0;z-index:10;transform:translateX(0)"><div class="admin-sidebar-header"><div class="logo-flame">🌶️</div><span class="logo-text"><strong>ADMIN</strong></span></div><nav class="admin-nav"><a class="admin-nav-item active" onclick="adminTab(\'dashboard\')" href="#"><span class="admin-nav-icon">📊</span> Dashboard</a><a class="admin-nav-item" onclick="adminTab(\'orders\')" href="#"><span class="admin-nav-icon">📦</span> Pedidos</a><a class="admin-nav-item" onclick="adminTab(\'products\')" href="#"><span class="admin-nav-icon">🍯</span> Productos</a></nav><div class="admin-sidebar-footer"><button class="btn-ghost" style="width:100%;font-size:0.8rem" onclick="adminLogout()">Cerrar sesion</button></div></aside><main style="flex:1;margin-left:240px"><div class="admin-topbar"><button class="admin-menu-toggle" onclick="document.getElementById(\'adminSidebar\').classList.toggle(\'open\')"><span></span><span></span><span></span></button><h1 id="adminPageTitle">DASHBOARD</h1><div style="font-size:0.8rem;color:var(--grey)">Club del Picante</div></div><div class="admin-content" id="adminContent"><div style="text-align:center;padding:60px;color:var(--grey)"><div style="font-size:3rem;animation:spin 1s linear infinite">🌶️</div></div></div></main></div><div class="modal-overlay" id="orderModal"><div class="modal-content" id="orderModalContent"></div></div>';
  adminTab('dashboard');
}

async function adminTab(tab) {
  const token = localStorage.getItem('cdp_admin_token');
  const content = document.getElementById('adminContent');
  const title = document.getElementById('adminPageTitle');
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.toggle('active', (i.getAttribute('onclick')||'').includes(tab)));
  content.innerHTML = '<div style="text-align:center;padding:60px;color:var(--grey)"><div style="font-size:3rem;animation:spin 1s linear infinite">🌶️</div></div>';
  if (tab === 'dashboard') {
    title.textContent = 'DASHBOARD';
    try { const res = await fetch('/api/admin/stats', { headers: { Authorization: 'Bearer ' + token } }); content.innerHTML = renderDashboard(await res.json()); }
    catch { content.innerHTML = renderDashboard({ totalOrders:0, confirmedOrders:0, pendingOrders:0, todayOrders:0, totalRevenue:0, last7Days:[{date:'Lun',orders:0,revenue:0},{date:'Mar',orders:0,revenue:0},{date:'Mie',orders:0,revenue:0},{date:'Jue',orders:0,revenue:0},{date:'Vie',orders:0,revenue:0},{date:'Sab',orders:0,revenue:0},{date:'Dom',orders:0,revenue:0}], topProduct:null, lowStockProducts:[] }); }
  } else if (tab === 'orders') {
    title.textContent = 'PEDIDOS';
    try { const res = await fetch('/api/admin/orders?limit=50', { headers: { Authorization: 'Bearer ' + token } }); const data = await res.json(); content.innerHTML = renderOrdersTable(data.orders||[]); }
    catch { content.innerHTML = renderOrdersTable([]); }
  } else if (tab === 'products') {
    title.textContent = 'PRODUCTOS';
    try { const res = await fetch('/api/admin/products', { headers: { Authorization: 'Bearer ' + token } }); content.innerHTML = renderProductsTable(await res.json()); }
    catch { const res2 = await fetch('/api/products'); content.innerHTML = renderProductsTable(await res2.json()); }
  }
}

function renderDashboard(s) {
  const max = Math.max(...s.last7Days.map(d => d.revenue), 1);
  return '<div class="admin-stats-grid"><div class="stat-card"><div class="stat-icon">📦</div><div class="stat-label">Total pedidos</div><div class="stat-value">' + s.totalOrders + '</div><div class="stat-sub">' + s.todayOrders + ' hoy</div></div><div class="stat-card"><div class="stat-icon">✅</div><div class="stat-label">Confirmados</div><div class="stat-value">' + s.confirmedOrders + '</div><div class="stat-sub">' + s.pendingOrders + ' pendientes</div></div><div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Ingresos</div><div class="stat-value">$' + (s.totalRevenue/1000).toFixed(1) + 'k</div><div class="stat-sub">ARS</div></div><div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-label">Mas vendido</div><div class="stat-value" style="font-size:1.1rem">' + (s.topProduct?s.topProduct.name.split(' ').slice(-1)[0]:'—') + '</div><div class="stat-sub">' + (s.topProduct?s.topProduct.quantity:0) + ' uds</div></div></div>' +
    '<div class="admin-chart-section"><div class="admin-chart-header"><h2>VENTAS ULTIMOS 7 DIAS</h2></div><div class="chart-bars">' +
    s.last7Days.map(d => { const h = Math.max((d.revenue/max)*100,4); return '<div class="chart-bar-wrapper"><div class="chart-bar" style="height:' + h + '%" data-value="$' + d.revenue.toLocaleString('es-AR') + '"></div><div class="chart-label">' + d.date + '</div></div>'; }).join('') + '</div></div>';
}

function renderOrdersTable(orders) {
  const sl = { pendiente_pago:'Pendiente', pago_pendiente:'En proceso', confirmado:'Confirmado', en_preparacion:'Preparando', enviado:'Enviado', entregado:'Entregado', pago_rechazado:'Rechazado', cancelado:'Cancelado' };
  return '<div class="admin-table-section"><div class="admin-table-header"><h2>PEDIDOS</h2><span style="color:var(--grey);font-size:0.85rem">' + orders.length + ' pedidos</span></div>' +
    (orders.length===0?'<div style="text-align:center;padding:60px;color:var(--grey)"><div style="font-size:3rem">📭</div><p style="margin-top:12px">No hay pedidos todavia</p></div>':
    '<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Ver</th></tr></thead><tbody>' +
    orders.map(o => '<tr><td style="font-family:monospace;font-size:0.75rem;color:var(--grey)">#' + o.id.slice(0,8).toUpperCase() + '</td><td><div style="font-weight:700;font-size:0.85rem">' + (o.customer&&o.customer.name||'—') + '</div></td><td style="font-family:var(--font-display);color:var(--orange)">$' + (o.total||0).toLocaleString('es-AR') + '</td><td><span class="order-status status-' + o.status + '">' + (sl[o.status]||o.status) + '</span></td><td><button class="order-action-btn" onclick="openOrderModal(\'' + o.id + '\')">Ver</button></td></tr>').join('') +
    '</tbody></table></div>') + '</div>';
}

function renderProductsTable(products) {
  return '<div class="admin-table-section"><div class="admin-table-header"><h2>PRODUCTOS</h2></div><div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Guardar</th></tr></thead><tbody>' +
    products.map(p => '<tr><td><div style="font-weight:700;font-size:0.85rem">' + p.name + '</div><div style="font-size:0.7rem;color:var(--grey)">' + p.size + '</div></td><td><input type="number" id="price-' + p.id + '" value="' + p.price + '" min="0" style="width:90px;text-align:right;background:var(--black);border:1px solid var(--black-border);color:var(--white);border-radius:6px;padding:5px 8px"/></td><td><input type="number" id="stock-' + p.id + '" value="' + p.stock + '" min="0" max="999" style="width:65px;text-align:center;background:var(--black);border:1px solid var(--black-border);color:var(--white);border-radius:6px;padding:5px 8px"/></td><td><button class="toggle-active ' + (p.active?'on':'') + '" id="active-' + p.id + '" onclick="toggleProductActive(\'' + p.id + '\',this)"></button></td><td><button class="order-action-btn" onclick="saveProduct(\'' + p.id + '\')">Guardar</button></td></tr>').join('') +
    '</tbody></table></div></div>';
}

async function saveProduct(id) {
  const token = localStorage.getItem('cdp_admin_token');
  const price = parseInt(document.getElementById('price-'+id).value||0);
  const stock = parseInt(document.getElementById('stock-'+id).value||0);
  const active = document.getElementById('active-'+id).classList.contains('on');
  try { await fetch('/api/admin/products/'+id, { method:'PATCH', headers:{'Content-Type':'application/json',Authorization:'Bearer '+token}, body:JSON.stringify({price,stock,active}) }); showToast('Producto actualizado', 'success'); }
  catch { showToast('Error al guardar', 'error'); }
}

function toggleProductActive(id, btn) { btn.classList.toggle('on'); }

async function openOrderModal(orderId) {
  const token = localStorage.getItem('cdp_admin_token');
  const modal = document.getElementById('orderModal');
  const content = document.getElementById('orderModalContent');
  content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--grey)">Cargando...</div>';
  modal.classList.add('open');
  try {
    const res = await fetch('/api/orders/'+orderId, { headers: { Authorization: 'Bearer '+token } });
    const order = await res.json();
    const opts = ['pendiente_pago','pago_pendiente','confirmado','en_preparacion','enviado','entregado','pago_rechazado','cancelado'];
    const sl = { pendiente_pago:'Pendiente', pago_pendiente:'En proceso', confirmado:'Confirmado', en_preparacion:'En preparacion', enviado:'Enviado', entregado:'Entregado', pago_rechazado:'Rechazado', cancelado:'Cancelado' };
    content.innerHTML = '<div class="modal-header"><div class="modal-title">Pedido #' + orderId.slice(0,8).toUpperCase() + '</div><button class="modal-close" onclick="closeOrderModal()">x</button></div>' +
      '<div class="modal-section"><h4>Cliente</h4><div class="modal-row"><span>Nombre</span><span>' + (order.customer&&order.customer.name||'—') + '</span></div><div class="modal-row"><span>Email</span><span>' + (order.customer&&order.customer.email||'—') + '</span></div></div>' +
      '<div class="modal-section"><h4>Productos</h4>' + (order.items||[]).map(i => '<div class="modal-row"><span>' + i.name + ' x' + i.quantity + '</span><span>$' + (i.price*i.quantity).toLocaleString('es-AR') + '</span></div>').join('') + '<div class="modal-row" style="font-weight:700;color:var(--orange)"><span>TOTAL</span><span>$' + (order.total||0).toLocaleString('es-AR') + '</span></div></div>' +
      '<div class="modal-section"><h4>Cambiar estado</h4><select class="modal-status-select" id="newStatus">' + opts.map(s => '<option value="' + s + '"' + (order.status===s?' selected':'') + '>' + sl[s] + '</option>').join('') + '</select><button class="btn-primary btn-full" style="margin-top:12px" onclick="updateOrderStatus(\'' + orderId + '\')">Actualizar</button></div>';
  } catch { content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--grey)">Error al cargar</div>'; }
}

function closeOrderModal() { document.getElementById('orderModal').classList.remove('open'); }

async function updateOrderStatus(orderId) {
  const token = localStorage.getItem('cdp_admin_token');
  const status = document.getElementById('newStatus').value;
  try { await fetch('/api/admin/orders/'+orderId, { method:'PATCH', headers:{'Content-Type':'application/json',Authorization:'Bearer '+token}, body:JSON.stringify({status}) }); showToast('Estado actualizado', 'success'); closeOrderModal(); adminTab('orders'); }
  catch { showToast('Error al actualizar', 'error'); }
}

function adminLogout() {
  Auth.logout();
  const panel = document.getElementById('admin-panel');
  if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
  document.getElementById('mainFooter').style.display = '';
}

// ---- URL PARAMS ---- //
function handleURLParams() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');
  if (path === '/pago-exitoso') {
    if (orderId) { fetch('/api/payment/confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,status:'approved'})}); Cart.clear(); Cart.updateBadge(); }
    setTimeout(() => showToast('Pago confirmado! Gracias por tu compra.', 'success'), 500);
    window.history.replaceState({}, '', '/');
  } else if (path === '/pago-fallido') {
    setTimeout(() => showToast('El pago no fue procesado. Intenta de nuevo.', 'error'), 500);
    window.history.replaceState({}, '', '/');
  } else if (path === '/admin') {
    const s = Auth.getSession();
    if (s && s.role === 'admin') loadAdminPanel(); else openLoginModal();
  }
}

// ---- INIT ---- //
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  Cart.updateBadge();
  updateNavAuth();
  initParticles();
  loadProductsScroll();
  handleURLParams();
});

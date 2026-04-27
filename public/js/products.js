const Products = (() => {
  let allProducts = [];

  const formatPrice = (n) => '$' + n.toLocaleString('es-AR');

  const spiceMeter = (level) => {
    if (!level) return '';
    const filled = '🌶️'.repeat(level);
    const empty = '◦'.repeat(5 - level);
    return '<span title="Nivel de picante ' + level + '/5">' + filled + empty + '</span>';
  };

  const renderCard = (p) => {
    return '<div class="product-card" onclick="Products.openDetail(\'' + p.id + '\')">' +
      '<div class="product-card-img">' +
      (p.badge ? '<span class="product-card-badge">' + p.badge + '</span>' : '') +
      (p.stock <= 5 && p.stock > 0 ? '<span class="product-card-badge" style="top:auto;bottom:8px;background:rgba(204,17,0,0.9)">Ultimas ' + p.stock + '!</span>' : '') +
      (p.stock === 0 ? '<span class="product-card-badge" style="background:#333">Agotado</span>' : '') +
      '<img src="' + p.image + '" alt="' + p.name + '" onerror="this.style.display=\'none\'" />' +
      '</div>' +
      '<div class="product-card-body">' +
      '<div class="product-card-name">' + p.name + '</div>' +
      '<div class="product-card-size">' + p.size + ' · ' + p.weight + '</div>' +
      (p.spiceLevel ? '<div class="product-card-spice">' + spiceMeter(p.spiceLevel) + '</div>' : '') +
      '<div class="product-card-price">' + formatPrice(p.price) + '</div>' +
      '<button class="product-card-btn" ' + (p.stock === 0 ? 'disabled' : '') + ' onclick="event.stopPropagation(); Products.addToCart(\'' + p.id + '\')">' +
      (p.stock === 0 ? 'Sin stock' : 'Agregar al carrito') +
      '</button>' +
      '</div></div>';
  };

  const renderDetail = (p) => {
    document.getElementById('productDetailContainer').innerHTML =
      '<div class="product-detail">' +
      '<button class="btn-ghost" onclick="navigate(\'shop\')" style="margin:20px;width:auto">← Volver</button>' +
      '<div class="product-detail-inner">' +
      '<div class="product-detail-img">' +
      '<img src="' + p.image + '" alt="' + p.name + '" onerror="this.style.display=\'none\'" />' +
      '</div>' +
      '<div class="product-detail-info">' +
      (p.badge ? '<span class="product-card-badge" style="position:static;display:inline-flex;margin-bottom:12px">' + p.badge + '</span>' : '') +
      '<h1 style="font-size:clamp(2rem,6vw,3.5rem);margin-bottom:8px">' + p.name + '</h1>' +
      '<div style="font-size:0.8rem;color:var(--grey);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px">' + p.size + ' · ' + p.weight + '</div>' +
      (p.spiceLevel ? '<div style="margin-bottom:16px"><span style="font-size:0.75rem;color:var(--grey);margin-right:8px">Picante:</span><span style="font-size:1.2rem">' + spiceMeter(p.spiceLevel) + '</span></div>' : '') +
      '<p style="color:var(--grey-light);line-height:1.8;margin-bottom:24px">' + p.description + '</p>' +
      '<div style="font-family:var(--font-display);font-size:3rem;color:var(--orange);margin-bottom:24px">' + formatPrice(p.price) + '</div>' +
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">' +
      '<div style="display:flex;align-items:center;gap:12px;background:var(--black-card);border:1px solid var(--black-border);border-radius:var(--radius);padding:8px 16px">' +
      '<button class="qty-btn" onclick="Products.changeDetailQty(-1)" style="width:32px;height:32px">−</button>' +
      '<span id="detailQty" style="font-weight:700;font-size:1.1rem;min-width:32px;text-align:center">1</span>' +
      '<button class="qty-btn" onclick="Products.changeDetailQty(1)" style="width:32px;height:32px">+</button>' +
      '</div>' +
      '<button class="btn-primary" style="flex:1" onclick="Products.addToCartFromDetail(\'' + p.id + '\')" ' + (p.stock === 0 ? 'disabled' : '') + '>' +
      '<span>' + (p.stock === 0 ? 'Sin stock' : 'Agregar al carrito') + '</span>' +
      '</button></div>' +
      (p.stock > 0 && p.stock <= 5 ? '<p style="color:var(--red);font-size:0.8rem;font-weight:700">Solo quedan ' + p.stock + ' unidades!</p>' : '') +
      '<div style="background:var(--black-card);border:1px solid var(--black-border);border-radius:var(--radius);padding:16px;margin-top:16px">' +
      '<p style="font-size:0.75rem;color:var(--grey);margin-bottom:6px">🚚 <strong>Envios:</strong> CABA y GBA en 24-72hs habiles</p>' +
      '<p style="font-size:0.75rem;color:var(--grey)">🏪 <strong>Retiro:</strong> Palermo, CABA - sin costo</p>' +
      '</div></div></div></div>';

    const style = document.createElement('style');
    style.textContent = '.product-detail{max-width:1000px;margin:0 auto}.product-detail-inner{display:flex;flex-direction:column;padding:0 20px 60px;gap:32px}.product-detail-img{background:linear-gradient(135deg,#1a0500,#0d0d0d);border-radius:var(--radius-lg);aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden}.product-detail-img img{width:100%;height:100%;object-fit:cover}@media(min-width:768px){.product-detail-inner{flex-direction:row}.product-detail-img{flex:1}.product-detail-info{flex:1}}';
    document.head.appendChild(style);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      allProducts = await res.json();
      return allProducts;
    } catch {
      allProducts = [
        { id: 'miel-picante-chica', name: 'Miel Picante Fuego Lento', size: 'Frasco Chico', weight: '150g', price: 2800, stock: 25, spiceLevel: 2, description: 'La entrada perfecta al mundo del picante.', image: 'images/miel-chica.jpg', badge: 'Ideal para principiantes', active: true },
        { id: 'miel-picante-mediana', name: 'Miel Picante Brasas', size: 'Frasco Mediano', weight: '300g', price: 4900, stock: 18, spiceLevel: 3, description: 'El equilibrio perfecto.', image: 'images/miel-mediana.jpg', badge: 'Mas vendido', active: true },
        { id: 'miel-picante-grande', name: 'Miel Picante Infierno', size: 'Frasco Grande', weight: '500g', price: 7500, stock: 12, spiceLevel: 5, description: 'Para los valientes.', image: 'images/miel-grande.jpg', badge: 'Nivel extremo', active: true },
        { id: 'miel-picante-regalo', name: 'Kit Degustacion Picante', size: 'Set x3', weight: '3 frascos 150g', price: 9200, stock: 8, spiceLevel: null, description: 'Los tres niveles en un pack.', image: 'images/miel-kit.jpg', badge: 'Ideal para regalo', active: true }
      ];
      return allProducts;
    }
  };

  const renderShop = async (filter) => {
    filter = filter || 'all';
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (!allProducts.length) await loadProducts();
    let filtered = allProducts;
    if (filter === 'individual') filtered = allProducts.filter(p => p.id !== 'miel-picante-regalo');
    if (filter === 'kit') filtered = allProducts.filter(p => p.id === 'miel-picante-regalo');
    grid.innerHTML = filtered.map(renderCard).join('');
  };

  const renderFeatured = async () => {
    const grid = document.getElementById('homeFeaturedProducts');
    if (!grid) return;
    if (!allProducts.length) await loadProducts();
    grid.innerHTML = allProducts.slice(0, 4).map(renderCard).join('');
  };

  const openDetail = (id) => {
    const p = allProducts.find(p => p.id === id);
    if (!p) return;
    window._detailQty = 1;
    renderDetail(p);
    navigate('product');
  };

  const changeDetailQty = (delta) => {
    window._detailQty = Math.max(1, Math.min(10, (window._detailQty || 1) + delta));
    const el = document.getElementById('detailQty');
    if (el) el.textContent = window._detailQty;
  };

  const addToCart = (id) => {
    const p = allProducts.find(p => p.id === id);
    if (p) Cart.add(p, 1);
  };

  const addToCartFromDetail = (id) => {
    const p = allProducts.find(p => p.id === id);
    if (p) Cart.add(p, window._detailQty || 1);
  };

  return { loadProducts, renderShop, renderFeatured, openDetail, changeDetailQty, addToCart, addToCartFromDetail, formatPrice };
})();

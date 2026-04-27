/* =====================================================
   CLUB DEL PICANTE — Carrito
   ===================================================== */

const Cart = (() => {
  let items = [];

  const STORAGE_KEY = 'cdp_cart';

  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      items = saved ? JSON.parse(saved) : [];
    } catch(e) { items = []; }
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  };

  const add = (product, quantity = 1) => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 10);
    } else {
      items.push({ ...product, quantity });
    }
    save();
    showToast(`🛒 ${product.name} agregado`, 'success');
    animateBadge();
  };

  const remove = (productId) => {
    items = items.filter(i => i.id !== productId);
    save();
  };

  const updateQty = (productId, qty) => {
    const item = items.find(i => i.id === productId);
    if (!item) return;
    if (qty <= 0) { remove(productId); return; }
    item.quantity = Math.min(qty, 10);
    save();
  };

  const clear = () => {
    items = [];
    save();
  };

  const getItems = () => [...items];

  const getCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  const getTotal = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const updateBadge = () => {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = getCount();
  };

  const animateBadge = () => {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.classList.add('new');
      setTimeout(() => badge.classList.remove('new'), 600);
    }
  };

  load();
  return { add, remove, updateQty, clear, getItems, getCount, getTotal, updateBadge };
})();

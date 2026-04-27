/* =====================================================
   CLUB DEL PICANTE — Checkout
   ===================================================== */

const Checkout = (() => {
  let deliveryType = 'envio'; // 'envio' | 'retiro'
  const SHIPPING_COST = 1500;
  const FREE_SHIPPING_MIN = 10000;

  const getShippingCost = () => {
    if (deliveryType === 'retiro') return 0;
    const total = Cart.getTotal();
    return total >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  };

  const render = () => {
    const items = Cart.getItems();
    if (!items.length) { navigate('cart'); return; }

    const subtotal = Cart.getTotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;

    const checkoutTarget = document.getElementById('checkoutContainer') || document.getElementById('checkoutInner');
    checkoutTarget.innerHTML = `
      <div style="max-width:600px;margin:0 auto">
        <!-- Sección datos personales -->
        <div class="checkout-section">
          <h3>📝 Tus datos</h3>
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" id="ckName" placeholder="Juan Pérez" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="ckEmail" placeholder="juan@email.com" required />
          </div>
          <div class="form-group">
            <label>Teléfono / WhatsApp</label>
            <input type="tel" id="ckPhone" placeholder="+54 11 1234-5678" />
          </div>
        </div>

        <!-- Tipo de entrega -->
        <div class="checkout-section">
          <h3>🚚 Entrega</h3>
          <div class="delivery-toggle">
            <div class="delivery-option ${deliveryType === 'envio' ? 'selected' : ''}" onclick="Checkout.setDelivery('envio')">
              <div class="delivery-option-icon">🚚</div>
              <div class="delivery-option-name">Envío a domicilio</div>
              <div class="delivery-option-price">${subtotal >= FREE_SHIPPING_MIN ? 'GRATIS' : `$${SHIPPING_COST.toLocaleString('es-AR')}`}</div>
            </div>
            <div class="delivery-option ${deliveryType === 'retiro' ? 'selected' : ''}" onclick="Checkout.setDelivery('retiro')">
              <div class="delivery-option-icon">🏪</div>
              <div class="delivery-option-name">Retiro en punto</div>
              <div class="delivery-option-price">SIN COSTO</div>
            </div>
          </div>
          <div id="shippingFields" style="${deliveryType === 'retiro' ? 'display:none' : ''}">
            <div class="form-group">
              <label>Calle y número</label>
              <input type="text" id="ckAddress" placeholder="Av. Santa Fe 1234" />
            </div>
            <div class="form-group" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <label>Barrio / Localidad</label>
                <input type="text" id="ckNeighborhood" placeholder="Palermo" />
              </div>
              <div>
                <label>Código Postal</label>
                <input type="text" id="ckPostal" placeholder="1425" />
              </div>
            </div>
            <div class="form-group">
              <label>Referencias / Piso / Dpto</label>
              <input type="text" id="ckReference" placeholder="Piso 3B, timbre Rivera" />
            </div>
          </div>
          ${deliveryType === 'retiro' ? `
            <div style="background:var(--black);border-radius:var(--radius-sm);padding:14px;margin-top:12px">
              <p style="font-size:0.85rem;color:var(--grey-light)">📍 <strong>Palermo, CABA</strong></p>
              <p style="font-size:0.8rem;color:var(--grey);margin-top:4px">Te contactamos para coordinar el horario una vez confirmado el pago.</p>
            </div>
          ` : ''}
        </div>

        <!-- Resumen del pedido -->
        <div class="checkout-section">
          <h3>🧾 Resumen</h3>
          ${items.map(i => `
            <div class="checkout-product-row">
              <span>${i.name} × ${i.quantity}</span>
              <span>${Products.formatPrice(i.price * i.quantity)}</span>
            </div>
          `).join('')}
          <div class="checkout-product-row" style="color:var(--grey)">
            <span>Envío</span>
            <span>${shipping === 0 ? '<span style="color:var(--success)">GRATIS</span>' : Products.formatPrice(shipping)}</span>
          </div>
          ${subtotal >= FREE_SHIPPING_MIN && deliveryType === 'envio' ? `<p style="font-size:0.75rem;color:var(--success);margin-top:6px">✓ ¡Envío gratis por superar $${FREE_SHIPPING_MIN.toLocaleString('es-AR')}!</p>` : ''}
          <div class="checkout-total">
            <span>TOTAL</span>
            <span>${Products.formatPrice(total)}</span>
          </div>
        </div>

        <div class="checkout-section" style="background:rgba(244,121,32,0.03);border-color:rgba(244,121,32,0.2)">
          <p style="font-size:0.8rem;color:var(--grey);margin-bottom:16px;text-align:center">
            🔒 Pago 100% seguro con <strong>MercadoPago</strong>. Tarjetas, débito, transferencia y más.
          </p>
          <button class="btn-primary btn-full" onclick="Checkout.submit()">
            <span>Ir a pagar con MercadoPago</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn-ghost btn-full" onclick="navigate('cart')" style="margin-top:10px">← Volver al carrito</button>
        </div>
      </div>
    `;
  };

  const setDelivery = (type) => {
    deliveryType = type;
    render();
  };

  const validate = () => {
    const name = document.getElementById('ckName')?.value.trim();
    const email = document.getElementById('ckEmail')?.value.trim();
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) { showToast('Ingresá tu nombre', 'error'); return false; }
    if (!email || !emailRE.test(email)) { showToast('Ingresá un email válido', 'error'); return false; }
    if (deliveryType === 'envio') {
      const address = document.getElementById('ckAddress')?.value.trim();
      if (!address) { showToast('Ingresá tu dirección', 'error'); return false; }
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    showLoading(true);

    const items = Cart.getItems();
    const subtotal = Cart.getTotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;

    const customer = {
      name: document.getElementById('ckName').value.trim(),
      email: document.getElementById('ckEmail').value.trim(),
      phone: document.getElementById('ckPhone')?.value.trim() || ''
    };

    const shipping_info = deliveryType === 'envio' ? {
      address: document.getElementById('ckAddress')?.value.trim(),
      neighborhood: document.getElementById('ckNeighborhood')?.value.trim(),
      postal: document.getElementById('ckPostal')?.value.trim(),
      reference: document.getElementById('ckReference')?.value.trim()
    } : { note: 'Retiro en punto de entrega - Palermo, CABA' };

    try {
      // 1. Crear el pedido
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items, shipping: shipping_info, total, deliveryType })
      });
      const orderData = await orderRes.json();
      const orderId = orderData.orderId;

      // 2. Crear preferencia de MP
      const mpRes = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          items: items.map(i => ({ ...i, price: i.price })),
          payer: { name: customer.name, email: customer.email }
        })
      });
      const mpData = await mpRes.json();

      showLoading(false);

      if (mpData.demo) {
        // Modo demo — simular pago exitoso
        showToast('🎉 Modo demo: simulando pago...', 'success');
        await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status: 'approved' })
        });
        Cart.clear();
        navigate('pago-exitoso');
        document.getElementById('successOrderInfo').innerHTML = `
          <p><strong>Pedido #${orderId.slice(0, 8).toUpperCase()}</strong></p>
          <p>Te vamos a contactar a <strong>${customer.email}</strong> con los detalles.</p>
          ${deliveryType === 'envio' ? `<p>Envío a: ${shipping_info.address}, ${shipping_info.neighborhood}</p>` : '<p>Retiro: Palermo, CABA (te coordinamos horario)</p>'}
        `;
      } else {
        // Redirect real a MercadoPago
        window.location.href = mpData.sandbox_init_point || mpData.init_point;
      }
    } catch (err) {
      showLoading(false);
      showToast('Error al procesar. Intentá de nuevo.', 'error');
      console.error(err);
    }
  };

  return { render, setDelivery, submit };
})();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const auth = (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
    req.user = decoded; next();
  } catch { res.status(401).json({ error: 'Token invalido' }); }
};

router.get('/stats', auth, async (req, res) => {
  try {
    const allOrders = (await pool.query('SELECT * FROM orders ORDER BY created_at DESC')).rows;
    const confirmed = allOrders.filter(o => o.status === 'confirmado');
    const totalRevenue = confirmed.reduce((s, o) => s + o.total, 0);
    const today = new Date().toDateString();
    const todayOrders = allOrders.filter(o => new Date(o.created_at).toDateString() === today);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      const dayOrders = confirmed.filter(o => new Date(o.created_at).toDateString() === ds);
      last7Days.push({ date: d.toLocaleDateString('es-AR', { weekday: 'short' }), orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + o.total, 0) });
    }

    const productSales = {};
    confirmed.forEach(o => (o.items || []).forEach(i => { productSales[i.name] = (productSales[i.name] || 0) + i.quantity; }));
    const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
    const lowStock = (await pool.query('SELECT * FROM products WHERE stock <= 5 AND active = true')).rows;

    res.json({
      totalOrders: allOrders.length, confirmedOrders: confirmed.length,
      pendingOrders: allOrders.filter(o => ['pendiente_pago','pago_pendiente'].includes(o.status)).length,
      todayOrders: todayOrders.length, totalRevenue, last7Days,
      topProduct: topProduct ? { name: topProduct[0], quantity: topProduct[1] } : null,
      lowStockProducts: lowStock.map(p => ({ name: p.name, stock: p.stock }))
    });
  } catch (err) { res.status(500).json({ error: 'Error stats' }); }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let q = 'SELECT * FROM orders';
    const params = [];
    if (status) { q += ' WHERE status = $1'; params.push(status); }
    q += ' ORDER BY created_at DESC LIMIT $' + (params.length+1) + ' OFFSET $' + (params.length+2);
    params.push(parseInt(limit), (page-1)*parseInt(limit));
    const { rows } = await pool.query(q, params);
    const total = parseInt((await pool.query('SELECT COUNT(*) as c FROM orders' + (status ? ' WHERE status=$1' : ''), status ? [status] : [])).rows[0].c);
    const orders = rows.map(o => ({ id: o.id, customer: o.customer, items: o.items, shipping: o.shipping, total: o.total, deliveryType: o.delivery_type, status: o.status, paymentId: o.payment_id, createdAt: o.created_at }));
    res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { res.status(500).json({ error: 'Error pedidos' }); }
});

router.patch('/orders/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const sets = []; const vals = [];
    if (status) { sets.push('status=$' + (sets.length+1)); vals.push(status); }
    if (notes) { sets.push('admin_notes=$' + (sets.length+1)); vals.push(notes); }
    sets.push('updated_at=NOW()');
    vals.push(req.params.id);
    const { rows } = await pool.query('UPDATE orders SET ' + sets.join(',') + ' WHERE id=$' + vals.length + ' RETURNING *', vals);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    const o = rows[0];
    res.json({ id: o.id, customer: o.customer, items: o.items, total: o.total, status: o.status, createdAt: o.created_at });
  } catch (err) { res.status(500).json({ error: 'Error actualizar' }); }
});

router.get('/products', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY price ASC');
    res.json(rows.map(r => ({ id: r.id, name: r.name, size: r.size, weight: r.weight, price: r.price, stock: r.stock, spiceLevel: r.spice_level, image: r.image, badge: r.badge, active: r.active })));
  } catch (err) { res.status(500).json({ error: 'Error productos' }); }
});

router.patch('/products/:id', auth, async (req, res) => {
  try {
    const { price, stock, active, description, badge } = req.body;
    const sets = []; const vals = [];
    if (price !== undefined) { sets.push('price=$' + (sets.length+1)); vals.push(price); }
    if (stock !== undefined) { sets.push('stock=$' + (sets.length+1)); vals.push(stock); }
    if (active !== undefined) { sets.push('active=$' + (sets.length+1)); vals.push(active); }
    if (description !== undefined) { sets.push('description=$' + (sets.length+1)); vals.push(description); }
    if (badge !== undefined) { sets.push('badge=$' + (sets.length+1)); vals.push(badge); }
    if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' });
    vals.push(req.params.id);
    const { rows } = await pool.query('UPDATE products SET ' + sets.join(',') + ' WHERE id=$' + vals.length + ' RETURNING *', vals);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error actualizar producto' }); }
});

module.exports = router;

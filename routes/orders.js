const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { customer, items, shipping, total, deliveryType } = req.body;
    if (!customer || !items || !total) return res.status(400).json({ error: 'Datos incompletos' });
    const { rows } = await pool.query(
      'INSERT INTO orders (customer, items, shipping, total, delivery_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [JSON.stringify(customer), JSON.stringify(items), JSON.stringify(shipping), total, deliveryType || 'envio']
    );
    const order = rows[0];
    res.status(201).json({ orderId: order.id, order: { ...order, id: order.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    const o = rows[0];
    res.json({ id: o.id, customer: o.customer, items: o.items, shipping: o.shipping, total: o.total, deliveryType: o.delivery_type, status: o.status, paymentId: o.payment_id, createdAt: o.created_at });
  } catch (err) {
    res.status(500).json({ error: 'Error al leer pedido' });
  }
});

module.exports = router;

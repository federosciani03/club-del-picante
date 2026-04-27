const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/create-preference', async (req, res) => {
  try {
    const { orderId, items, payer } = req.body;
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    if (!accessToken || accessToken === 'TU_ACCESS_TOKEN_DE_MERCADOPAGO') {
      return res.json({
        id: 'demo-' + Date.now(),
        init_point: siteUrl + '/pago-exitoso?order=' + orderId + '&demo=true',
        sandbox_init_point: siteUrl + '/pago-exitoso?order=' + orderId + '&demo=true',
        demo: true
      });
    }

    const mercadopago = require('mercadopago');
    mercadopago.configure({ access_token: accessToken });
    const result = await mercadopago.preferences.create({
      items: items.map(i => ({ id: i.id, title: i.name, quantity: Number(i.quantity), unit_price: Number(i.price), currency_id: 'ARS' })),
      payer: { name: (payer && payer.name) || '', email: (payer && payer.email) || '' },
      back_urls: { success: siteUrl + '/pago-exitoso?order=' + orderId, failure: siteUrl + '/pago-fallido?order=' + orderId, pending: siteUrl + '/pago-pendiente?order=' + orderId },
      auto_return: 'approved', external_reference: orderId,
      notification_url: siteUrl + '/api/payment/webhook',
      statement_descriptor: 'CLUB DEL PICANTE', payment_methods: { installments: 3 }
    });
    res.json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Error MP', details: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (type === 'payment' && accessToken && accessToken !== 'TU_ACCESS_TOKEN_DE_MERCADOPAGO') {
      const mercadopago = require('mercadopago');
      mercadopago.configure({ access_token: accessToken });
      const pd = await mercadopago.payment.get(data.id);
      const status = pd.body.status === 'approved' ? 'confirmado' : pd.body.status === 'rejected' ? 'pago_rechazado' : 'pago_pendiente';
      await pool.query('UPDATE orders SET status=$1, payment_id=$2, payment_status=$3, updated_at=NOW() WHERE id=$4', [status, data.id, pd.body.status, pd.body.external_reference]);
    }
    res.sendStatus(200);
  } catch { res.sendStatus(500); }
});

router.post('/confirm', async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;
    const newStatus = (status === 'approved' || !status) ? 'confirmado' : 'pago_pendiente';
    await pool.query('UPDATE orders SET status=$1, payment_id=$2, payment_status=$3, updated_at=NOW() WHERE id=$4', [newStatus, paymentId || 'demo', status || 'approved', orderId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al confirmar' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const FALLBACK = [
  { id: 'miel-picante-chica', name: 'Miel Picante Fuego Lento', size: 'Frasco Chico', weight: '150g', price: 2800, stock: 25, spiceLevel: 2, description: 'La entrada perfecta.', image: '/images/miel-chica.jpg', badge: 'Ideal para principiantes', active: true },
  { id: 'miel-picante-mediana', name: 'Miel Picante Brasas', size: 'Frasco Mediano', weight: '300g', price: 4900, stock: 18, spiceLevel: 3, description: 'El equilibrio perfecto.', image: '/images/miel-mediana.jpg', badge: 'Mas vendido', active: true },
  { id: 'miel-picante-grande', name: 'Miel Picante Infierno', size: 'Frasco Grande', weight: '500g', price: 7500, stock: 12, spiceLevel: 5, description: 'Para los valientes.', image: '/images/miel-grande.jpg', badge: 'Nivel extremo', active: true },
  { id: 'miel-picante-regalo', name: 'Kit Degustacion Picante', size: 'Set x3', weight: '3 frascos 150g', price: 9200, stock: 8, spiceLevel: null, description: 'Los tres niveles en un pack.', image: '/images/miel-kit.jpg', badge: 'Ideal para regalo', active: true }
];

const toProduct = r => ({ id: r.id, name: r.name, size: r.size, weight: r.weight, price: r.price, stock: r.stock, spiceLevel: r.spice_level, description: r.description, image: r.image, badge: r.badge, active: r.active });

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE active = true ORDER BY price ASC');
    res.json(rows.length ? rows.map(toProduct) : FALLBACK);
  } catch { res.json(FALLBACK); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(toProduct(rows[0]));
  } catch {
    const p = FALLBACK.find(p => p.id === req.params.id);
    return p ? res.json(p) : res.status(404).json({ error: 'No encontrado' });
  }
});

module.exports = router;

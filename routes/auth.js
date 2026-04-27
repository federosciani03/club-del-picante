const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@clubdelpicante.com.ar';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ClubPicante2024!';

    if (email !== adminEmail) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // En producción, la contraseña debería estar hasheada en .env
    const isValid = password === adminPassword;
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    res.json({ token, message: 'Login exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Verificar token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;

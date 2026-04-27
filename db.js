const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
});

let dbReady = false;

async function initDB() {
  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(200),
        size VARCHAR(100),
        weight VARCHAR(50),
        price INTEGER,
        stock INTEGER DEFAULT 0,
        spice_level INTEGER,
        description TEXT,
        image VARCHAR(300),
        badge VARCHAR(100),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer JSONB,
        items JSONB,
        shipping JSONB,
        total INTEGER,
        delivery_type VARCHAR(20) DEFAULT 'envio',
        status VARCHAR(50) DEFAULT 'pendiente_pago',
        payment_id VARCHAR(100),
        payment_status VARCHAR(50),
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const { rows } = await client.query('SELECT COUNT(*) as c FROM products');
    if (parseInt(rows[0].c) === 0) {
      await client.query(`
        INSERT INTO products (id, name, size, weight, price, stock, spice_level, description, image, badge, active) VALUES
        ('miel-picante-chica', 'Miel Picante Fuego Lento', 'Frasco Chico', '150g', 2800, 25, 2, 'La entrada perfecta.', '/images/miel-chica.jpg', 'Ideal para principiantes', true),
        ('miel-picante-mediana', 'Miel Picante Brasas', 'Frasco Mediano', '300g', 4900, 18, 3, 'El equilibrio perfecto.', '/images/miel-mediana.jpg', 'Mas vendido', true),
        ('miel-picante-grande', 'Miel Picante Infierno', 'Frasco Grande', '500g', 7500, 12, 5, 'Para los valientes.', '/images/miel-grande.jpg', 'Nivel extremo', true),
        ('miel-picante-regalo', 'Kit Degustacion Picante', 'Set x3', '3 frascos 150g', 9200, 8, NULL, 'Los tres niveles en un pack.', '/images/miel-kit.jpg', 'Ideal para regalo', true)
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('Productos iniciales cargados');
    }

    client.release();
    dbReady = true;
    console.log('Base de datos Supabase conectada');
  } catch (err) {
    console.log('DB no disponible, usando fallback:', err.message);
    dbReady = false;
  }
}

function isReady() { return dbReady; }

module.exports = { pool, initDB, isReady };

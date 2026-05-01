// src/db/init.js - Database initialization
// Creates tables and seeds mock data
import pg from 'pg';
const { Pool } = pg;

async function initDB() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔧 Initializing database...');

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        color_primary VARCHAR(20),
        color_background VARCHAR(20),
        color_text VARCHAR(20),
        color_accent VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Products table created');

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(255),
        user_location VARCHAR(255),
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        paypal_order_id VARCHAR(255),
        paypal_capture_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Orders table created');

    await pool.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS paypal_capture_id VARCHAR(255)
    `);
    console.log('✅ Orders payment columns ensured');

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1
      )
    `);
    console.log('✅ Order items table created');

    // Seed products (only if empty)
    const { rows: existing } = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(existing[0].count) === 0) {
      const products = [
        ['Guantes de Nitrilo', 15, 'Guantes desechables de alta resistencia para procedimientos clínicos.', '#2B6CB0', '#EBF8FF', '#1A365D', '#BEE3F8'],
        ['Mascarilla N95', 25, 'Mascarilla de protección respiratoria con filtro de partículas.', '#276749', '#F0FFF4', '#1C4532', '#C6F6D5'],
        ['Jeringa 10ml', 5, 'Jeringa desechable de precisión con émbolo suave.', '#C05A21', '#FFFAF0', '#7B341E', '#FEEBC8'],
        ['Bisturí Quirúrgico', 12, 'Instrumento de corte estéril con mango ergonómico.', '#702459', '#FFF5F7', '#521B41', '#FED7E2'],
        ['Vendaje Elástico', 8, 'Vendaje adaptable para inmovilización y compresión muscular.', '#D69E2E', '#FFFFF0', '#744210', '#FEFCBF'],
        ['Catéter Intravenoso', 18, 'Catéter flexible para administración de fluidos y medicamentos.', '#553C9A', '#FAF5FF', '#322659', '#E9D8FD'],
      ];

      for (const p of products) {
        await pool.query(
          'INSERT INTO products (name, price, description, color_primary, color_background, color_text, color_accent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          p
        );
      }
      console.log('✅ Seeded 6 products');
    } else {
      console.log('ℹ️ Products already exist, skipping seed');
    }

    console.log('🎉 Database initialized successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database init error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

initDB();

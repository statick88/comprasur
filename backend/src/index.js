// backend/src/index.js
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection for initialization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureOrderPaymentColumns() {
  await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS paypal_capture_id VARCHAR(255)
  `);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start server
if (process.env.NODE_ENV !== 'test') {
  ensureOrderPaymentColumns()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🩺 Comprasur API running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ Failed to prepare database schema:', error.message);
      process.exit(1);
    });
}

export default app;

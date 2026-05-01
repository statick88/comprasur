// backend/src/controllers/orderController.js
import pg from 'pg';
import fetch from 'node-fetch';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const PAYPAL = {
  base: process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com',
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
};

async function getPayPalAccessToken() {
  if (!PAYPAL.clientId || !PAYPAL.clientSecret) {
    throw new Error('PayPal credentials are missing');
  }

  const auth = Buffer.from(`${PAYPAL.clientId}:${PAYPAL.clientSecret}`).toString('base64');
  const response = await fetch(`${PAYPAL.base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data?.error_description || 'Failed to obtain PayPal access token');
  }
  return data.access_token;
}

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_name, user_location, items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    await client.query('BEGIN');
    
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const orderResult = await client.query(
      'INSERT INTO orders (user_name, user_location, total) VALUES ($1, $2, $3) RETURNING id',
      [user_name, user_location, total]
    );
    const orderId = orderResult.rows[0].id;
    
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.name, item.price, item.quantity]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({ 
      id: orderId, 
      total, 
      status: 'pending',
      created_at: new Date().toISOString() 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.*, json_agg(json_build_object(
        'product_id', oi.product_id,
        'product_name', oi.product_name,
        'price', oi.price,
        'quantity', oi.quantity
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPayPalOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_name, user_location, items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await client.query('BEGIN');
    const orderResult = await client.query(
      'INSERT INTO orders (user_name, user_location, total) VALUES ($1, $2, $3) RETURNING id',
      [user_name, user_location, total]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.name, item.price, item.quantity]
      );
    }

    const accessToken = await getPayPalAccessToken();
    
    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId.toString(),
        description: 'Compra de insumos médicos - Comprasur',
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'Comprasur',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'comprasur://paypal/success',
        cancel_url: 'comprasur://paypal/cancel',
      },
    };

    const ppResponse = await fetch(`${PAYPAL.base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paypalOrder),
    });

    const ppData = await ppResponse.json();
    
    if (!ppResponse.ok) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: ppData });
    }

    const approveLink = ppData.links?.find((l) => l.rel === 'approve');

    if (!approveLink?.href) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'PayPal approval link not found' });
    }

    await client.query(
      'UPDATE orders SET paypal_order_id = $1 WHERE id = $2',
      [ppData.id, orderId]
    );
    await client.query('COMMIT');
    
    res.json({
      db_order_id: orderId,
      paypal_order_id: ppData.id,
      status: ppData.status,
      approve_url: approveLink.href,
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const capturePayPalOrder = async (req, res) => {
  const { orderID } = req.params;
  
  try {
    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(`${PAYPAL.base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      return res.status(400).json({ error: captureData });
    }

    const ppStatus = captureData.status;
    if (ppStatus === 'COMPLETED') {
      const purchaseUnit = captureData.purchase_units?.[0];
      const referenceId = purchaseUnit?.reference_id;
      const captureId = purchaseUnit?.payments?.captures?.[0]?.id || captureData.id;
      
      if (referenceId) {
        await pool.query(
          "UPDATE orders SET status = 'completed', paypal_capture_id = $1 WHERE id = $2",
          [captureId, referenceId]
        );
      }
    }

    res.json({
      status: captureData.status,
      transaction_id: captureData.id,
      purchase_units: captureData.purchase_units,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

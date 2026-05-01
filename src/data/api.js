// src/data/api.js - API Client for Comprasur
const API_URL = 'http://192.168.0.106:3000';

// Fetch all products
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Search products
export async function searchProducts(query) {
  const res = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search products');
  return res.json();
}

// Get single product
export async function fetchProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

// Create order
export async function createOrder({ user_name, user_location, items }) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name, user_location, items }),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

// Get all orders (for admin/testing)
export async function fetchOrders() {
  const res = await fetch(`${API_URL}/api/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

// Create PayPal order
export async function createPayPalOrder({ user_name, user_location, items }) {
  const res = await fetch(`${API_URL}/api/paypal/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name, user_location, items }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to create PayPal order');
  }
  return res.json();
}

// Capture PayPal order
export async function capturePayPalOrder(paypalOrderId) {
  const res = await fetch(`${API_URL}/api/paypal/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to capture PayPal order');
  }
  return res.json();
}
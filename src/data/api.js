// src/data/api.js - API Client for Comprasur
import { API_URL } from './config';

/**
 * Generic API wrapper for better error handling and centralized logging
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    console.log(`[API] Request: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP Error ${response.status}`;
      console.error(`[API] Error ${response.status}: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message === 'Network request failed') {
      console.error('[API] Network Error: Please check your connection or API_URL.');
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
    throw error;
  }
}

// Fetch all products
export async function fetchProducts() {
  return request('/api/products');
}

// Search products
export async function searchProducts(query) {
  return request(`/api/products/search?q=${encodeURIComponent(query)}`);
}

// Get single product
export async function fetchProduct(id) {
  return request(`/api/products/${id}`);
}

// Create order
export async function createOrder({ user_name, user_location, items }) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ user_name, user_location, items }),
  });
}

// Get all orders (for admin/testing)
export async function fetchOrders() {
  return request('/api/orders');
}

// Create PayPal order
export async function createPayPalOrder({ user_name, user_location, items }) {
  const order = await request('/api/orders/paypal', {
    method: 'POST',
    body: JSON.stringify({ user_name, user_location, items })
  });

  if (order.status !== 'CREATED') {
    throw new Error('Failed to create PayPal order');
  }

  return order;
} {
  return request('/api/orders/paypal', {
    method: 'POST',
    body: JSON.stringify({ user_name, user_location, items }),
  });
}

// Capture PayPal order
export async function capturePayPalOrder(paypalOrderId, orderId) {
  const capture = await request(`/api/orders/paypal/${paypalOrderId}/capture`, {
    method: 'POST',
  });

  if (capture.status !== 'COMPLETED') {
    throw new Error('Failed to complete PayPal payment');
  }

  // Store the completed order
  await request(`/api/orders/${orderId}/paypal-complete`, {
    method: 'POST',
    body: JSON.stringify({ capture })
  });

  return capture;
}

// backend/src/index.test.js
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './index.js';

// Mock pg to avoid DB connection during tests
vi.mock('pg', () => {
  const mPool = {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: vi.fn().mockResolvedValue({
      query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: vi.fn(),
    }),
  };
  // Using a function that acts as a constructor
  const Pool = function() {
    return mPool;
  };
  return { Pool, default: { Pool } };
});

describe('API Health Check', () => {
  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Product Routes', () => {
  it('should return 200 for /api/products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

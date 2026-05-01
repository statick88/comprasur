// backend/src/index.test.js
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';

const poolQuery = vi.fn();
const clientQuery = vi.fn();
const clientRelease = vi.fn();
const poolConnect = vi.fn(async () => ({
  query: clientQuery,
  release: clientRelease,
}));

vi.mock('pg', () => {
  const Pool = function () {
    return {
      query: poolQuery,
      connect: poolConnect,
    };
  };

  return { Pool, default: { Pool } };
});

function createMockResponse() {
  let statusCode = 200;
  let jsonBody;
  let sentBody;

  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      jsonBody = payload;
      return this;
    },
    send(payload) {
      sentBody = payload;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
    get sentBody() {
      return sentBody;
    },
  };
}

describe('API wiring', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('registers health and API routes without starting a server', async () => {
    const { default: app } = await import('./index.js');
    const stack = app?._router?.stack ?? [];

    expect(
      stack.some((layer) => layer.route?.path === '/health' && layer.route.methods?.get)
    ).toBe(true);
    expect(stack.some((layer) => layer.regexp?.test?.('/api/products'))).toBe(true);
    expect(stack.some((layer) => layer.regexp?.test?.('/api/orders'))).toBe(true);
  });
});

describe('Product controller', () => {
  beforeEach(() => {
    vi.resetModules();
    poolQuery.mockReset();
  });

  it('returns products from the database', async () => {
    const rows = [{ id: 1, name: 'Guantes de Nitrilo' }];
    poolQuery.mockResolvedValueOnce({ rows });

    const { getProducts } = await import('./controllers/productController.js');
    const res = createMockResponse();

    await getProducts({}, res);

    expect(poolQuery).toHaveBeenCalledWith('SELECT * FROM products ORDER BY id');
    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual(rows);
  });
});

describe('Order validation middleware', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('rejects invalid order payloads with 400', async () => {
    const { validate, orderSchema } = await import('./middleware/validate.js');
    const middleware = validate(orderSchema);
    const req = {
      body: { user_name: 'Di', items: [] },
      query: {},
      params: {},
    };
    const res = createMockResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.jsonBody.error).toBe('Validation failed');
    expect(res.jsonBody.details.length).toBeGreaterThan(0);
  });
});

describe('Order controller', () => {
  beforeEach(() => {
    vi.resetModules();
    poolConnect.mockClear();
    clientQuery.mockReset();
    clientRelease.mockReset();
  });

  it('creates a local order and persists its items', async () => {
    clientQuery
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ rows: [{ id: 7 }] })
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);

    const { createOrder } = await import('./controllers/orderController.js');
    const req = {
      body: {
        user_name: 'Diego',
        user_location: 'Quito, Ecuador',
        items: [{ id: 1, name: 'Guantes de Nitrilo', price: 15, quantity: 2 }],
      },
    };
    const res = createMockResponse();

    await createOrder(req, res);

    expect(poolConnect).toHaveBeenCalledTimes(1);
    expect(clientQuery).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(clientQuery).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO orders (user_name, user_location, total) VALUES ($1, $2, $3) RETURNING id',
      ['Diego', 'Quito, Ecuador', 30]
    );
    expect(clientQuery).toHaveBeenNthCalledWith(
      3,
      'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)',
      [7, 1, 'Guantes de Nitrilo', 15, 2]
    );
    expect(clientQuery).toHaveBeenNthCalledWith(4, 'COMMIT');
    expect(clientRelease).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toMatchObject({
      id: 7,
      total: 30,
      status: 'pending',
    });
  });
});

// backend/src/middleware/validate.js
import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const details = error.issues || error.errors || [];
    return res.status(400).json({
      error: 'Validation failed',
      details: details.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};

// Specific schemas
export const orderSchema = z.object({
  body: z.object({
    user_name: z.string().min(3, 'Name is too short'),
    user_location: z.string().min(5, 'Location is too short'),
    items: z.array(z.object({
      id: z.number(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })).min(1, 'At least one item is required'),
  }),
});

// backend/src/routes/orderRoutes.js
import express from 'express';
import { createOrder, getOrders, createPayPalOrder, capturePayPalOrder } from '../controllers/orderController.js';
import { validate, orderSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validate(orderSchema), createOrder);
router.get('/', getOrders);
router.post('/paypal', validate(orderSchema), createPayPalOrder);
router.post('/paypal/:orderID/capture', capturePayPalOrder);

export default router;

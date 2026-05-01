// backend/src/routes/orderRoutes.js
import express from 'express';
import { createOrder, getOrders, createPayPalOrder, capturePayPalOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.post('/paypal', createPayPalOrder);
router.post('/paypal/:orderID/capture', capturePayPalOrder);

export default router;

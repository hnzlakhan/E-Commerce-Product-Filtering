import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  payOrder,
  
  
} from '../controllers/orders.js';
import { authHandler, isAdmin } from '../middlewares/authHandler.js';

const router = express.Router();

router.post('/', authHandler, createOrder);

router.get('/', authHandler, getOrders);


router.get('/:id', authHandler, getOrderById);



// router.get('/:id', authHandler, getAllOrders);

router.post('/:id/pay', authHandler, payOrder);



export default router;

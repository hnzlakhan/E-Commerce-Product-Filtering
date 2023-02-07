import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  getProductsBySearch,

  updateProduct,

  deleteProduct,


} from '../controllers/products.js';
import { authHandler, isAdmin } from '../middlewares/authHandler.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProductById);


router.post('/search-products', getProductsBySearch);

router.post('/', authHandler, isAdmin, createProduct);

router.delete('/:id', authHandler, isAdmin, deleteProduct);

router.put('/:id', authHandler, isAdmin, updateProduct);

export default router;

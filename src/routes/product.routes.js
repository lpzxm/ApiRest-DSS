import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authToken, createProduct);
router.put('/:id', authToken, updateProduct);
router.delete('/:id', authToken, deleteProduct);
export default router;
import express from 'express';
import { addProduct, getActiveProduct, getProductById, updateProduct

 } from "../controllers/productController.js";
import { upload } from '../middleware/uploads.js';

const router = express.Router();

router.get('/products', getActiveProduct)
router.get('/product/:id', getProductById)
router.post('/addproduct',upload.array("images", 5), addProduct)
router.post('/product/:id',updateProduct)

export default router;
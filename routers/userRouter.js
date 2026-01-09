import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getOrders, placeOrder, updatePassword, updateUser, } from '../controllers/userController.js';

const router = express.Router();

router.post("/updateUser",verifyToken,updateUser)
router.post("/updatePassword",verifyToken,updatePassword)
router.post("/placeorder",verifyToken,placeOrder)
router.get("/getorders",verifyToken,getOrders)
export default router;
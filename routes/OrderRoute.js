import express from "express";
import { getOrders, createOrder } from "../controllers/OrderController.js";
import { verifyUser } from "../middleware/AuthUser.js"; // Import Satpam

const router = express.Router();

router.get('/orders', verifyUser, getOrders);
router.post('/orders', verifyUser, createOrder);

export default router;
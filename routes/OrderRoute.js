import express from "express";
import { getOrders,
    getOrderById,
    getOrderByResi, 
    createOrder 
    } from "../controllers/OrderController.js";
import { verifyUser } from "../middleware/AuthUser.js"; // Import Satpam

const router = express.Router();

router.get('/orders', verifyUser, getOrders);
router.post('/orders', verifyUser, createOrder);
router.get('/orders/:id', getOrderById);
router.get('/orders/track/:resi_code', getOrderByResi);

export default router;
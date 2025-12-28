import express from "express";
import { getOrders,
    getOrderById,
    getOrderByResi,
    createOrder, 
    acceptOrder,
    updateStatus,
    cancelOrder
    } from "../controllers/OrderController.js";
import { verifyUser } from "../middleware/AuthUser.js"; // Import Satpam
import { verifyDriver } from "../middleware/AuthDriver.js"; // Import Satpam

const router = express.Router();

router.get('/orders', verifyUser, getOrders);
router.post('/orders', verifyUser, createOrder);
router.get('/orders/:id', getOrderById);
router.get('/orders/track/:resi_code', getOrderByResi);
router.patch('/orders/:id/accept', verifyDriver, acceptOrder);
router.patch('/orders/:id', updateStatus);
router.delete('/orders/:id', verifyUser, cancelOrder);

export default router;
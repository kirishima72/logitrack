import express from "express";
import {
    getOrders,
    getOrderById,
    getOrderByResi,
    createOrder,
    acceptOrder,
    updateStatus,
    cancelOrder,
    finishOrder
} from "../controllers/OrderController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"; // Import Satpam
import { verifyDriver } from "../middleware/AuthDriver.js"; // Import Satpam
import { validateCreateOrder } from "../middleware/Validator.js"; // validator Order

const router = express.Router();

router.get("/orders", verifyUser, getOrders);
router.post("/orders", verifyUser, validateCreateOrder, createOrder);
router.get("/orders/:id", getOrderById);
router.get("/orders/track/:resi_code", getOrderByResi);
router.patch("/orders/:id/accept", verifyDriver, acceptOrder);
router.patch("/orders/:id", verifyUser, adminOnly, updateStatus);
router.delete("/orders/:id", verifyUser, cancelOrder);
router.patch('/orders/:id/finish', verifyDriver, finishOrder);

export default router;

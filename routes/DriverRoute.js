import express from "express";
import {
    registerDriver,
    loginDriver,
    getCurrentDriver,
    logOutDriver } from "../controllers/DriverController.js";
import { acceptOrder } from "../controllers/OrderController.js";
import { verifyDriver } from "../middleware/AuthDriver.js";

const router = express.Router();

// router.get('/drivers', verifyDriver, getDrivers); // DIJAGA 2 SATPAM (Login + Admin)
router.post("/drivers", registerDriver);
router.post("/drivers/login", loginDriver);

router.get('/drivers/get-current-driver', verifyDriver, getCurrentDriver); // DIJAGA 1 SATPAM (Login doang)

router.patch('/orders/:id/accept', verifyDriver, acceptOrder);

router.delete('/drivers/logout', logOutDriver);  // Logout

export default router;
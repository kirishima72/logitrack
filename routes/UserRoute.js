import express from "express";
import { 
    getUsers, 
    getCurrentLogin,
    register, 
    login,
    getCurrentUser,
    activateDriver,
    logOut } from "../controllers/UserController.js";
import { getDashboardStats } from "../controllers/AdminController.js";
import { getDrivers } from "../controllers/DriverController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/users/login", login);

router.get('/get-current-login', getCurrentLogin);

router.post("/users", register);
router.get('/users', verifyUser, adminOnly, getUsers); // DIJAGA 2 SATPAM (Login + Admin)
router.get('/users/drivers', verifyUser, adminOnly, getDrivers); // DIJAGA 2 SATPAM (Login + Admin)
router.get('/users/get-current-user', verifyUser, getCurrentUser); // DIJAGA 1 SATPAM (Login doang)
router.post('/users/activate-driver', verifyUser, adminOnly, activateDriver); // DIJAGA 2 SATPAM (Login + Admin)

router.delete('/users/logout', logOut);  // Logout

router.get('/admin/dashboard', verifyUser, adminOnly, getDashboardStats);

// router.get("/users", getUsers); // Nanti bisa diakses di GET http://localhost:5000/users

export default router;

import express from "express";
import { 
    getUsers, 
    register, 
    login,
    getCurrentUser,
    logOut } from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers); // DIJAGA 2 SATPAM (Login + Admin)
router.post("/users", register);
router.post("/login", login);

router.get('/get-current-user', verifyUser, getCurrentUser); // DIJAGA 1 SATPAM (Login doang)
router.delete('/logout', logOut);  // Logout

// router.get("/users", getUsers); // Nanti bisa diakses di GET http://localhost:5000/users

export default router;

// routes/user.routes.js

import express from 'express';
import {
    register,
    login,
    getAllUsers,
    getSingleUser,
    removeUser,
    updateUser,
    forgetPasword,
    verifyOtp,
    checkOut,
    checkIn,
    countUsers,
} from '../controllers/user.controller.js';
import { authenticateUser, checkUserRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post("/user", register);
router.post("/user/login", login);
router.post("/user/forget", forgetPasword);
router.post('/user/verifyOtp', verifyOtp);

// Protected routes for admin only
router.get("/admin/countUsers", authenticateUser, checkUserRole('admin'), countUsers);
router.get("/admin/getAllUsers", authenticateUser, checkUserRole('admin'), getAllUsers);
router.delete("/user/removeUser/:id", authenticateUser, checkUserRole('admin'), removeUser);

// Protected routes for all authenticated users
router.get("/user/getAllUsers", authenticateUser, getAllUsers);
router.get("/user/getSingleUser/:id", authenticateUser, getSingleUser);
router.put("/user/updateUser/:id", authenticateUser, updateUser);

// Protected routes for check-in and check-out
router.post("/user/checkOut/:id", authenticateUser, checkOut);
router.post("/user/checkIn/:id", authenticateUser, checkIn);

export default router;

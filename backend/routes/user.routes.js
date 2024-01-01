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
    getAllCounters
} from '../controllers/user.controller.js';
import { authenticateUser, checkUserRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post("/user", register);
router.post("/user/login", login);

// Protected routes for admin only
router.post("/admin/storeAttendanceCounts",getAllCounters);
router.get("/admin/getAllUsers",  getAllUsers);
// router.get("/admin/getAllUsers", authenticateUser, checkUserRole('admin'), getAllUsers);

// Protected routes for user and admin


// Count users
router.get("/user/countUsers", countUsers);

// ... existing routes and export ...

router.get("/user/getAllUsers", authenticateUser, checkUserRole(['user', 'admin']), getAllUsers);
router.get("/user/getSingleUser/:id", authenticateUser, getSingleUser);
router.delete("/user/removeUser/:id", authenticateUser, checkUserRole('admin'), removeUser);
router.put("/user/updateUser/:id", authenticateUser, updateUser);

// New routes for check-in and check-out
router.post("/user/checkOut/:id", authenticateUser, checkOut);
router.post("/user/checkIn/:id", authenticateUser, checkIn);


router.post("/user/forget", forgetPasword);
router.post('/user/verifyOtp', verifyOtp);

export default router;

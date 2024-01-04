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


// Protected routes for admin only
router.get("/admin/countUsers", countUsers);
router.get("/admin/getAllUsers", authenticateUser, checkUserRole('admin'), getAllUsers);

router.get("/user/getAllUsers", authenticateUser, getAllUsers);
router.get("/user/getSingleUser/:id", authenticateUser, checkUserRole('user'), getSingleUser);
router.delete("/user/removeUser/:id", authenticateUser, checkUserRole('admin'), removeUser);
router.put("/user/updateUser/:id", authenticateUser, updateUser);

//  routes for check-in and check-out
router.post("/user/checkOut/:id", checkOut);
router.post("/user/checkIn/:id", checkIn);


router.post("/user/forget", forgetPasword);
router.post('/user/verifyOtp', verifyOtp);

export default router;

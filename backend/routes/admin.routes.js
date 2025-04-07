import express from 'express';
import { authenticateUser, checkUserRole } from '../middleware/auth.js';
import { getAllUsers, countUsers } from '../controllers/user.controller.js';

const router = express.Router();

// Protected admin routes
router.get('/getAllUsers', authenticateUser, checkUserRole('admin'), getAllUsers);
router.get('/countUsers', authenticateUser, checkUserRole('admin'), countUsers);

export default router; 
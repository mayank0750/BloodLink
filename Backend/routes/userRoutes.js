import express from 'express';
import { loginUser, verifyOTP, getMe } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRoutes = express.Router();

// Public routes
userRoutes.post('/login', loginUser);
userRoutes.post('/verify-otp', verifyOTP);

// Protected routes
userRoutes.get('/me', protect, getMe);

export default userRoutes;

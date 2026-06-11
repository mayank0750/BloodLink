import express from 'express';
import { loginUser, verifyOTP, registerUser, passwordLogin, forgotPassword, getMe ,addRoles} from '../controllers/userController.js';
import { protect ,authorize} from '../middleware/auth.js';

const userRoutes = express.Router();

// Public routes
userRoutes.post('/login', loginUser);
userRoutes.post('/verify-otp', verifyOTP);
userRoutes.post('/register', registerUser);
userRoutes.post('/password-login', passwordLogin);
userRoutes.put("/forgot-password", forgotPassword);

// Protected routes
userRoutes.get('/me', protect, getMe);

userRoutes.post('/add-roles', protect, authorize('admin'), addRoles);

export default userRoutes;

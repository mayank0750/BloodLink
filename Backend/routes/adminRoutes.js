import express from 'express';
import { getAllDonors, getAllUsers, getStats, updateUserRole } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';


const adminRoutes = express.Router();

// All routes require admin authorization
adminRoutes.use(protect);
adminRoutes.use(authorize('admin'));

adminRoutes.get('/donors', getAllDonors);
adminRoutes.get('/users', getAllUsers);
adminRoutes.get('/stats', getStats);
adminRoutes.put('/users/:id/role', updateUserRole);

export default adminRoutes;

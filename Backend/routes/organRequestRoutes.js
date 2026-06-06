import express from 'express';
import {
  createOrganRequest,
  getAllOrganRequests,
  getOrganRequestById,
  updateOrganRequest,
  deleteOrganRequest,
  getOrganRequestStats
} from '../controllers/organRequestController.js';
import { protect, authorize } from '../middleware/auth.js';

const organRequestRoutes = express.Router();

// Public routes
organRequestRoutes.post('/', createOrganRequest);

// Protected routes (for hospital, ngo, admin)
organRequestRoutes.get('/', protect, authorize('admin', 'hospital', 'ngo'), getAllOrganRequests);
organRequestRoutes.get('/stats', protect, authorize('admin', 'hospital', 'ngo'), getOrganRequestStats);
organRequestRoutes.get('/:id', protect, authorize('admin', 'hospital', 'ngo'), getOrganRequestById);

// Admin only routes
organRequestRoutes.put('/:id', protect, authorize('admin'), updateOrganRequest);
organRequestRoutes.delete('/:id', protect, authorize('admin'), deleteOrganRequest);

export default organRequestRoutes;

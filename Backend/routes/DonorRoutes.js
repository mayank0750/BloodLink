import express from 'express';
import {registerDonor,
  getBloodDonors,
  getOrganDonors,
  getDonorById,
  updateDonor,
  deleteDonor} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/auth.js'

const DonorRoutes = express.Router();

// Public routes
DonorRoutes.post('/', registerDonor);

// Protected routes
DonorRoutes.get('/blood', protect, getBloodDonors); 
DonorRoutes.get('/organ', protect, getOrganDonors);
DonorRoutes.get('/:id', protect, getDonorById);

// Admin routes
DonorRoutes.put('/:id', protect, authorize('admin'), updateDonor);
DonorRoutes.delete('/:id', protect, authorize('admin'), deleteDonor);

export default DonorRoutes;

import express from 'express';
import {addLocation,
  getAllLocations,
  getDonorsByLocation,
  getLocationStats,
  updateLocation,
  deleteLocation} from '../controllers/locationController.js';
import { protect, authorize } from '../middleware/auth.js';

const locationRoutes = express.Router();

// Public routes
locationRoutes.get('/', getAllLocations);

// Protected routes
locationRoutes.get('/stats', protect, getLocationStats);
locationRoutes.get('/:city/donors', protect, getDonorsByLocation);

// Admin only routes
locationRoutes.post('/', protect, authorize('admin'), addLocation);
locationRoutes.put('/:id', protect, authorize('admin'), updateLocation);
locationRoutes.delete('/:id', protect, authorize('admin'), deleteLocation);

export default locationRoutes;

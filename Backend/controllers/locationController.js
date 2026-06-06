import Location from '../models/Location.js';
import Donor from '../models/Donor.js';

// @desc    Add new location
// @route   POST /api/locations
// @access  Private (Admin)
export const addLocation = async (req, res) => {
  try {
    const { city, state, areas } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({ city, state });
    
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Location already exists'
      });
    }

    const location = await Location.create({ city, state, areas });

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: location
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding location'
    });
  }
};

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ state: 1, city: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching locations'
    });
  }
};

// @desc    Get donors by location
// @route   GET /api/locations/:city/donors
// @access  Private
export const getDonorsByLocation = async (req, res) => {
  try {
    const { city } = req.params;
    const { donorType, bloodGroup, organ } = req.query;

    let query = {
      city: { $regex: city, $options: 'i' },
      isActive: true
    };

    if (donorType && donorType !== 'all') {
      query.donorType = donorType === 'both' ? { $in: ['blood', 'organ', 'both'] } : { $in: [donorType, 'both'] };
    }

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }

    if (organ && organ !== 'all') {
      query.organs = organ;
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      location: city,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching donors by location:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donors'
    });
  }
};

// @desc    Get location statistics
// @route   GET /api/locations/stats
// @access  Private
export const getLocationStats = async (req, res) => {
  try {
    // Get all unique cities with donor counts
    const cityStats = await Donor.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: { city: '$city', state: '$state' },
          totalDonors: { $sum: 1 },
          bloodDonors: {
            $sum: {
              $cond: [{ $in: ['$donorType', ['blood', 'both']] }, 1, 0]
            }
          },
          organDonors: {
            $sum: {
              $cond: [{ $in: ['$donorType', ['organ', 'both']] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { totalDonors: -1 }
      },
      {
        $limit: 20
      }
    ]);

    res.status(200).json({
      success: true,
      data: cityStats
    });
  } catch (error) {
    console.error('Error fetching location stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location statistics'
    });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: location
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating location'
    });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting location'
    });
  }
};

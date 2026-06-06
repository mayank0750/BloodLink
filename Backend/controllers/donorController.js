import Donor from '../models/Donor.js'; 

// @desc    Register new donor
// @route   POST /api/donors
// @access  Public
export const registerDonor = async (req, res) => {
  try {
    const {
      name,
      age,
      dob,
      gender,
      bloodGroup,
      organs,
      donorType,
      contact,
      email,
      location,
      city,
      state,
      district,
      taluka,
      pincode,
      coordinates,
      consentAccepted
    } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({
      $or: [{ contact }, { email }]
    });

    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: 'Donor with this contact or email already exists'
      });
    }

    // Validate donor type with blood group and organs
    if (donorType === 'blood' && (!bloodGroup || bloodGroup === 'N/A')) {
      return res.status(400).json({
        success: false,
        message: 'Blood group is required for blood donors'
      });
    }

    if ((donorType === 'organ' || donorType === 'both') && (!organs || organs.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one organ is required for organ donors'
      });
    }

    const donor = await Donor.create({
      name,
      age,
      dob,
      gender,
      bloodGroup: donorType === 'blood' || donorType === 'both' ? bloodGroup : 'N/A',
      organs: donorType === 'organ' || donorType === 'both' ? organs : [],
      donorType,
      contact,
      email,
      location,
      city,
      state,
      district,
      taluka,
      pincode,
      coordinates: coordinates || {},
      consentAccepted
    });

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully',
      data: donor
    });
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while registering donor'
    });
  }
};

// @desc    Get blood donors
// @route   GET /api/donors/blood
// @access  Private
// export const getBloodDonors = async (req, res) => {
//   try {
//     const { bloodGroup, location, city, state, district, taluka, latitude, longitude, radius } = req.query;
    
//     let query = {
//       donorType: { $in: ['blood', 'both'] },
//       isActive: true
//     };

//     if (bloodGroup && bloodGroup !== 'all') {
//       query.bloodGroup = bloodGroup;
//     }

//     if (location) {
//       query.location = { $regex: location, $options: 'i' };
//     }

//     if (city) {
//       query.city = { $regex: city, $options: 'i' };
//     }

//     if (state) {
//       query.state = { $regex: state, $options: 'i' };
//     }

//     if (district) {
//       query.district = { $regex: district, $options: 'i' };
//     }

//     if (taluka) {
//       query.taluka = { $regex: taluka, $options: 'i' };
//     }

//     let donors;

//     // If coordinates are provided, find nearby donors
//     if (latitude && longitude) {
//       const lat = parseFloat(latitude);
//       const lng = parseFloat(longitude);
//       const searchRadius = radius ? parseFloat(radius) : 30; // Default 30 km

//       // Find donors within radius (using Haversine formula approximation)
//       const allDonors = await Donor.find(query);
      
//       donors = allDonors.filter(donor => {
//         if (!donor.coordinates || !donor.coordinates.latitude || !donor.coordinates.longitude) {
//           return false;
//         }
        
//         const distance = calculateDistance(
//           lat, lng,
//           donor.coordinates.latitude,
//           donor.coordinates.longitude
//         );
        
//         return distance <= searchRadius;
//       }).map(donor => {
//         const donorObj = donor.toObject();
//         donorObj.distance = calculateDistance(
//           lat, lng,
//           donor.coordinates.latitude,
//           donor.coordinates.longitude
//         ).toFixed(2);
//         return donorObj;
//       }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
//     } else {
//       donors = await Donor.find(query).sort({ createdAt: -1 });
//     }

//     res.status(200).json({
//       success: true,
//       count: donors.length,
//       data: donors
//     });
//   } catch (error) {
//     console.error('Error fetching blood donors:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching blood donors'
//     });
//   }
// };

export const getBloodDonors = async (req, res) => {
  try {
    const messages = await Donor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.log("Error fetching messages:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get organ donors
// @route   GET /api/donors/organ
// @access  Private
export const getOrganDonors = async (req, res) => {
  try {
    const { organ, location, city, latitude, longitude, radius } = req.query;
    
    let query = {
      donorType: { $in: ['organ', 'both'] },
      isActive: true
    };

    if (organ && organ !== 'all') {
      query.organs = organ;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    let donors;

    // If coordinates are provided, find nearby donors
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const searchRadius = radius ? parseFloat(radius) : 30; // Default 30 km

      // Find donors within radius
      const allDonors = await Donor.find(query);
      
      donors = allDonors.filter(donor => {
        if (!donor.coordinates || !donor.coordinates.latitude || !donor.coordinates.longitude) {
          return false;
        }
        
        const distance = calculateDistance(
          lat, lng,
          donor.coordinates.latitude,
          donor.coordinates.longitude
        );
        
        return distance <= searchRadius;
      }).map(donor => {
        const donorObj = donor.toObject();
        donorObj.distance = calculateDistance(
          lat, lng,
          donor.coordinates.latitude,
          donor.coordinates.longitude
        ).toFixed(2);
        return donorObj;
      }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else {
      donors = await Donor.find(query).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching organ donors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organ donors'
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Private
export const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donor'
    });
  }
};

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Private/Admin
export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donor updated successfully',
      data: donor
    });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating donor'
    });
  }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Private/Admin
export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting donor'
    });
  }
};

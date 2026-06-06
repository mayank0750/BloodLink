import Donor from '../models/Donor.js';
import User from '../models/User.js';
import OrganRequest from '../models/OrganRequest.js';

// @desc    Get all donors
// @route   GET /api/admin/donors
// @access  Private/Admin
export const getAllDonors = async (req, res) => {
  try {
    const { search, donorType, bloodGroup, isActive } = req.query;
    
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (donorType && donorType !== 'all') {
      query.donorType = donorType;
    }

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const donors = await Donor.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching all donors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donors'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin

export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    // Total donors
    const totalDonors = await Donor.countDocuments();
    
    // Active donors
    const activeDonors = await Donor.countDocuments({ isActive: true });
    
    // Blood donors
    const bloodDonors = await Donor.countDocuments({
      donorType: { $in: ['blood', 'both'] }
    });
    
    // Organ donors
    const organDonors = await Donor.countDocuments({
      donorType: { $in: ['organ', 'both'] }
    });
    
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Users by role
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Blood group distribution
    const bloodGroupStats = await Donor.aggregate([
      {
        $match: {
          donorType: { $in: ['blood', 'both'] },
          bloodGroup: { $ne: 'N/A' }
        }
      },
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Organ distribution
    const organStats = await Donor.aggregate([
      {
        $match: {
          donorType: { $in: ['organ', 'both'] }
        }
      },
      { $unwind: '$organs' },
      {
        $group: {
          _id: '$organs',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Location-wise distribution (top 10)
    const locationStats = await Donor.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonors = await Donor.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Organ requests statistics
    const totalOrganRequests = await OrganRequest.countDocuments();
    const pendingOrganRequests = await OrganRequest.countDocuments({ status: 'Pending' });
    const criticalOrganRequests = await OrganRequest.countDocuments({ urgencyLevel: 'Critical' });

    res.status(200).json({
      success: true,
      data: {
        donors: {
          total: totalDonors,
          active: activeDonors,
          blood: bloodDonors,
          organ: organDonors,
          recent: recentDonors
        },
        users: {
          total: totalUsers,
          admin: adminUsers,
          regular: regularUsers,
          recent: recentUsers
        },
        organRequests: {
          total: totalOrganRequests,
          pending: pendingOrganRequests,
          critical: criticalOrganRequests
        },
        bloodGroupDistribution: bloodGroupStats,
        organDistribution: organStats,
        topLocations: locationStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role'
    });
  }
};

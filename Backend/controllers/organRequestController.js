import OrganRequest from '../models/OrganRequest.js';

// @desc    Create organ request
// @route   POST /api/organ-requests
// @access  Public
export const createOrganRequest = async (req, res) => {
  try {
    const organRequest = await OrganRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Organ request submitted successfully',
      data: organRequest
    });
  } catch (error) {
    console.error('Error creating organ request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating organ request'
    });
  }
};

// @desc    Get all organ requests
// @route   GET /api/organ-requests
// @access  Private (Admin, Hospital, NGO)
export const getAllOrganRequests = async (req, res) => {
  try {
    const { 
      organNeeded, 
      bloodGroup, 
      city, 
      urgencyLevel, 
      status,
      search 
    } = req.query;
    
    let query = {};

    if (organNeeded && organNeeded !== 'all') {
      query.organNeeded = organNeeded;
    }

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (urgencyLevel && urgencyLevel !== 'all') {
      query.urgencyLevel = urgencyLevel;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } }
      ];
    }

    const organRequests = await OrganRequest.find(query).sort({ urgencyLevel: 1, createdAt: -1 });

    // Sort by urgency (Critical first)
    const urgencyOrder = { 'Critical': 1, 'Urgent': 2, 'Moderate': 3, 'Low': 4 };
    organRequests.sort((a, b) => urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel]);

    res.status(200).json({
      success: true,
      count: organRequests.length,
      data: organRequests
    });
  } catch (error) {
    console.error('Error fetching organ requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organ requests'
    });
  }
};

// @desc    Get organ request by ID
// @route   GET /api/organ-requests/:id
// @access  Private (Admin, Hospital, NGO)
export const getOrganRequestById = async (req, res) => {
  try {
    const organRequest = await OrganRequest.findById(req.params.id);

    if (!organRequest) {
      return res.status(404).json({
        success: false,
        message: 'Organ request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: organRequest
    });
  } catch (error) {
    console.error('Error fetching organ request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organ request'
    });
  }
};

// @desc    Update organ request
// @route   PUT /api/organ-requests/:id
// @access  Private (Admin)
export const updateOrganRequest = async (req, res) => {
  try {
    const organRequest = await OrganRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!organRequest) {
      return res.status(404).json({
        success: false,
        message: 'Organ request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Organ request updated successfully',
      data: organRequest
    });
  } catch (error) {
    console.error('Error updating organ request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating organ request'
    });
  }
};

// @desc    Delete organ request
// @route   DELETE /api/organ-requests/:id
// @access  Private (Admin)
export const deleteOrganRequest = async (req, res) => {
  try {
    const organRequest = await OrganRequest.findByIdAndDelete(req.params.id);

    if (!organRequest) {
      return res.status(404).json({
        success: false,
        message: 'Organ request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Organ request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organ request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting organ request'
    });
  }
};

// @desc    Get organ requests statistics
// @route   GET /api/organ-requests/stats
// @access  Private (Admin, Hospital, NGO)
export const getOrganRequestStats = async (req, res) => {
  try {
    const totalRequests = await OrganRequest.countDocuments();
    const pendingRequests = await OrganRequest.countDocuments({ status: 'Pending' });
    const criticalRequests = await OrganRequest.countDocuments({ urgencyLevel: 'Critical' });
    const matchedRequests = await OrganRequest.countDocuments({ status: 'Matched' });

    // Organ-wise distribution
    const organDistribution = await OrganRequest.aggregate([
      {
        $group: {
          _id: '$organNeeded',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Urgency-wise distribution
    const urgencyDistribution = await OrganRequest.aggregate([
      {
        $group: {
          _id: '$urgencyLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalRequests,
        pending: pendingRequests,
        critical: criticalRequests,
        matched: matchedRequests,
        organDistribution,
        urgencyDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching organ request stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

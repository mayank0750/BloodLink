import Donor from "../models/Donor.js";

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
      consentAccepted,
    } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({
      $or: [{ contact }, { email }],
    });

    if (existingDonor) {
      return res.status(400).json({
        success: false,
        message: "Donor with this contact or email already exists",
      });
    }

    // Validate donor type with blood group and organs
    if (donorType === "blood" && (!bloodGroup || bloodGroup === "N/A")) {
      return res.status(400).json({
        success: false,
        message: "Blood group is required for blood donors",
      });
    }

    if (
      (donorType === "organ" || donorType === "both") &&
      (!organs || organs.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one organ is required for organ donors",
      });
    }

    const donor = await Donor.create({
      name,
      age,
      dob,
      gender,
      bloodGroup:
        donorType === "blood" || donorType === "both" ? bloodGroup : "N/A",
      organs: donorType === "organ" || donorType === "both" ? organs : [],
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
      consentAccepted,
    });

    res.status(201).json({
      success: true,
      message: "Donor registered successfully",
      data: donor,
    });
  } catch (error) {
    console.error("Error registering donor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while registering donor",
    });
  }
};

// @desc    Get blood donors
// @route   GET /api/donors/blood
// @access  Private
export const getBloodDonors = async (req, res) => {
  try {
    const {
      bloodGroup,
      location,
      city,
      state,
      district,
      taluka,
      latitude,
      longitude,
      radius,
    } = req.query;

    console.log("Incoming Query:", req.query);

    // Base query
    const query = {
      donorType: { $in: ["blood", "both"] },
      isActive: true,
    };

    // Blood group filter
    if (bloodGroup && bloodGroup !== "all") {
      query.bloodGroup = bloodGroup;
    }

    // Location filters
    if (location?.trim()) {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    if (city?.trim()) {
      query.city = { $regex: city.trim(), $options: "i" };
    }

    if (state?.trim()) {
      query.state = { $regex: state.trim(), $options: "i" };
    }

    if (district?.trim()) {
      query.district = { $regex: district.trim(), $options: "i" };
    }

    if (taluka?.trim()) {
      query.taluka = { $regex: taluka.trim(), $options: "i" };
    }

    console.log("Mongo Query:", JSON.stringify(query, null, 2));

    let donors = [];

    // Validate coordinates
    const lat =
      latitude && latitude !== "null" && latitude !== "undefined"
        ? Number(latitude)
        : NaN;

    const lng =
      longitude && longitude !== "null" && longitude !== "undefined"
        ? Number(longitude)
        : NaN;

    const hasValidCoordinates = !isNaN(lat) && !isNaN(lng);

    console.log("=================================");
    console.log("Received Query:", req.query);
    console.log("Received Coordinates:", {
      latitude,
      longitude,
    });
    console.log("Parsed Coordinates:", {
      lat,
      lng,
    });
    console.log("Has Valid Coordinates:", hasValidCoordinates);
    console.log("Search Radius:", radius || 50);
    console.log("=================================");

    // Nearby donor search
    if (hasValidCoordinates) {
      console.log(`Searching nearby donors at (${lat}, ${lng})`);

      const searchRadius = radius ? Number(radius) : 50; // default 50 km

      const allDonors = await Donor.find(query);

      donors = allDonors
        .filter((donor) => {
          if (
            !donor.coordinates ||
            donor.coordinates.latitude == null ||
            donor.coordinates.longitude == null
          ) {
            return false;
          }

          const distance = calculateDistance(
            lat,
            lng,
            donor.coordinates.latitude,
            donor.coordinates.longitude,
          );
          console.log(`${donor.name} => ${distance.toFixed(2)} km`);
          console.log({
            donor: donor.name,
            donorLat: donor.coordinates.latitude,
            donorLng: donor.coordinates.longitude,
            searchLat: lat,
            searchLng: lng,
            distance,
          });

          return distance <= searchRadius;
        })
        .map((donor) => {
          const donorObj = donor.toObject();

          const distance = calculateDistance(
            lat,
            lng,
            donor.coordinates.latitude,
            donor.coordinates.longitude,
          );

          return {
            ...donorObj,
            distance: Number(distance.toFixed(2)),
          };
        })
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      console.log(`Nearby donors found: ${donors.length}`);
    } else {
      // Normal search
      donors = await Donor.find(query).sort({
        createdAt: -1,
      });

      console.log(`Donors found: ${donors.length}`);
    }

    return res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    console.error("Error fetching blood donors:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching blood donors",
      error: error.message,
    });
  }
};

// @desc    Get organ donors
// @route   GET /api/donors/organ
// @access  Private
export const getOrganDonors = async (req, res) => {
  try {
    const {
      organ,
      location,
      city,
      state,
      district,
      taluka,
      latitude,
      longitude,
      radius,
    } = req.query;

    console.log("Incoming Query:", req.query);

    // Base query
    const query = {
      donorType: { $in: ["organ", "both"] },
      isActive: true,
    };

    // Filter by organ name from organs array
    if (organ?.trim() && organ.trim().toLowerCase() !== "all") {
      query.organs = {
        $in: [organ.trim()],
      };
    }
    // Location filters
    if (location?.trim()) {
      query.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    if (city?.trim()) {
      query.city = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    if (state?.trim()) {
      query.state = {
        $regex: state.trim(),
        $options: "i",
      };
    }

    if (district?.trim()) {
      query.district = {
        $regex: district.trim(),
        $options: "i",
      };
    }

    if (taluka?.trim()) {
      query.taluka = {
        $regex: taluka.trim(),
        $options: "i",
      };
    }

    console.log("Mongo Query:", JSON.stringify(query, null, 2));

    let organs = [];

    // Validate coordinates
    const lat =
      latitude && latitude !== "null" && latitude !== "undefined"
        ? Number(latitude)
        : NaN;

    const lng =
      longitude && longitude !== "null" && longitude !== "undefined"
        ? Number(longitude)
        : NaN;

    const hasValidCoordinates = !isNaN(lat) && !isNaN(lng);

    console.log("=================================");
    console.log("Received Query:", req.query);
    console.log("Received Coordinates:", {
      latitude,
      longitude,
    });
    console.log("Parsed Coordinates:", {
      lat,
      lng,
    });
    console.log("Has Valid Coordinates:", hasValidCoordinates);
    console.log("Search Radius:", radius || 50);
    console.log("=================================");

    // Nearby donor search
    if (hasValidCoordinates) {
      console.log(`Searching nearby organs at (${lat}, ${lng})`);

      const searchRadius = radius ? Number(radius) : 50;

      const allOrgans = await Donor.find(query);

      organs = allOrgans
        .filter((donor) => {
          if (
            !donor.coordinates ||
            donor.coordinates.latitude == null ||
            donor.coordinates.longitude == null
          ) {
            return false;
          }

          const distance = calculateDistance(
            lat,
            lng,
            donor.coordinates.latitude,
            donor.coordinates.longitude,
          );

          return distance <= searchRadius;
        })
        .map((donor) => {
          const donorObj = donor.toObject();

          const distance = calculateDistance(
            lat,
            lng,
            donor.coordinates.latitude,
            donor.coordinates.longitude,
          );

          return {
            ...donorObj,
            distance: Number(distance.toFixed(2)),
          };
        })
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else {
      organs = await Donor.find(query).sort({
        createdAt: -1,
      });
    }

    console.log(`Organ donors found: ${organs.length}`);

    return res.status(200).json({
      success: true,
      count: organs.length,
      data: organs,
    });
  } catch (error) {
    console.error("Error fetching organ donors:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching organ donors",
      error: error.message,
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
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
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
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching donor",
    });
  }
};

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Private/Admin
export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      data: donor,
    });
    console.log("Donor updated:", donor);
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating donor",
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
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting donor",
    });
  }
};

// public data in Homepage
export const getPublicStats = async (req, res) => {
  try {

    const bloodDonors = await Donor.countDocuments({
      donorType: { $in: ["blood", "both"] },
      isActive: true,
    });

    const organDonors = await Donor.countDocuments({
      donorType: { $in: ["organ", "both"] },
      isActive: true,
    });

    const cities = await Donor.distinct("city");

    res.json({
      success: true,
      data: {
        bloodDonors,
        organDonors,
        citiesCovered: cities.length,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

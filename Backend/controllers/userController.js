import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";
import OTP from "../models/Otp.js";

const API_KEY =
  process.env.HANU_OTP_API_KEY || "e14684c98218eebf3708120aeaf453f0";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// otp mobile number
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { mobile } = req.body;

    const existingUser = await User.findOne({
      mobile,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Already registered",
      });
    }

    let otpData = await OTP.findOne({
      mobile,
    });

    if (!otpData) {
      otpData = new OTP({
        mobile,
      });
    }

    const otp = generateOTP();

    otpData.otp = otp;

    otpData.verified = false;

    otpData.otpExpiry = Date.now() + 600000;

    await otpData.save();

    await axios.get(
      `https://api.hanuotp.in/whatsapp-otp.php?number=${mobile}&OTP=${otp}&apikey=${API_KEY}`,
    );

    res.json({
      success: true,
      mobile,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  const data = await OTP.findOne({
    mobile,
  });

  if (!data) {
    return res.status(404).json({
      message: "OTP not found",
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (data.otpExpiry < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  data.verified = true;

  await data.save();

  res.json({
    success: true,
  });
};

export const registerUser = async (req, res) => {
  const { mobile, name, email, password } = req.body;

  const otp = await OTP.findOne({
    mobile,
  });

  if (!otp || !otp.verified) {
    return res.status(400).json({
      message: "Verify OTP first",
    });
  }

  const user = await User.create({
    mobile,
    name,
    email,
    password,
    isVerified: true,
  });

  await OTP.deleteOne({
    mobile,
  });

  res.json({
    success: true,
    user,
  });
};

export const passwordLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        // password: user.password,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({
      mobile,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = password;

    await user.save();

    res.json({
      success: true,
      message: "Password updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

export const addRoles = async (req, res) => {
  try {
    const {
      role,
      mobile,
      name,
      email,
      password,
      organizationName,
      organizationType,
      registrationNumber,
      address,
      city,
      state,
    } = req.body;

    const userExists = await User.findOne({ mobile });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      role,
      mobile,
      name,
      email,
      password,
      organizationName: organizationName || undefined,
      organizationType: organizationType || undefined,
      registrationNumber: registrationNumber || undefined,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      isVerified: true, // admin-created users directly verified
    });

    res.status(201).json({
      success: true,
      message: "Role/User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

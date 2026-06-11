import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

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

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile required",
      });
    }

    const existingUser = await User.findOne({
      mobile,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists. Use another number",
      });
    }

    let otpUser = await User.findOne({
      mobile,
      isVerified: false,
    });

    if (!otpUser) {
      otpUser = new User({
        mobile,
        password: "temp123",
      });
    }

    const today = new Date();

    const sameDay =
      otpUser.otpDate &&
      new Date(otpUser.otpDate).toDateString() === today.toDateString();

    if (!sameDay) {
      otpUser.otpCount = 0;
    }

    if (otpUser.otpCount >= 2) {
      return res.status(429).json({
        message: "OTP limit reached. Try tomorrow",
      });
    }

    const otp = generateOTP();

    otpUser.otp = otp;

    otpUser.otpExpiry = Date.now() + 10 * 60 * 1000;

    otpUser.otpCount += 1;

    otpUser.otpDate = today;

    await otpUser.save();

    await axios.get(
      `https://api.hanuotp.in/whatsapp-otp.php?number=${mobile}&OTP=${otp}&apikey=${API_KEY}`,
    );

    res.json({
      success: true,

      message: "OTP sent",

      userId: otpUser._id,
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
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID and OTP",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP Verified",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { mobile, name, email, password } = req.body;

    let user = await User.findOne({
      mobile,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "Verify mobile first",
      });
    }

    if (user.isVerified !== true) {
      return res.status(400).json({
        success: false,

        message: "Verify OTP first",
      });
    }

    user.name = name;

    user.email = email;

    user.password = password;

    // cleanup

    user.otp = undefined;

    user.otpExpiry = undefined;

    user.otpCount = 0;

    user.otpDate = undefined;

    await user.save();

    res.status(200).json({
      success: true,

      message: "Registration successful",

      user: {
        id: user._id,

        name: user.name,

        mobile: user.mobile,

        email: user.email,

        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
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

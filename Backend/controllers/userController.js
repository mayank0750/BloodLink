import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Login/Register user with mobile number
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { mobile, name, email } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number'
      });
    }

    // Check if user exists
    let user = await User.findOne({ mobile });

    if (!user) {
      // Create new user
      user = await User.create({
        mobile,
        name: name || '',
        email: email || '',
        role: 'user'
      });
    }

    // In production, send OTP via SMS
    // For demo, we'll generate OTP and return it (not recommended in production)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // In production, don't send OTP in response
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      userId: user._id
    });
    console.log(`OTP sent successfully',Generated OTP for ${mobile}: ${otp}`);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while logging in'
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
        message: 'Please provide user ID and OTP'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
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
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

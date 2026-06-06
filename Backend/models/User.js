import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Please add mobile number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
  },
  email: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'hospital', 'ngo'],
    default: 'user'
  },
  organizationName: {
    type: String,
    trim: true
  },
  organizationType: {
    type: String,
    enum: ['hospital', 'ngo', 'other']
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for mobile number
// userSchema.index({ mobile: 1 });

const User = mongoose.model('User', userSchema);

export default User;

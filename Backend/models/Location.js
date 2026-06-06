import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'Please add city name'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please add state name'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'Please add district name'],
    trim: true
  },
  taluka: {
    type: String,
    required: [true, 'Please add taluka name'],
    trim: true
  },
  areas: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for city and state
locationSchema.index({ city: 1, state: 1 }, { unique: true });

const Location = mongoose.model('Location', locationSchema);
export default Location;

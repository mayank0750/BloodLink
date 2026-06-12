import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor must be under 65 years old']
  },
  dob: {
  type: Date,
  required: [true, 'Please add date of birth']
},
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['Male', 'Female', 'Transgender']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'N/A'],
    default: 'N/A'
  },
  lastDonationDate: {
  type: Date,
},
  organs: [{
    type: String,
    enum: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea', 'Skin', 'Bone Marrow', 'N/A']
  }],
  donorType: {
    type: String,
    required: [true, 'Please specify donor type'],
    enum: ['blood', 'organ', 'both']
  },
  contact: {
    type: String,
    required: [true, 'Please add contact number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit contact number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
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
  district: {
  type: String,
  trim: true,
  required: [true, 'Please add district']
},
taluka: {
  type: String,
  trim: true,
  required: [true, 'Please add taluka']
},
  pincode: {
    type: String,
    match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  consentAccepted: {
  type: Boolean,
  required: true,
  default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastDonation: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster search
// donorSchema.index({ contact: 1 });
donorSchema.index({ bloodGroup: 1 });
donorSchema.index({ location: 1 });
donorSchema.index({ city: 1 });
donorSchema.index({ state: 1 });
donorSchema.index({ district: 1 });
donorSchema.index({ taluka: 1 });
donorSchema.index({ donorType: 1 });
donorSchema.index({ organs: 1 });
donorSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;

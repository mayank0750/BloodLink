import mongoose from 'mongoose';

const organRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Please add patient name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [1, 'Age must be at least 1'],
    max: [100, 'Age must be less than 100']
  },
  dob: {
  type: Date,
  required: [true, 'Please add date of birth']
},
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please add blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  organNeeded: {
    type: String,
    required: [true, 'Please specify organ needed'],
    enum: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea', 'Skin', 'Bone Marrow']
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Please specify urgency level'],
    enum: ['Critical', 'Urgent', 'Moderate', 'Low'],
    default: 'Moderate'
  },
  medicalCondition: {
    type: String,
    required: [true, 'Please describe medical condition'],
    trim: true
  },
  hospitalName: {
    type: String,
    required: [true, 'Please add hospital name'],
    trim: true
  },
  doctorName: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Please add contact person name'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Please add contact number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit contact number']
  },
  alternateContact: {
    type: String,
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
  address: {
    type: String,
    required: [true, 'Please add address'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please add state'],
    trim: true
  },
  district: {
  type: String,
  required: [true, 'Please add district'],
  trim: true
},

taluka: {
  type: String,
  required: [true, 'Please add taluka'],
  trim: true
},
  pincode: {
    type: String,
    required: [true, 'Please add pincode'],
    match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Matched', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
// organRequestSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// Create indexes for faster search
organRequestSchema.index({ organNeeded: 1 });
organRequestSchema.index({ city: 1 });
organRequestSchema.index({ bloodGroup: 1 });
organRequestSchema.index({ urgencyLevel: 1 });
organRequestSchema.index({ status: 1 });

const OrganRequest = mongoose.model('OrganRequest', organRequestSchema);

export default OrganRequest;

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    otp: String,

    otpExpiry: Date,

    verified: {
      type: Boolean,
      default: false,
    },

    otpCount: {
      type: Number,
      default: 0,
    },

    otpDate: Date,
  },

  {
    timestamps: true,
  }
);

// auto delete after 15 min
otpSchema.index(
  {
    createdAt: 1,
  },
  {
    expireAfterSeconds: 900,
  }
);

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
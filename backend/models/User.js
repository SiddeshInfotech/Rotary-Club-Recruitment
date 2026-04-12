const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
    },
    location: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // --- Extended Profile Fields ---
    currentTitle: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: String, default: "" },
    experience: [{
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      duration: String,
      currentlyWorking: { type: Boolean, default: false },
    }],
    resumeLink: { type: String, default: "" },
    company: { type: String, default: "" },
    website: { type: String, default: "" },
    hiringNeeds: { type: String, default: "" },
    otp: { type: String },
    otpExpires: { type: Date },

    // reset password fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

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
    eqScores: {
      leadership: { type: Number, default: 0 },
      loyalty: { type: Number, default: 0 },
      adaptability: { type: Number, default: 0 },
      growthMindset: { type: Number, default: 0 },
      reliability: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      collaboration: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      aggregate: { type: Number, default: 0 },
    },
    company: { type: String, default: "" },
    website: { type: String, default: "" },
    hiringNeeds: { type: String, default: "" },
    otp: { type: String },
    otpExpires: { type: Date },

    // Technical Scores (written by AI service, synced via shared DB)
    technicalScores: {
      fundamentals: { type: Number, default: 0 },
      architecture: { type: Number, default: 0 },
      debugging: { type: Number, default: 0 },
      bestPractices: { type: Number, default: 0 },
      tooling: { type: Number, default: 0 },
      aggregate: { type: Number, default: 0 },
      proficiencyLevel: { type: String, default: "not_assessed" },
    },

    // EQ Assessment tracking
    lastAssessedAt: { type: Date },
    // Technical Assessment tracking
    lastTechAssessedAt: { type: Date },

    // Settings / Preferences
    emailNotifications: { type: Boolean, default: true },
    inAppNotifications: { type: Boolean, default: true },
    isPublicProfile: { type: Boolean, default: true },

    // reset password fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

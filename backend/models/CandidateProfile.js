const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Education
    college: String,
    degree: String,

    // Professional Info
    summary: String,
    highlights: [String],

    // Skills (Categorized)
    skills: {
      technical: [String],
      soft: [String],
      tools: [String],
    },

    interests: [String],
    experienceLevel: String,
    preferredJobRole: String,

    // Documents
    resumeUrl: String,
    coverLetterUrl: String,

    // EQ Scores
    eqScores: {
      leadership: { type: Number, default: 0 },
      loyalty: { type: Number, default: 0 },
      adaptability: { type: Number, default: 0 },
      growthMindset: { type: Number, default: 0 },
      reliability: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      collaboration: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);

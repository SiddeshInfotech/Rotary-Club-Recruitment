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
      aggregate: { type: Number, default: 0 },
    },

    // Technical Scores
    technicalScores: {
      fundamentals: { type: Number, default: 0 },
      architecture: { type: Number, default: 0 },
      debugging: { type: Number, default: 0 },
      bestPractices: { type: Number, default: 0 },
      tooling: { type: Number, default: 0 },
      aggregate: { type: Number, default: 0 },
      proficiencyLevel: { type: String, default: "not_assessed" },
    },

    // Premium Features
    isPremium: { type: Boolean, default: false },
    isTrial: { type: Boolean, default: false },
    premiumPlan: { type: String, enum: ["trial", "1month", "6months", "12months"], default: null },
    premiumExpiresAt: { type: Date, default: null },
    premiumInsights: {
      persona: {
        title: String,
        desc: String,
      },
      careerTrajectory: String,
      growthPlan: [String],
      blindSpot: {
        trigger: String,
        response: String,
        fix: String,
      },
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      interviewPrep: mongoose.Schema.Types.Mixed,
      interviewPrepGeneratedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);

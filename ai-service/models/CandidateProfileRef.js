const mongoose = require("mongoose");

/**
 * Reference to the CandidateProfile model.
 *
 * This connects to the SAME MongoDB database and the SAME "candidateprofiles" collection
 * used by the main backend for the Candidate Dashboard.
 */
const candidateProfileRefSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eqScores: {
      leadership: { type: Number, min: 0, max: 100, default: 0 },
      loyalty: { type: Number, min: 0, max: 100, default: 0 },
      adaptability: { type: Number, min: 0, max: 100, default: 0 },
      growthMindset: { type: Number, min: 0, max: 100, default: 0 },
      reliability: { type: Number, min: 0, max: 100, default: 0 },
      teamwork: { type: Number, min: 0, max: 100, default: 0 },
      collaboration: { type: Number, min: 0, max: 100, default: 0 },
      problemSolving: { type: Number, min: 0, max: 100, default: 0 },
    },
    technicalScores: {
      fundamentals: { type: Number, min: 0, max: 100, default: 0 },
      architecture: { type: Number, min: 0, max: 100, default: 0 },
      debugging: { type: Number, min: 0, max: 100, default: 0 },
      bestPractices: { type: Number, min: 0, max: 100, default: 0 },
      tooling: { type: Number, min: 0, max: 100, default: 0 },
      aggregate: { type: Number, min: 0, max: 100, default: 0 },
      proficiencyLevel: { type: String, default: "not_assessed" },
    },
    // Premium Features
    isPremium: { type: Boolean, default: false },
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileRefSchema, "candidateprofiles");

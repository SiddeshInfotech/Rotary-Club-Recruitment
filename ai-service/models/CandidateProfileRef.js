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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileRefSchema, "candidateprofiles");

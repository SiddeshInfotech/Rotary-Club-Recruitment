const mongoose = require("mongoose");

/**
 * Reference to the Candidate model.
 *
 * This is a lightweight copy of the Candidate schema from the main backend.
 * It connects to the SAME MongoDB database and the SAME "candidates" collection,
 * allowing the AI service to read candidate profiles and write back EQ scores
 * without going through the main backend's API.
 *
 * IMPORTANT: If you change the Candidate schema in the backend,
 * update the relevant fields here too.
 */
const candidateRefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
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
      aggregate: { type: Number, min: 0, max: 100, default: 0 },
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
    lastAssessedAt: { type: Date },
    lastTechAssessedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Use the unified collection name "users" to stay perfectly synced with the main backend User models!
module.exports = mongoose.model("Candidate", candidateRefSchema, "users");

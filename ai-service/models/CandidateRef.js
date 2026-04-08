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
      emotionalIntelligence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      collaboration: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      adaptability: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Use the unified collection name "users" to stay perfectly synced with the main backend User models!
module.exports = mongoose.model("Candidate", candidateRefSchema, "users");

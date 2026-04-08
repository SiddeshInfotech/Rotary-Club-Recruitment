const mongoose = require("mongoose");

/**
 * Assessment model — stores the full history of EQ assessments.
 *
 * Each assessment record captures:
 * - Which candidate took it
 * - The questions that were generated
 * - The candidate's answers
 * - Individual and aggregate scores
 * - Current status (pending → in_progress → completed)
 *
 * This provides an audit trail and allows candidates/recruiters to
 * review past assessment details.
 */
const assessmentSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate ID is required"],
      index: true,
    },
    questions: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        dimension: {
          type: String,
          enum: ["emotionalIntelligence", "collaboration", "adaptability"],
          required: true,
        },
        context: { type: String, default: "" },
        answer: { type: String, default: "" },
        score: { type: Number, min: 0, max: 10, default: 0 },
        feedback: { type: String, default: "" },
      },
    ],
    finalScores: {
      emotionalIntelligence: { type: Number, min: 0, max: 100, default: 0 },
      collaboration: { type: Number, min: 0, max: 100, default: 0 },
      adaptability: { type: Number, min: 0, max: 100, default: 0 },
      overall: { type: Number, min: 0, max: 100, default: 0 },
    },
    summary: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);

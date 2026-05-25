const mongoose = require("mongoose");

/**
 * TechnicalAssessment model — stores the full history of Technical Skills assessments.
 *
 * Each assessment record captures:
 * - Which candidate took it
 * - The technical questions that were generated (tailored to their skills)
 * - The candidate's answers
 * - Individual and aggregate scores across 5 technical dimensions
 * - Difficulty distribution and proficiency level
 * - Current status (pending → in_progress → completed)
 *
 * This is completely separate from the EQ Assessment model.
 */
const technicalAssessmentSchema = new mongoose.Schema(
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
          required: true,
          enum: ["fundamentals", "architecture", "debugging", "bestPractices", "tooling"],
        },
        difficulty: {
          type: String,
          required: true,
          enum: ["easy", "medium", "hard"],
        },
        // Code snippet attached to the question (if any)
        codeSnippet: { type: String, default: "" },
        // Programming language for syntax highlighting
        codeLanguage: { type: String, default: "" },
        options: [
          {
            id: { type: String, required: true },
            text: { type: String, required: true },
            score: { type: Number, required: true },
          },
        ],
        selectedOption: { type: String, default: null },
      },
    ],
    finalScores: {
      fundamentals: { type: Number, min: 0, max: 100, default: 0 },
      architecture: { type: Number, min: 0, max: 100, default: 0 },
      debugging: { type: Number, min: 0, max: 100, default: 0 },
      bestPractices: { type: Number, min: 0, max: 100, default: 0 },
      tooling: { type: Number, min: 0, max: 100, default: 0 },
      overall: { type: Number, min: 0, max: 100, default: 0 },
    },
    proficiencyLevel: {
      type: String,
      enum: ["not_assessed", "beginner", "intermediate", "advanced", "expert"],
      default: "not_assessed",
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

module.exports = mongoose.model("TechnicalAssessment", technicalAssessmentSchema);

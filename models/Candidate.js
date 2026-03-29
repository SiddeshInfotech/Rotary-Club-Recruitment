const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Candidate name is required"],
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

// Virtual: compute overall EQ score (average of the 3 sub-scores)
candidateSchema.virtual("overallEqScore").get(function () {
  const { emotionalIntelligence, collaboration, adaptability } = this.eqScores;
  return Math.round((emotionalIntelligence + collaboration + adaptability) / 3);
});

// Ensure virtuals are included in JSON output
candidateSchema.set("toJSON", { virtuals: true });
candidateSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Candidate", candidateSchema);

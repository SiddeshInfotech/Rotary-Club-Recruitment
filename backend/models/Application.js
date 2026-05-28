const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Candidate ID is required"],
    },
    eqMatchScore: {
      type: Number,
      min: -1,
      max: 100,
      default: -1,
    },
    technicalScore: {
      type: Number,
      min: -1,
      max: 100,
      default: -1,
    },
    eqScore: {
      type: Number,
      min: -1,
      max: 100,
      default: -1,
    },
    matchReasoning: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Interview Scheduled", "Reviewing Profile", "Offer Extended", "Hired"],
      default: "Applied",
    },
    currentRound: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same job by the same candidate
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

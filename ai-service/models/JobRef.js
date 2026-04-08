const mongoose = require("mongoose");

/**
 * Reference to the Job model.
 *
 * This is a lightweight copy of the Job schema from the main backend.
 * It connects to the SAME MongoDB database and the SAME "jobs" collection,
 * allowing the AI service to query jobs to give job suggestions.
 *
 * IMPORTANT: If you change the Job schema in the backend,
 * update the relevant fields here too.
 */
const jobRefSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    location: {
      type: String,
      default: "Remote",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft", "Paused"],
      default: "Active",
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    employeeCount: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Use the same collection name "jobs" as the backend
module.exports = mongoose.model("Job", jobRefSchema);

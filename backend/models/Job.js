const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    // From your schema
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
      ref: "Recruiter",
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
    // From teammates' schema
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    jobType: {
      type: String,
      default: "",
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);

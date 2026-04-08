const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recruiter name is required"],
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
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    employeeCount: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    companyCulture: {
      badge: {
        type: String,
        default: "",
      },
      coreValues: {
        type: String,
        default: "",
      },
      tags: {
        type: [String],
        default: [],
      },
      communicationStyle: {
        type: String,
        default: "",
      },
      teamworkNorms: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recruiter", recruiterSchema);

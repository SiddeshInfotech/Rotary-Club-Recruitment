const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    // Use this for Full-time/Internship logic
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    // The new 3-option logic
    locationType: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      required: true,
    },
    location: { type: String, trim: true }, // The City Name
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft", "Paused"],
      default: "Active",
    },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, trim: true },
    skillsRequired: { type: [String], default: [] },

    // Add this line to your jobSchema
companyWebsite: { type: String, trim: true },
    
    // NEW: Detailed Criteria
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
      required: true,
    },
    shift: { type: String, enum: ["Day", "Night", "Flexible"], default: "Day" },
    salary: {
           min: { 
          type: Number, 
          min: [0, "Salary cannot be negative"] 
                },
          max: { 
          type: Number, 
          min: [0, "Salary cannot be negative"] 
  },
  currency: { type: String, default: "INR" }
},
    education: {
      qualification: { type: String, enum: ["Graduate", "Post Graduate", "Undergraduate", "Any"] },
      allowBacklogs: { type: Boolean, default: false }
    },
    description: { type: String },

    // --- LEGACY FIELDS (Kept to prevent team errors) ---
    employeeCount: { type: String, default: "" },
    jobType: { type: String, default: "" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);